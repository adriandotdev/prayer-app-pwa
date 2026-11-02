import { describe, expect, it } from "vitest";
import {
  DEFAULT_PREFS,
  LEADING_RANGE,
  READER_INIT_SCRIPT,
  SCALE_RANGE,
  applyPrefs,
  clampToRange,
  parsePrefs,
  serializePrefs,
} from "@/lib/reader/preferences";

describe("clampToRange", () => {
  it("clamps to the ends", () => {
    expect(clampToRange(0.1, SCALE_RANGE)).toBe(SCALE_RANGE.min);
    expect(clampToRange(9, SCALE_RANGE)).toBe(SCALE_RANGE.max);
  });

  it("snaps to the step so repeated steps never drift", () => {
    let v: number = SCALE_RANGE.min;
    for (let i = 0; i < 13; i++) v = clampToRange(v + SCALE_RANGE.step, SCALE_RANGE);
    expect(v).toBe(1.5);
    expect(clampToRange(1.012, SCALE_RANGE)).toBe(1);
  });
});

describe("parsePrefs", () => {
  it("returns the defaults for missing or corrupt storage", () => {
    for (const raw of [null, undefined, "", "not json", "null", "42", '"x"']) {
      expect(parsePrefs(raw)).toEqual(DEFAULT_PREFS);
    }
  });

  it("fills missing fields and rejects wrong types", () => {
    expect(parsePrefs('{"theme":"sepia"}')).toEqual({ ...DEFAULT_PREFS, theme: "sepia" });
    expect(parsePrefs('{"scale":"big","leading":null,"theme":"neon","keepAwake":"yes"}')).toEqual(DEFAULT_PREFS);
  });

  it("clamps out-of-range numbers", () => {
    const p = parsePrefs('{"scale":5,"leading":0.2}');
    expect(p.scale).toBe(SCALE_RANGE.max);
    expect(p.leading).toBe(LEADING_RANGE.min);
  });

  it("round-trips", () => {
    const prefs = { scale: 1.2, leading: 1.9, theme: "night" as const, keepAwake: false };
    expect(parsePrefs(serializePrefs(prefs))).toEqual(prefs);
  });
});

function fakeRoot() {
  const style: Record<string, string> = {};
  const attrs: Record<string, string> = {};
  return {
    style,
    attrs,
    root: {
      style: { setProperty: (k: string, v: string) => (style[k] = v) },
      setAttribute: (k: string, v: string) => (attrs[k] = v),
      removeAttribute: (k: string) => delete attrs[k],
    },
  };
}

describe("applyPrefs", () => {
  it("writes the variables and sets or clears the reading theme", () => {
    const { root, style, attrs } = fakeRoot();
    applyPrefs({ scale: 1.25, leading: 2, theme: "sepia", keepAwake: true }, root);
    expect(style).toEqual({ "--prayer-scale": "1.25", "--prayer-leading": "2" });
    expect(attrs).toEqual({ "data-reading": "sepia" });
    applyPrefs(DEFAULT_PREFS, root);
    expect(attrs).toEqual({});
  });
});

describe("READER_INIT_SCRIPT", () => {
  function run(stored: string | null) {
    const { root, style, attrs } = fakeRoot();
    new Function("localStorage", "document", READER_INIT_SCRIPT)({ getItem: () => stored }, { documentElement: root });
    return { style, attrs };
  }

  it("applies stored preferences", () => {
    const out = run('{"scale":1.3,"leading":1.6,"theme":"night"}');
    expect(out.style).toEqual({ "--prayer-scale": "1.3", "--prayer-leading": "1.6" });
    expect(out.attrs).toEqual({ "data-reading": "night" });
  });

  it("does nothing for missing or corrupt storage", () => {
    for (const raw of [null, "garbage", "null"]) expect(run(raw)).toEqual({ style: {}, attrs: {} });
  });

  it("clamps and ignores bad values the same way parsePrefs does", () => {
    const raw = '{"scale":9,"leading":"wide","theme":"auto"}';
    const out = run(raw);
    expect(out.style).toEqual({ "--prayer-scale": String(parsePrefs(raw).scale) });
    expect(out.attrs).toEqual({});
  });
});
