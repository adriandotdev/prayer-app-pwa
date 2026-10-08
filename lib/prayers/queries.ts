import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";
import type { PrayerFilter } from "./schema";

export type Prayer = Pick<Tables<"prayers">, "id" | "user_id" | "title" | "body" | "source" | "updated_at">;

const COLUMNS = "id, user_id, title, body, source, updated_at";

export async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("prayer_favorites").select("prayer_id");
  return new Set((data ?? []).map((r) => r.prayer_id));
}

/** RLS already limits rows to the starter library plus the signed-in user's own prayers. */
export async function listPrayers(filter: PrayerFilter, favoriteIds: Set<string>): Promise<Prayer[]> {
  const supabase = await createClient();
  let query = supabase.from("prayers").select(COLUMNS).order("title");

  if (filter === "mine") query = query.not("user_id", "is", null);
  else if (filter === "starter") query = query.is("user_id", null);
  else if (filter === "favorites") {
    if (favoriteIds.size === 0) return [];
    query = query.in("id", [...favoriteIds]);
  }

  const { data, error } = await query;
  if (error) throw new Error("Could not load prayers.");
  return data ?? [];
}

export async function getPrayer(id: string): Promise<Prayer | null> {
  // A malformed id would make Postgres reject the uuid; treat it as not found.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("prayers").select(COLUMNS).eq("id", id).maybeSingle();
  return data;
}
