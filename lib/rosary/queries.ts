import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

const STATS_ROW_CAP = 5000;

/** Memoized per request: the stats and calendar cards both read it. */
export const getRosaryStatsRows = cache(async (): Promise<{ mystery_set: string; completed_at: string }[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rosary_sessions")
    .select("mystery_set, completed_at")
    .order("completed_at", { ascending: false })
    .limit(STATS_ROW_CAP);
  return data ?? [];
});
