import { SEASONS, seasonForDate, type Season } from "@/lib/theme/liturgical-season";

export { SEASONS, seasonForDate, type Season };

/** What the user picked: Ora's own palette, the liturgical year, or one fixed season. */
export type SeasonChoice = "default" | "auto" | Season;

export const SEASON_STORAGE_KEY = "ora-season";

export function isSeasonChoice(value: unknown): value is SeasonChoice {
  return value === "default" || value === "auto" || SEASONS.includes(value as Season);
}

/** Light and dark page backgrounds per season (ramp steps 50 and 950), for <meta name="theme-color">. */
export const SEASON_BACKGROUNDS: Record<Season, { light: string; dark: string }> = {
  violet: { light: "#F6F3F9", dark: "#1B1325" },
  rose: { light: "#FBF4F5", dark: "#2A1419" },
  white: { light: "#FDFCF8", dark: "#1E1B16" },
  gold: { light: "#FBF8EF", dark: "#261E0D" },
  green: { light: "#F2F6F2", dark: "#121D15" },
  red: { light: "#FCF3F2", dark: "#2A0F0E" },
  black: { light: "#F5F5F6", dark: "#131316" },
};

export const SEASON_INFO: Record<
  Season,
  { name: string; occasion: string; when: string; meaning: string; swatch: string }
> = {
  violet: { name: "Violet", occasion: "Advent or Lent", when: "Advent and Lent", meaning: "Sorrow, penitence, preparation", swatch: "#7D5A9E" },
  rose: { name: "Rose", occasion: "Gaudete or Laetare Sunday", when: "Gaudete and Laetare Sundays", meaning: "Subdued joy", swatch: "#B76177" },
  white: { name: "White", occasion: "Christmas or Easter", when: "Christmas and Easter", meaning: "Purity, victory, joy", swatch: "#E5DDCA" },
  gold: { name: "Gold", occasion: "Solemnity", when: "Solemnities", meaning: "Joy", swatch: "#B28D34" },
  green: { name: "Green", occasion: "Ordinary Time", when: "Ordinary Time", meaning: "Hope, growth", swatch: "#55835E" },
  red: { name: "Red", occasion: "Passion or Pentecost", when: "Passion, Pentecost, martyrs", meaning: "Sacrifice, the Holy Spirit", swatch: "#B8453D" },
  black: { name: "Black", occasion: "All Souls", when: "All Souls", meaning: "Mourning, prayer for the dead", swatch: "#54545B" },
};

/**
 * Source of the <head> script that sets data-season, and the status-bar colour, before first paint.
 * It inlines `seasonForDate` so there is one copy of the calendar rules. The colour is applied once
 * the tags exist, since Next may stream its metadata after this script runs; the original colour is
 * stashed first so `SeasonSync` can restore it when the visitor goes back to Ora's own palette.
 */
export const SEASON_INIT_SCRIPT = `(function(){try{var c=localStorage.getItem(${JSON.stringify(SEASON_STORAGE_KEY)});if(c==="auto")c=(${seasonForDate.toString()})(new Date());if(${JSON.stringify(SEASONS)}.indexOf(c)>-1){document.documentElement.setAttribute("data-season",c);try{var t=localStorage.getItem("theme"),d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches),b=${JSON.stringify(SEASON_BACKGROUNDS)}[c][d?"dark":"light"],f=function(){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.dataset.oraOriginal=m.dataset.oraOriginal||m.content;m.content=b})};f();document.addEventListener("DOMContentLoaded",f)}catch(e){}}}catch(e){}})()`;
