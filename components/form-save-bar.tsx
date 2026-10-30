"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { AppButton } from "@/components/app-button";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { useKeyboardInset } from "@/lib/use-keyboard-inset";

const noopSubscribe = () => () => {};

/**
 * Submit button for a form that is a focus zone. On a phone it rides above the keyboard; on desktop it
 * sits under the form. It is portaled to <body> because the page's entrance animation transforms its
 * ancestors, which would anchor a fixed bar to the page, not the screen.
 */
export function FormSaveBar({ formId, label, pending }: { formId: string; label: string; pending: boolean }) {
  const keyboardInset = useKeyboardInset();
  const isDesktop = useIsDesktop();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const button = (
    <AppButton
      type="submit"
      form={formId}
      size="lg"
      pending={pending}
      pendingLabel="Saving…"
      className="mx-auto w-full max-w-3xl md:w-auto md:min-w-48"
    >
      {label}
    </AppButton>
  );

  if (mounted && !isDesktop) {
    return createPortal(
      <div
        style={{ bottom: keyboardInset, paddingBottom: keyboardInset > 0 ? "0.75rem" : "max(0.75rem, env(safe-area-inset-bottom))" }}
        className="ora-fade fixed inset-x-0 z-30 bg-background/95 px-4 pt-3"
      >
        {button}
      </div>,
      document.body,
    );
  }
  return <div className={mounted ? "mt-3" : "mt-3 max-md:hidden"}>{button}</div>;
}
