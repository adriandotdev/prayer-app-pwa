"use client";

import { SubmitButton } from "@/components/submit-button";
import { clearDeviceData } from "@/lib/device-data";

/**
 * Signing out also forgets what this device kept for the account: signed-in pages cached by
 * the service worker, any unsynced Rosary sessions and the saved prayer position.
 */
export function SignOutForm({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action} onSubmit={clearDeviceData}>
      <SubmitButton variant="outline" size="lg" className="w-full" pendingLabel="Signing out…">
        Sign out
      </SubmitButton>
    </form>
  );
}
