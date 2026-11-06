import { NextResponse } from "next/server";

import { buildExport } from "@/lib/export/serialize";
import { createClient } from "@/lib/supabase/server";

/** Downloads everything Ora holds for the signed-in user as JSON. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to download your data." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  // RLS already scopes these to the user; the explicit filters keep that true if a policy
  // changes, and matter for prayers, whose select policy also returns shared starter prayers.
  const [profile, prayers, collections, favorites, intentions, rosarySessions] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("prayers").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("collections").select("*").eq("user_id", user.id).order("sort_order"),
    supabase.from("prayer_favorites").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("intentions").select("*").eq("user_id", user.id).order("created_at"),
    supabase.from("rosary_sessions").select("*").eq("user_id", user.id).order("completed_at"),
  ]);

  const failed = [profile, prayers, collections, favorites, intentions, rosarySessions].find((r) => r.error);
  if (failed?.error) {
    console.error("export failed", failed.error.message);
    return NextResponse.json({ error: "We couldn't prepare your data. Please try again." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  const collectionIds = (collections.data ?? []).map((c) => c.id);
  const collectionPrayers = collectionIds.length
    ? await supabase.from("collection_prayers").select("*").in("collection_id", collectionIds)
    : { data: [], error: null };
  if (collectionPrayers.error) {
    console.error("export failed", collectionPrayers.error.message);
    return NextResponse.json({ error: "We couldn't prepare your data. Please try again." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  const exportedAt = new Date();
  const body = buildExport({
    userId: user.id,
    email: user.email ?? null,
    profile: profile.data,
    prayers: prayers.data ?? [],
    collections: collections.data ?? [],
    collectionPrayers: collectionPrayers.data ?? [],
    favorites: favorites.data ?? [],
    intentions: intentions.data ?? [],
    rosarySessions: rosarySessions.data ?? [],
    exportedAt,
  });

  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="ora-export-${exportedAt.toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
