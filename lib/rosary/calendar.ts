import { MYSTERY_SET_ORDER, type MysterySetId } from "@/data/rosary/mysteries";
import { dayIndex, type StatsRow } from "@/lib/rosary/stats";

export type CalendarDay = {
  date: Date;
  inMonth: boolean;
  /** Rosaries finished on this local day. */
  count: number;
  /** Distinct mystery sets prayed that day, in the usual set order. */
  sets: MysterySetId[];
};

export type MonthRef = { year: number; month: number };

/** Local-day buckets, so call this on the client like `computeRosaryStats`. */
function bucketByDay(rows: StatsRow[]): Map<number, MysterySetId[]> {
  const buckets = new Map<number, MysterySetId[]>();
  for (const row of rows) {
    if (!MYSTERY_SET_ORDER.includes(row.mystery_set as MysterySetId)) continue;
    const key = dayIndex(new Date(row.completed_at));
    const list = buckets.get(key);
    if (list) list.push(row.mystery_set as MysterySetId);
    else buckets.set(key, [row.mystery_set as MysterySetId]);
  }
  return buckets;
}

/** Sunday-first weeks covering `month` (0-based); days outside the month are padding. */
export function buildMonthGrid(year: number, month: number, rows: StatsRow[]): CalendarDay[][] {
  const buckets = bucketByDay(rows);
  const lead = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((lead + daysInMonth) / 7);

  return Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: 7 }, (_, col) => {
      const date = new Date(year, month, 1 - lead + week * 7 + col);
      const sets = buckets.get(dayIndex(date)) ?? [];
      return {
        date,
        inMonth: date.getMonth() === month,
        count: sets.length,
        sets: MYSTERY_SET_ORDER.filter((id) => sets.includes(id)),
      };
    }),
  );
}

export function addMonths({ year, month }: MonthRef, delta: number): MonthRef {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/** Negative, zero or positive as `a` is before, the same as, or after `b`. */
export function compareMonths(a: MonthRef, b: MonthRef): number {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

/** The month of the oldest session, or null when there are none. */
export function earliestMonth(rows: StatsRow[]): MonthRef | null {
  let min: Date | null = null;
  for (const row of rows) {
    const d = new Date(row.completed_at);
    if (!min || d < min) min = d;
  }
  return min ? { year: min.getFullYear(), month: min.getMonth() } : null;
}

export type DaySession = { mystery_set: MysterySetId; completed_at: string };

/** Rosaries finished on the local day of `date`, earliest first. */
export function sessionsOnDay(rows: StatsRow[], date: Date): DaySession[] {
  const key = dayIndex(date);
  return rows
    .filter((r) => MYSTERY_SET_ORDER.includes(r.mystery_set as MysterySetId) && dayIndex(new Date(r.completed_at)) === key)
    .map((r) => ({ mystery_set: r.mystery_set as MysterySetId, completed_at: r.completed_at }))
    .sort((a, b) => a.completed_at.localeCompare(b.completed_at));
}
