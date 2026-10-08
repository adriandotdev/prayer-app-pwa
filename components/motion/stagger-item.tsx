"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE_ORA } from "@/lib/motion";
import { useIsDesktop } from "@/lib/use-is-desktop";

/** A list item that rises in after the one before it. Only the first eight are delayed. */
export function StaggerItem({ index = 0, className, children }: { index?: number; className?: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const step = isDesktop ? 0.024 : 0.03;

  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : isDesktop ? 6 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: EASE_ORA, delay: reduceMotion ? 0 : 0.08 + Math.min(index, 8) * step }}
    >
      {children}
    </motion.li>
  );
}
