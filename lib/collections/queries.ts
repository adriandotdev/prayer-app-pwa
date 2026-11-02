import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";
import type { Prayer } from "@/lib/prayers/queries";
import { isUuid } from "@/lib/validation";

export type Collection = Pick<Tables<"collections">, "id" | "name">;
export type CollectionWithCount = Collection & { count: number };

/** RLS limits rows to the signed-in user's own collections. */
export async function listCollections(): Promise<CollectionWithCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, name, collection_prayers(count)")
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error("Could not load collections.");
  return (data ?? []).map((c) => ({ id: c.id, name: c.name, count: c.collection_prayers[0]?.count ?? 0 }));
}

export async function getCollection(id: string): Promise<Collection | null> {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("collections").select("id, name").eq("id", id).maybeSingle();
  return data;
}

export async function getCollectionPrayers(collectionId: string): Promise<Prayer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collection_prayers")
    .select("prayers(id, user_id, title, body, source, updated_at)")
    .eq("collection_id", collectionId);
  if (error) throw new Error("Could not load this collection.");
  return (data ?? [])
    .map((row) => row.prayers)
    .filter((p): p is Prayer => p !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Which of the user's collections already contain this prayer. */
export async function getCollectionIdsForPrayer(prayerId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("collection_prayers").select("collection_id").eq("prayer_id", prayerId);
  return new Set((data ?? []).map((r) => r.collection_id));
}

export async function getPrayerIdsInCollection(collectionId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("collection_prayers").select("prayer_id").eq("collection_id", collectionId);
  return new Set((data ?? []).map((r) => r.prayer_id));
}
