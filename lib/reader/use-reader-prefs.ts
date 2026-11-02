"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  DEFAULT_PREFS,
  READER_STORAGE_KEY,
  parsePrefs,
  serializePrefs,
  type ReaderPrefs,
} from "@/lib/reader/preferences";

const listeners = new Set<() => void>();
// Holds the latest value only while writes to storage are failing (private mode / quota), so changes
// still apply for this visit and win over an older stored value.
let memory: string | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// Raw string is the snapshot so it stays referentially stable between reads.
function readRaw(): string | null {
  try {
    return memory ?? window.localStorage.getItem(READER_STORAGE_KEY);
  } catch {
    return memory;
  }
}

export function getReaderPrefs(): ReaderPrefs {
  return parsePrefs(readRaw());
}

export function setReaderPrefs(patch: Partial<ReaderPrefs>) {
  // Round-trip through parsePrefs so every write is clamped and valid.
  const next = serializePrefs(parsePrefs(JSON.stringify({ ...parsePrefs(readRaw()), ...patch })));
  try {
    window.localStorage.setItem(READER_STORAGE_KEY, next);
    memory = null;
  } catch {
    memory = next; // storage unavailable: keep the change for this visit
  }
  listeners.forEach((cb) => cb());
}

/**
 * Defaults until hydrated on the client, then the saved preferences. `hydrated` is false for the
 * server and first-hydration render, when `prefs` is only a placeholder and must not be applied.
 */
export function useReaderPrefs() {
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, readRaw, () => undefined);
  const prefs = useMemo(() => (raw === undefined ? DEFAULT_PREFS : parsePrefs(raw)), [raw]);
  const update = useCallback((patch: Partial<ReaderPrefs>) => setReaderPrefs(patch), []);
  return { prefs, hydrated: raw !== undefined, update };
}
