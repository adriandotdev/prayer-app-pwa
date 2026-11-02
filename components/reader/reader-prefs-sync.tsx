"use client";

import { useEffect } from "react";
import { applyPrefs } from "@/lib/reader/preferences";
import { useReaderPrefs } from "@/lib/reader/use-reader-prefs";

/** Keeps the size, leading and reading theme on <html> in step after hydration; the head script sets them first. */
export function ReaderPrefsSync() {
  const { prefs, hydrated } = useReaderPrefs();
  useEffect(() => {
    // Until hydrated, prefs are placeholders; applying them would undo what the head script set.
    if (hydrated) applyPrefs(prefs, document.documentElement);
  }, [prefs, hydrated]);
  return null;
}
