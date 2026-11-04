export type ReadingTheme = "auto" | "sepia" | "night";

export type ReaderPrefs = {
  /** Multiplier on the prayer text size (`--prayer-scale`). */
  scale: number;
  /** Unitless line-height of the prayer text (`--prayer-leading`). */
  leading: number;
  theme: ReadingTheme;
  /** Hold a screen wake lock while a prayer is open. */
  keepAwake: boolean;
};

export const READER_STORAGE_KEY = "ora:reader:v1";

export const READING_THEMES: readonly ReadingTheme[] = ["auto", "sepia", "night"];

export const SCALE_RANGE = { min: 0.85, max: 1.5, step: 0.05 } as const;
export const LEADING_RANGE = { min: 1.5, max: 2.1, step: 0.05 } as const;

export const DEFAULT_PREFS: ReaderPrefs = { scale: 1, leading: 1.75, theme: "auto", keepAwake: true };

type Range = { min: number; max: number; step: number };

/** Clamps to the range and snaps to its step, so repeated +/- never drifts (0.1 + 0.2 style). */
export function clampToRange(value: number, { min, max, step }: Range): number {
  const clamped = Math.min(max, Math.max(min, value));
  const snapped = Math.round((clamped - min) / step) * step + min;
  return Number(Math.min(max, snapped).toFixed(2));
}

export function isReadingTheme(value: unknown): value is ReadingTheme {
  return READING_THEMES.includes(value as ReadingTheme);
}

/** Tolerant of missing, corrupt or out-of-range storage: anything unusable falls back to the default. */
export function parsePrefs(raw: string | null | undefined): ReaderPrefs {
  if (!raw) return DEFAULT_PREFS;
  let value: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_PREFS;
    value = parsed as Record<string, unknown>;
  } catch {
    return DEFAULT_PREFS;
  }
  return {
    scale: typeof value.scale === "number" && Number.isFinite(value.scale) ? clampToRange(value.scale, SCALE_RANGE) : DEFAULT_PREFS.scale,
    leading:
      typeof value.leading === "number" && Number.isFinite(value.leading)
        ? clampToRange(value.leading, LEADING_RANGE)
        : DEFAULT_PREFS.leading,
    theme: isReadingTheme(value.theme) ? value.theme : DEFAULT_PREFS.theme,
    keepAwake: typeof value.keepAwake === "boolean" ? value.keepAwake : DEFAULT_PREFS.keepAwake,
  };
}

export function serializePrefs(prefs: ReaderPrefs): string {
  return JSON.stringify(prefs);
}

/** The slice of `<html>` that preferences are written to; lets tests use a plain stub. */
export type PrefsRoot = {
  style: { setProperty(name: string, value: string): void };
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
};

export function applyPrefs(prefs: ReaderPrefs, root: PrefsRoot) {
  root.style.setProperty("--prayer-scale", String(prefs.scale));
  root.style.setProperty("--prayer-leading", String(prefs.leading));
  if (prefs.theme === "auto") root.removeAttribute("data-reading");
  else root.setAttribute("data-reading", prefs.theme);
}

/**
 * Source of the <head> script that applies stored preferences before first paint. It repeats the
 * clamping of `parsePrefs` in plain JS (the script cannot import), and `tests/reader-preferences`
 * keeps the two in agreement.
 */
export const READER_INIT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(READER_STORAGE_KEY)})||"null");if(!p||typeof p!=="object")return;var r=document.documentElement,c=function(v,a){if(typeof v!=="number"||!isFinite(v))return null;v=Math.min(a.max,Math.max(a.min,v));return Math.min(a.max,Math.round((v-a.min)/a.step)*a.step+a.min).toFixed(2)*1};var s=c(p.scale,${JSON.stringify(SCALE_RANGE)}),l=c(p.leading,${JSON.stringify(LEADING_RANGE)});if(s!==null)r.style.setProperty("--prayer-scale",String(s));if(l!==null)r.style.setProperty("--prayer-leading",String(l));if(p.theme==="sepia"||p.theme==="night")r.setAttribute("data-reading",p.theme)}catch(e){}})()`;
