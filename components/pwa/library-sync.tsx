"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { isProtectedPath } from "@/lib/auth/paths";
import { LIBRARY_STALE_EVENT as STALE_EVENT } from "@/lib/library/stale";

const THROTTLE_MS = 5 * 60 * 1000;

let lastRun = 0;

function whenIdle(callback: () => void) {
  if ("requestIdleCallback" in window) window.requestIdleCallback(callback, { timeout: 5000 });
  else setTimeout(callback, 1500);
}

/**
 * Keeps the offline copy of the signed-in library fresh. It stays inert on public routes (the
 * Rosary visitor never calls the API), and loads the IndexedDB code only when it first runs.
 */
export function LibrarySync() {
  const pathname = usePathname();
  const active = isProtectedPath(pathname);

  useEffect(() => {
    if (!active) return;

    function run(force: boolean) {
      if (!navigator.onLine) return;
      const now = Date.now();
      if (!force && now - lastRun < THROTTLE_MS) return;
      lastRun = now;
      whenIdle(() => {
        void import("@/lib/library/sync").then((m) => m.syncLibrary()).catch(() => {});
      });
    }

    run(false);
    const onOnline = () => run(true);
    const onStale = () => run(true);
    const onVisible = () => {
      if (document.visibilityState === "visible") run(false);
    };
    window.addEventListener("online", onOnline);
    window.addEventListener(STALE_EVENT, onStale);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener(STALE_EVENT, onStale);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active]);

  return null;
}
