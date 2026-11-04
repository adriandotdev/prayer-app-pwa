import "server-only";

import { cache } from "react";

import type { StatsRow } from "@/lib/rosary/stats";
import { createClient } from "@/lib/supabase/server";

const STATS_ROW_CAP = 5000;

/** Memoized per request: the stats and calendar cards both read it. */
export const getRosaryStatsRows = cache(async (): Promise<StatsRow[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rosary_sessions")
    .select("id, mystery_set, completed_at, intentions(text)")
    .order("completed_at", { ascending: false })
    .limit(STATS_ROW_CAP);
  return (data ?? []).map((r) => ({
    id: r.id,
    mystery_set: r.mystery_set,
    completed_at: r.completed_at,
    intention_text: r.intentions?.text ?? null,
  }));
});
