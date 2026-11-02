import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { MysterySetId } from "@/data/rosary/mysteries";

export type RosarySession = { id: string; mystery_set: MysterySetId; completed_at: string };

export async function getRosaryHistory(limit = 10): Promise<{ total: number; recent: RosarySession[] }> {
  const supabase = await createClient();
  const { data, count } = await supabase
    .from("rosary_sessions")
    .select("id, mystery_set, completed_at", { count: "exact" })
    .order("completed_at", { ascending: false })
    .limit(limit);
  return { total: count ?? 0, recent: (data ?? []) as RosarySession[] };
}

const STATS_ROW_CAP = 5000;

export async function getRosaryStatsRows(): Promise<{ mystery_set: string; completed_at: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rosary_sessions")
    .select("mystery_set, completed_at")
    .order("completed_at", { ascending: false })
    .limit(STATS_ROW_CAP);
  return data ?? [];
}
