"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Registers /sw.js in production only; a cached dev server is a debugging trap. */
export function ServiceWorkerRegister() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let cleanup = () => {};
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((reg) => {
        // A standalone app can stay open for days; look for a new worker whenever it comes back to the foreground.
        const check = () => {
          if (document.visibilityState === "visible") reg.update().catch(() => {});
        };
        document.addEventListener("visibilitychange", check);
        cleanup = () => document.removeEventListener("visibilitychange", check);
      })
      .catch(() => {});
    return () => cleanup();
  }, []);

  // Tell the worker which page is on screen so client-side navigations get cached too.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !navigator.onLine) return;
    navigator.serviceWorker?.ready
      .then((reg) => reg.active?.postMessage({ type: "cache-page", url: window.location.pathname + window.location.search }))
      .catch(() => {});
  }, [pathname]);

  return null;
}
