"use client";

import { useEffect, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** Whether the browser can hold a screen wake lock. Assumed true on the server so markup matches. */
export function useWakeLockSupported() {
  return useSyncExternalStore(noopSubscribe, () => "wakeLock" in navigator, () => true);
}

/**
 * Keeps the screen on while `enabled`. The browser drops the lock whenever the tab is hidden, so it is
 * requested again when the tab comes back. Unsupported or refused (low battery, no gesture) is a silent no-op.
 */
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;
    let pending = false;

    const acquire = async () => {
      // One request at a time: a second sentinel would overwrite the first and never be released.
      if (pending) return;
      pending = true;
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) void lock.release().catch(() => {});
        else sentinel = lock;
      } catch {
        /* refused: nothing to do */
      } finally {
        pending = false;
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && (!sentinel || sentinel.released)) void acquire();
    };

    void acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void sentinel?.release().catch(() => {});
    };
  }, [enabled]);
}
