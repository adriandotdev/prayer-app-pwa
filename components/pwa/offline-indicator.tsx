"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

export function OfflineIndicator() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  if (online) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-primary px-4 py-1.5 pt-[calc(0.375rem+env(safe-area-inset-top))] text-xs text-primary-foreground"
    >
      <WifiOff className="size-3.5" aria-hidden />
      You&apos;re offline. The Rosary and saved prayers still work.
    </div>
  );
}
