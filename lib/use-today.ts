"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Day of week (0 = Sunday) on the client; `null` during server render. */
export function useToday(): number | null {
  return useSyncExternalStore(noop, () => new Date().getDay(), () => null);
}
