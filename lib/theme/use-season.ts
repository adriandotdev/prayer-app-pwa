"use client";

import { useSyncExternalStore } from "react";

import { SEASON_STORAGE_KEY, isSeasonChoice, type SeasonChoice } from "@/lib/theme/season";
import { seasonForDate, type Season } from "@/lib/theme/liturgical-season";

const listeners = new Set<() => void>();
// Used when localStorage is blocked, so the choice still holds for this visit.
let memoryChoice: SeasonChoice = "default";

function readChoice(): SeasonChoice {
  try {
    const stored = localStorage.getItem(SEASON_STORAGE_KEY);
    return isSeasonChoice(stored) ? stored : "default";
  } catch {
    return memoryChoice;
  }
}

function saveSeasonChoice(choice: SeasonChoice) {
  memoryChoice = choice;
  try {
    localStorage.setItem(SEASON_STORAGE_KEY, choice);
  } catch {
    // Private mode or blocked storage: the in-memory value above still applies.
  }
  listeners.forEach((l) => l());
}

function subscribeChoice(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// Re-evaluated whenever the page comes back to the foreground, so `auto` rolls over at midnight.
function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

/** Today's liturgical season in the visitor's local time zone. */
export function useTodaySeason(): Season {
  return useSyncExternalStore(subscribeVisibility, () => seasonForDate(new Date()), () => "green");
}

/**
 * The saved choice and the season it resolves to (`null` for Ora's own palette). The server and the
 * first client render report "default"; the real value arrives right after hydration.
 */
export function useSeason() {
  const choice = useSyncExternalStore(subscribeChoice, readChoice, () => "default" as SeasonChoice);
  const today = useTodaySeason();
  const resolved: Season | null = choice === "default" ? null : choice === "auto" ? today : choice;
  return { choice, today, resolved, setChoice: saveSeasonChoice };
}
