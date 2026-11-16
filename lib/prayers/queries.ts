import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { fetchAllPages } from "@/lib/supabase/paginate";
import type { Tables } from "@/lib/database.types";
import { isUuid } from "@/lib/validation";
import type { PrayerFilter } from "./schema";
import { searchTerms } from "./search";

export type Prayer = Pick<Tables<"prayers">, "id" | "user_id" | "title" | "body" | "source" | "updated_at">;

const COLUMNS = "id, user_id, title, body, source, updated_at";

export async function getFavoriteIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("prayer_favorites").select("prayer_id");
  return new Set((data ?? []).map((r) => r.prayer_id));
}

/** RLS already limits rows to the starter library plus the signed-in user's own prayers. */
export async function listPrayers(filter: PrayerFilter, favoriteIds: Set<string>, search = ""): Promise<Prayer[]> {
  const supabase = await createClient();
  let query = supabase.from("prayers").select(COLUMNS).order("title");

  if (filter === "mine") query = query.not("user_id", "is", null);
  else if (filter === "starter") query = query.is("user_id", null);
  else if (filter === "favorites") {
    if (favoriteIds.size === 0) return [];
    query = query.in("id", [...favoriteIds]);
  }

  // Every typed word must appear (as part of a word) in the title or body. Not full-text
  // search on purpose: English full-text drops stop words like "our", so "Our" would never
  // find "Our Father", and it can't match a half-typed word while the visitor is typing.
  for (const term of searchTerms(search)) {
    query = query.or(`title.ilike.%${term}%,body.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error("Could not load prayers.");
  return data ?? [];
}

/**
 * Everything the offline copy needs: prayers (only those changed after `since` when given), the id of
 * every visible prayer (so deletions propagate) and the user's favorite ids.
 */
export async function listAllForSync(since?: string) {
  const supabase = await createClient();
  const [prayers, allIds, favorites] = await Promise.all([
    fetchAllPages<Prayer>((from, to) => {
      let q = supabase.from("prayers").select(COLUMNS).order("id").range(from, to);
      if (since) q = q.gt("updated_at", since);
      return q;
    }),
    fetchAllPages<{ id: string }>((from, to) => supabase.from("prayers").select("id").order("id").range(from, to)),
    fetchAllPages<{ prayer_id: string }>((from, to) =>
      supabase.from("prayer_favorites").select("prayer_id").order("prayer_id").range(from, to),
    ),
  ]);
  return { prayers, allPrayerIds: allIds.map((r) => r.id), favorites: favorites.map((r) => r.prayer_id) };
}

/** Cached per request: the page and its generateMetadata both call it. */
export const getPrayer = cache(async (id: string): Promise<Prayer | null> => {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("prayers").select(COLUMNS).eq("id", id).maybeSingle();
  return data;
});
