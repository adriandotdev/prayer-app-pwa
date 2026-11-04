import { describe, expect, it } from "vitest";
import { computeRosaryStats, type StatsRow } from "@/lib/rosary/stats";

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);
const row = (date: Date, mystery_set = "joyful"): StatsRow => ({ mystery_set, completed_at: date.toISOString() });

const NOW = at(2026, 3, 10);

describe("computeRosaryStats", () => {
  it("is all zeros with no sessions", () => {
    const stats = computeRosaryStats([], NOW);
    expect(stats).toMatchObject({ total: 0, decades: 0, currentStreak: 0, bestStreak: 0 });
    expect(Object.values(stats.bySet).every((n) => n === 0)).toBe(true);
  });

  it("counts total, decades and per-set sessions, ignoring unknown sets in bySet", () => {
    const stats = computeRosaryStats(
      [row(at(2026, 3, 10), "joyful"), row(at(2026, 3, 9), "glorious"), row(at(2026, 3, 8), "joyful"), row(at(2026, 3, 7), "mystery")],
      NOW,
    );
    expect(stats.total).toBe(4);
    expect(stats.decades).toBe(20);
    expect(stats.bySet).toMatchObject({ joyful: 2, glorious: 1, sorrowful: 0, luminous: 0 });
  });

  it("counts a streak that includes today", () => {
    const stats = computeRosaryStats([row(at(2026, 3, 10)), row(at(2026, 3, 9)), row(at(2026, 3, 8))], NOW);
    expect(stats.currentStreak).toBe(3);
  });

  it("keeps the streak alive when today has no Rosary yet", () => {
    const stats = computeRosaryStats([row(at(2026, 3, 9)), row(at(2026, 3, 8))], NOW);
    expect(stats.currentStreak).toBe(2);
  });

  it("drops the current streak after a whole missed day but keeps the best", () => {
    const stats = computeRosaryStats([row(at(2026, 3, 8)), row(at(2026, 3, 7)), row(at(2026, 3, 6))], NOW);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(3);
  });

  it("counts several sessions on one day as one streak day", () => {
    const stats = computeRosaryStats([row(at(2026, 3, 10, 7)), row(at(2026, 3, 10, 21)), row(at(2026, 3, 9))], NOW);
    expect(stats.currentStreak).toBe(2);
    expect(stats.total).toBe(3);
  });

  it("finds the best streak even when it is older than the current one", () => {
    const rows = [row(at(2026, 3, 10)), row(at(2026, 3, 1)), row(at(2026, 2, 28)), row(at(2026, 2, 27)), row(at(2026, 2, 26))];
    const stats = computeRosaryStats(rows, NOW);
    expect(stats.currentStreak).toBe(1);
    expect(stats.bestStreak).toBe(4);
  });

  it("runs a streak across month and year boundaries", () => {
    const rows = [row(at(2026, 1, 1)), row(at(2025, 12, 31)), row(at(2025, 12, 30))];
    expect(computeRosaryStats(rows, at(2026, 1, 1)).currentStreak).toBe(3);
  });

  it("buckets by local day, not UTC", () => {
    // 23:30 and 00:30 local are consecutive days whichever zone the tests run in.
    const stats = computeRosaryStats([row(at(2026, 3, 9, 23)), row(at(2026, 3, 10, 0))], NOW);
    expect(stats.currentStreak).toBe(2);
  });

  it("keeps day counting exact across DST changes", () => {
    // US spring-forward (Mar 8 2026) and fall-back (Nov 1 2026): 23h and 25h local days.
    expect(computeRosaryStats([row(at(2026, 3, 7)), row(at(2026, 3, 8)), row(at(2026, 3, 9))], at(2026, 3, 9)).bestStreak).toBe(3);
    expect(computeRosaryStats([row(at(2026, 10, 31)), row(at(2026, 11, 1)), row(at(2026, 11, 2))], at(2026, 11, 2)).bestStreak).toBe(3);
  });
});
