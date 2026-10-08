"use client";

import { useSyncExternalStore } from "react";

export type PrayerMode = "learn" | "pray";

export type SavedProgress = {
  sequenceId: string;
  index: number;
  mode: PrayerMode;
  completed: boolean;
  updatedAt: number;
};

const KEY = "ora:progress:v1";
const listeners = new Set<() => void>();

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
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): SavedProgress | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as SavedProgress;
    return typeof value.sequenceId === "string" && typeof value.index === "number" ? value : null;
  } catch {
    return null;
  }
}

export function saveProgress(progress: Omit<SavedProgress, "updatedAt">) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...progress, updatedAt: Date.now() }));
  } catch {
    /* storage unavailable (private mode / quota): progress is simply not kept */
  }
  listeners.forEach((cb) => cb());
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((cb) => cb());
}

/** `undefined` until hydrated on the client, then the saved progress or null. */
export function useSavedProgress(): SavedProgress | null | undefined {
  const raw = useSyncExternalStore(subscribe, readRaw, () => undefined);
  return raw === undefined ? undefined : parse(raw);
}
