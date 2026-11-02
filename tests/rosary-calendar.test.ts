import { describe, expect, it } from "vitest";
import { addMonths, buildMonthGrid, compareMonths, earliestMonth } from "@/lib/rosary/calendar";
import type { StatsRow } from "@/lib/rosary/stats";

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);
const row = (date: Date, mystery_set = "joyful"): StatsRow => ({ mystery_set, completed_at: date.toISOString() });

describe("buildMonthGrid", () => {
  it.each([
    [2026, 2, 4], // Feb 2026 starts on Sunday and has 28 days
    [2026, 3, 5], // Mar 2026
    [2026, 8, 6], // Aug 2026 starts on Saturday and has 31 days
  ])("%i-%i spans %i weeks of 7 days", (y, m, weeks) => {
    const grid = buildMonthGrid(y, m - 1, []);
    expect(grid).toHaveLength(weeks);
    expect(grid.every((w) => w.length === 7)).toBe(true);
  });

  it("starts weeks on Sunday and pads with days from the neighbouring months", () => {
    const grid = buildMonthGrid(2026, 2, []); // March 2026 starts on a Sunday
    expect(grid[0][0].date.getDate()).toBe(1);
    expect(grid[0][0].inMonth).toBe(true);

    const may = buildMonthGrid(2026, 4, []); // May 1 2026 is a Friday
    expect(may[0].filter((d) => !d.inMonth)).toHaveLength(5);
    expect(may[0][5].date.getDate()).toBe(1);
  });

  it("handles leap-year February", () => {
    const days = buildMonthGrid(2028, 1, []).flat().filter((d) => d.inMonth);
    expect(days).toHaveLength(29);
    expect(buildMonthGrid(2027, 1, []).flat().filter((d) => d.inMonth)).toHaveLength(28);
  });

  it("counts sessions and distinct sets per local day", () => {
    const rows = [row(at(2026, 3, 10, 7), "joyful"), row(at(2026, 3, 10, 21), "joyful"), row(at(2026, 3, 10, 22), "glorious"), row(at(2026, 3, 11))];
    const days = buildMonthGrid(2026, 2, rows).flat().filter((d) => d.inMonth);
    expect(days.find((d) => d.date.getDate() === 10)).toMatchObject({ count: 3, sets: ["joyful", "glorious"] });
    expect(days.find((d) => d.date.getDate() === 11)).toMatchObject({ count: 1, sets: ["joyful"] });
    expect(days.find((d) => d.date.getDate() === 12)).toMatchObject({ count: 0, sets: [] });
  });

  it("buckets late-night and just-after-midnight sessions on their own local days", () => {
    const rows = [row(at(2026, 3, 9, 23)), row(at(2026, 3, 10, 0))];
    const days = buildMonthGrid(2026, 2, rows).flat();
    expect(days.find((d) => d.inMonth && d.date.getDate() === 9)?.count).toBe(1);
    expect(days.find((d) => d.inMonth && d.date.getDate() === 10)?.count).toBe(1);
  });

  it("shows sessions on padding days from the adjacent month", () => {
    const days = buildMonthGrid(2026, 4, [row(at(2026, 4, 30))]).flat(); // May grid begins with Apr 26
    expect(days.find((d) => !d.inMonth && d.date.getDate() === 30)?.count).toBe(1);
  });

  it("ignores unknown mystery sets", () => {
    const days = buildMonthGrid(2026, 2, [row(at(2026, 3, 10), "nope")]).flat();
    expect(days.every((d) => d.count === 0)).toBe(true);
  });
});

describe("month helpers", () => {
  it("adds months across year boundaries", () => {
    expect(addMonths({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 });
    expect(addMonths({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 });
  });

  it("compares months", () => {
    expect(compareMonths({ year: 2026, month: 2 }, { year: 2026, month: 2 })).toBe(0);
    expect(compareMonths({ year: 2025, month: 11 }, { year: 2026, month: 0 })).toBeLessThan(0);
    expect(compareMonths({ year: 2026, month: 5 }, { year: 2026, month: 1 })).toBeGreaterThan(0);
  });

  it("finds the earliest month with a session", () => {
    expect(earliestMonth([])).toBeNull();
    expect(earliestMonth([row(at(2026, 3, 10)), row(at(2025, 12, 31)), row(at(2026, 1, 5))])).toEqual({ year: 2025, month: 11 });
  });
});
