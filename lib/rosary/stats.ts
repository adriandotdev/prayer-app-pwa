import { MYSTERY_SET_ORDER, type MysterySetId } from "@/data/rosary/mysteries";

export type StatsRow = { mystery_set: string; completed_at: string };

export type RosaryStats = {
  total: number;
  decades: number;
  currentStreak: number;
  bestStreak: number;
  bySet: Record<MysterySetId, number>;
};

const DECADES_PER_ROSARY = 5;

/** Local calendar day as a whole-day index; noon-anchored UTC math keeps DST days exact. */
function dayIndex(d: Date): number {
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/**
 * Days are bucketed in the runtime's local time zone, so call this on the client.
 * The current streak stays alive until a whole day is missed: if today has no
 * Rosary yet, it still counts back from yesterday.
 */
export function computeRosaryStats(rows: StatsRow[], now: Date): RosaryStats {
  const bySet = Object.fromEntries(MYSTERY_SET_ORDER.map((id) => [id, 0])) as Record<MysterySetId, number>;
  const days = new Set<number>();

  for (const row of rows) {
    if (row.mystery_set in bySet) bySet[row.mystery_set as MysterySetId] += 1;
    days.add(dayIndex(new Date(row.completed_at)));
  }

  const sorted = [...days].sort((a, b) => a - b);
  let bestStreak = 0;
  let run = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
  }

  const today = dayIndex(now);
  let cursor = days.has(today) ? today : today - 1;
  let currentStreak = 0;
  while (days.has(cursor)) {
    currentStreak += 1;
    cursor -= 1;
  }

  return { total: rows.length, decades: rows.length * DECADES_PER_ROSARY, currentStreak, bestStreak, bySet };
}
