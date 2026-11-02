"use client";

import { useReaderPrefs } from "@/lib/reader/use-reader-prefs";
import { useWakeLock } from "@/lib/reader/use-wake-lock";

/** Holds the screen on while mounted, if the reader asked for it. For server-rendered reading pages. */
export function KeepAwake() {
  const { prefs } = useReaderPrefs();
  useWakeLock(prefs.keepAwake);
  return null;
}
