import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// WCAG 2.2 AA over every theme block in globals.css (default) and seasons.css (7 seasons, day and night).
// Text needs 4.5:1; the focus ring and the gold used for icons and bead states need 3:1 (non-text, 1.4.11).

type RGB = [number, number, number];

function parseColor(value: string): RGB | null {
  const v = value.trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(v);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => c / 255) as RGB;
  }
  const ok = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(v);
  if (!ok) return null; // alpha colors (borders) and anything else are not checked
  const [L, C, h] = [Number(ok[1]), Number(ok[2]), (Number(ok[3]) * Math.PI) / 180];
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  // Linear sRGB straight to luminance, clamped to gamut.
  return lin.map((c) => {
    const x = Math.min(1, Math.max(0, c));
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  }) as RGB;
}

function luminance([r, g, b]: RGB) {
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function ratio(a: RGB, b: RGB) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function themes(file: string) {
  const css = readFileSync(path.join(process.cwd(), "app", file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const out = new Map<string, Record<string, RGB>>();
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!body.includes("--background:")) continue;
    const tokens: Record<string, RGB> = {};
    for (const [, name, value] of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      const color = parseColor(value);
      if (color) tokens[name] = color;
    }
    out.set(selector.replace(/\s+/g, " ").trim(), tokens);
  }
  return out;
}

const all = new Map([...themes("globals.css"), ...themes("seasons.css")]);

const TEXT: [string, string][] = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "card"],
  ["accent-foreground", "accent"],
  ["destructive", "background"],
  ["sidebar-foreground", "sidebar"],
];
const NON_TEXT: [string, string][] = [
  ["ring", "background"],
  ["ring", "card"],
  ["gold", "background"],
  ["gold", "card"],
];

describe("theme contrast (WCAG 2.2 AA)", () => {
  it("found the default and season themes", () => {
    expect(all.size).toBeGreaterThanOrEqual(16);
  });

  for (const [selector, t] of all) {
    describe(selector, () => {
      for (const [fg, bg] of TEXT) {
        if (!t[fg] || !t[bg]) continue;
        it(`${fg} on ${bg} is at least 4.5:1`, () => {
          expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
        });
      }
      for (const [fg, bg] of NON_TEXT) {
        if (!t[fg] || !t[bg]) continue;
        it(`${fg} on ${bg} is at least 3:1`, () => {
          expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(3);
        });
      }
    });
  }
});
