"use client";

import { useRef, type SubmitEvent } from "react";

import { SubmitButton } from "@/components/submit-button";
import { clearDeviceData } from "@/lib/device-data";

/**
 * Signing out also forgets what this device kept for the account: signed-in pages cached by
 * the service worker, the offline library copy, any unsynced Rosary sessions and the saved
 * prayer position. The form is held back until that is done, so the copy is gone before the
 * session is.
 */
export function SignOutForm({ action }: { action: () => Promise<void> }) {
  const cleared = useRef(false);

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    if (cleared.current) return;
    event.preventDefault();
    const form = event.currentTarget;
    void clearDeviceData().finally(() => {
      cleared.current = true;
      form.requestSubmit();
    });
  }

  return (
    <form action={action} onSubmit={onSubmit}>
      <SubmitButton variant="outline" size="lg" className="w-full" pendingLabel="Signing out…">
        Sign out
      </SubmitButton>
    </form>
  );
}
