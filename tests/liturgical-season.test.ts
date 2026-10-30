import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SEASONS, SEASON_BACKGROUNDS, SEASON_INIT_SCRIPT, seasonForDate } from "@/lib/theme/season";

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);

describe("seasonForDate", () => {
  it.each([
    [2024, 3, 31],
    [2025, 4, 20],
    [2026, 4, 5],
    [2027, 3, 28],
    [2028, 4, 16],
    [2029, 4, 1],
    [2030, 4, 21],
  ])("Easter %i is %i-%i and is gold", (y, m, d) => {
    expect(seasonForDate(day(y, m, d))).toBe("gold");
  });

  it("walks Lent and Easter 2026 (Easter is Apr 5)", () => {
    expect(seasonForDate(day(2026, 2, 17))).toBe("green"); // Shrove Tuesday
    expect(seasonForDate(day(2026, 2, 18))).toBe("violet"); // Ash Wednesday
    expect(seasonForDate(day(2026, 3, 15))).toBe("rose"); // Laetare
    expect(seasonForDate(day(2026, 3, 29))).toBe("red"); // Palm Sunday
    expect(seasonForDate(day(2026, 4, 3))).toBe("red"); // Good Friday
    expect(seasonForDate(day(2026, 4, 4))).toBe("violet"); // Holy Saturday
    expect(seasonForDate(day(2026, 4, 6))).toBe("white"); // Easter Monday
    expect(seasonForDate(day(2026, 5, 23))).toBe("white"); // eve of Pentecost
    expect(seasonForDate(day(2026, 5, 24))).toBe("red"); // Pentecost
    expect(seasonForDate(day(2026, 5, 25))).toBe("green");
  });

  it("walks Advent and Christmas 2026 (Advent begins Nov 29)", () => {
    expect(seasonForDate(day(2026, 11, 2))).toBe("black");
    expect(seasonForDate(day(2026, 11, 28))).toBe("green");
    expect(seasonForDate(day(2026, 11, 29))).toBe("violet");
    expect(seasonForDate(day(2026, 12, 13))).toBe("rose"); // Gaudete
    expect(seasonForDate(day(2026, 12, 24))).toBe("violet");
    expect(seasonForDate(day(2026, 12, 25))).toBe("gold");
    expect(seasonForDate(day(2026, 12, 26))).toBe("white");
    expect(seasonForDate(day(2027, 1, 10))).toBe("white"); // Jan 6 2027 is a Wednesday
    expect(seasonForDate(day(2027, 1, 11))).toBe("green");
  });

  it("only ever returns a known season", () => {
    for (let d = new Date(2026, 0, 1); d.getFullYear() === 2026; d.setDate(d.getDate() + 1)) {
      expect(SEASONS).toContain(seasonForDate(d));
    }
  });
});

describe("SEASON_INIT_SCRIPT", () => {
  function run(stored: string | null) {
    const attrs: Record<string, string> = {};
    const storage = { getItem: () => stored };
    const doc = { documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) } };
    new Function("localStorage", "document", SEASON_INIT_SCRIPT)(storage, doc);
    return attrs;
  }

  afterEach(() => vi.useRealTimers());

  it("sets a fixed season as stored", () => {
    expect(run("green")).toEqual({ "data-season": "green" });
  });

  it("ignores default, unknown and missing choices", () => {
    expect(run("default")).toEqual({});
    expect(run("nonsense")).toEqual({});
    expect(run(null)).toEqual({});
  });

  it("sets the status-bar colour and remembers the original", () => {
    const meta = { content: "#ffffff", dataset: {} as Record<string, string> };
    const doc = {
      documentElement: { setAttribute: () => {} },
      querySelectorAll: () => [meta],
      addEventListener: () => {},
    };
    const storage = { getItem: (k: string) => (k === "theme" ? "dark" : "violet") };
    new Function("localStorage", "document", "matchMedia", SEASON_INIT_SCRIPT)(storage, doc, () => ({ matches: false }));
    expect(meta.content).toBe(SEASON_BACKGROUNDS.violet.dark);
    expect(meta.dataset.oraOriginal).toBe("#ffffff");
  });

  it("evaluates the inlined calendar the same as seasonForDate", () => {
    vi.useFakeTimers();
    for (const [y, m, d] of [[2026, 4, 5], [2026, 12, 13], [2026, 7, 1], [2026, 3, 29]]) {
      vi.setSystemTime(day(y, m, d));
      expect(run("auto")).toEqual({ "data-season": seasonForDate(new Date()) });
    }
  });
});

describe("SEASON_BACKGROUNDS", () => {
  const css = readFileSync(path.join(__dirname, "../app/seasons.css"), "utf8");
  const background = (selector: string) =>
    css.match(new RegExp(`:root\\[data-season="${selector}"\\],[\\s\\S]*?--background:\\s*(#[0-9A-Fa-f]{6})`))?.[1];

  it.each(SEASONS)("%s matches seasons.css", (season) => {
    expect(background(season)?.toLowerCase()).toBe(SEASON_BACKGROUNDS[season].light.toLowerCase());
    const dark = css.match(new RegExp(`:root\\[data-season="${season}"\\]\\.dark,[\\s\\S]*?--background:\\s*(#[0-9A-Fa-f]{6})`))?.[1];
    expect(dark?.toLowerCase()).toBe(SEASON_BACKGROUNDS[season].dark.toLowerCase());
  });
});
