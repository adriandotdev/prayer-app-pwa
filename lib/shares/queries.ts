import "server-only";

import { cache } from "react";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { isSeasonChoice, type SeasonChoice } from "@/lib/theme/season";
import { isShareToken, isUuid } from "@/lib/validation";

export type ShareKind = "prayer" | "collection";

const toSeason = (value: string): SeasonChoice => (isSeasonChoice(value) ? value : "default");

export type SharedPrayer = { kind: "prayer"; title: string; body: string; source: string | null; season: SeasonChoice };
export type SharedCollection = {
  kind: "collection";
  name: string;
  season: SeasonChoice;
  prayers: { id: string; title: string; body: string; source: string | null }[];
};

/** The signed-in owner's token for an item they already shared, or null. RLS limits rows to their own. */
export async function getShareToken(kind: ShareKind, id: string): Promise<string | null> {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("shares")
    .select("token")
    .eq(kind === "prayer" ? "prayer_id" : "collection_id", id)
    .maybeSingle();
  return data?.token ?? null;
}

/**
 * An anonymous, cookie-free client: a share link works the same signed in or out, and a public
 * page must not read or refresh anyone's session. Null when Supabase isn't configured.
 */
function publicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

/** Cached per request: the page and its generateMetadata both call it. Null for any unknown token. */
export const getShared = cache(async (token: string): Promise<SharedPrayer | SharedCollection | null> => {
  if (!isShareToken(token)) return null;
  const supabase = publicClient();
  if (!supabase) return null;

  const prayer = await supabase.rpc("get_shared_prayer", { p_token: token });
  const row = prayer.data?.[0];
  if (row) return { kind: "prayer", title: row.title, body: row.body, source: row.source, season: toSeason(row.season) };

  const collection = await supabase.rpc("get_shared_collection", { p_token: token });
  const rows = collection.data ?? [];
  if (rows.length === 0) return null;
  return {
    kind: "collection",
    name: rows[0].collection_name,
    season: toSeason(rows[0].season),
    prayers: rows
      .filter((r) => r.prayer_id !== null)
      .map((r) => ({ id: r.prayer_id, title: r.title, body: r.body, source: r.source })),
  };
});
