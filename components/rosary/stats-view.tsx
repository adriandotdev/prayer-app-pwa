"use client";

import { useMemo, useSyncExternalStore } from "react";

import { MYSTERY_SET_ORDER, MYSTERY_SETS } from "@/data/rosary/mysteries";
import { computeRosaryStats, type StatsRow } from "@/lib/rosary/stats";

const noop = () => () => {};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-secondary/60 px-4 py-3">
      <dd className="font-heading text-3xl text-primary">{value}</dd>
      <dt className="text-sm text-muted-foreground">{label}</dt>
    </div>
  );
}

/** Days are bucketed in the viewer's time zone, so stats are computed on the client. */
export function RosaryStatsView({ rows }: { rows: StatsRow[] }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const stats = useMemo(() => (mounted ? computeRosaryStats(rows, new Date()) : null), [mounted, rows]);

  if (!stats) {
    return <div className="mt-4 h-40 animate-pulse rounded-2xl bg-secondary/60" aria-hidden />;
  }

  return (
    <>
      <p className="mt-1 text-sm text-muted-foreground">
        {stats.currentStreak > 0
          ? `${stats.currentStreak} ${stats.currentStreak === 1 ? "day" : "days"} of prayer in a row`
          : "Begin whenever you're ready."}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Rosaries" value={stats.total} />
        <Stat label="Decades" value={stats.decades} />
        <Stat label="Current streak" value={stats.currentStreak} />
        <Stat label="Best streak" value={stats.bestStreak} />
      </dl>
      <ul className="mt-4 flex flex-col gap-1">
        {MYSTERY_SET_ORDER.map((id) => (
          <li key={id} className="flex min-h-12 items-center justify-between gap-3 rounded-2xl px-4 py-3 odd:bg-secondary/60">
            <span className="font-medium">{MYSTERY_SETS[id].name}</span>
            <span className="text-sm text-muted-foreground">{stats.bySet[id]}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
