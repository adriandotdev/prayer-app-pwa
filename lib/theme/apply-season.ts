import { SEASON_BACKGROUNDS } from "@/lib/theme/season";
import type { Season } from "@/lib/theme/liturgical-season";

/** Sets or clears <html data-season>. `null` is Ora's own palette. */
export function applySeasonAttribute(season: Season | null) {
  const root = document.documentElement;
  if (season) root.setAttribute("data-season", season);
  else root.removeAttribute("data-season");
}

/** Colours the browser's status bar to match the season, or puts the original colour back for `null`. */
export function applyThemeColor(season: Season | null, mode: "light" | "dark") {
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.dataset.oraOriginal ??= meta.content;
    meta.content = season ? SEASON_BACKGROUNDS[season][mode] : meta.dataset.oraOriginal;
  });
}
