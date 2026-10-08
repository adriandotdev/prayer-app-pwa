"use client";

import { AppButton } from "@/components/app-button";
import { clearPendingRosaries } from "@/lib/rosary/pending";

/**
 * Signing out also forgets what this device kept for the account: signed-in pages cached by
 * the service worker and any unsynced Rosary sessions.
 */
export function SignOutForm({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={() => {
        clearPendingRosaries();
        navigator.serviceWorker?.controller?.postMessage({ type: "clear-private-pages" });
      }}
    >
      <AppButton type="submit" variant="outline" className="w-full">
        Sign out
      </AppButton>
    </form>
  );
}
