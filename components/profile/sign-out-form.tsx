"use client";

import { SubmitButton } from "@/components/submit-button";
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
      <SubmitButton variant="outline" className="w-full" pendingLabel="Signing out…">
        Sign out
      </SubmitButton>
    </form>
  );
}
