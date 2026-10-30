"use client";

import { useEffect } from "react";

import { PRAYER_DRAFT_KEY } from "./prayer-form";

/** Rendered on a prayer right after it is created: the draft has done its job, and the URL drops its marker. */
export function PrayerDraftClear({ href }: { href: string }) {
  useEffect(() => {
    try {
      localStorage.removeItem(PRAYER_DRAFT_KEY);
    } catch {
      // Storage can be blocked; the draft is a convenience.
    }
    window.history.replaceState(window.history.state, "", href);
  }, [href]);

  return null;
}
