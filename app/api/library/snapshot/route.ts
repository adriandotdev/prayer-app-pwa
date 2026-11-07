import { NextResponse, type NextRequest } from "next/server";

import { listAllForSync as listCollectionsForSync } from "@/lib/collections/queries";
import { LIBRARY_SCHEMA, type LibrarySnapshot } from "@/lib/library/types";
import { listAllForSync as listPrayersForSync } from "@/lib/prayers/queries";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/validation";

const NO_STORE = { "Cache-Control": "private, no-store" };
/** Re-read changes this far before `since`, so clock skew between app and database can't hide an edit. */
const OVERLAP_MS = 5 * 60 * 1000;

/**
 * The signed-in user's library for the offline copy. Prayers come as a delta when the client says
 * what it already holds (`since`, for the same `uid`); everything else is small and sent whole.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to sync your library." }, { status: 401, headers: NO_STORE });

  const params = request.nextUrl.searchParams;
  const sinceMs = Date.parse(params.get("since") ?? "");
  // A delta is only meaningful against this same user's copy, at the same schema version.
  const wantsDelta =
    Number.isFinite(sinceMs) &&
    params.get("uid") === user.id &&
    isUuid(user.id) &&
    params.get("schema") === String(LIBRARY_SCHEMA);
  const since = wantsDelta ? new Date(sinceMs - OVERLAP_MS).toISOString() : undefined;

  try {
    const [prayers, collections] = await Promise.all([listPrayersForSync(since), listCollectionsForSync()]);
    const body: LibrarySnapshot = {
      v: LIBRARY_SCHEMA,
      userId: user.id,
      full: !since,
      prayers: prayers.prayers,
      allPrayerIds: prayers.allPrayerIds,
      favorites: prayers.favorites,
      collections: collections.collections,
      collectionPrayers: collections.collectionPrayers,
    };
    return NextResponse.json(body, { headers: NO_STORE });
  } catch (error) {
    console.error("library snapshot failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Could not load your library." }, { status: 500, headers: NO_STORE });
  }
}
