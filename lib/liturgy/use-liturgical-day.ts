"use client";

import { useMemo, useSyncExternalStore } from "react";

import { liturgicalDay, type LiturgicalDay } from "./calendar";
import { parseIsoDate, toIsoDate } from "./dates";

// Re-read whenever the page returns to the foreground, so the day rolls over after midnight.
function subscribe(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

/**
 * Today's liturgical day in the visitor's local time zone, or `null` during server render and
 * hydration. Never render a real day on the server: the home page HTML is cached by the service
 * worker and would show yesterday's day.
 */
export function useLiturgicalDay(): LiturgicalDay | null {
  // A string keeps the snapshot stable between renders; the day object is derived from it.
  const iso = useSyncExternalStore(subscribe, () => toIsoDate(new Date()), () => null);
  return useMemo(() => (iso === null ? null : liturgicalDay(parseIsoDate(iso))), [iso]);
}
