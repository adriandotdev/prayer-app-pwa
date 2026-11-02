"use client";

import { useEffect } from "react";

import { INTENTION_DRAFT_KEY } from "./intention-form";

/** Rendered on the list right after a save: the draft has done its job, and the URL drops its marker. */
export function DraftClear() {
  useEffect(() => {
    try {
      localStorage.removeItem(INTENTION_DRAFT_KEY);
    } catch {
      // Storage can be blocked; the draft is a convenience.
    }
    window.history.replaceState(window.history.state, "", "/intentions");
  }, []);

  return null;
}
