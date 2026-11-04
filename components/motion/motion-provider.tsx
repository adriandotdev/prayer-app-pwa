"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Safety net: any motion component, even one that forgets useReducedMotion, drops transforms for people who ask. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
