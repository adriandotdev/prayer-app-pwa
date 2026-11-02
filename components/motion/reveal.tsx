"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE_ORA } from "@/lib/motion";
import { useIsDesktop } from "@/lib/use-is-desktop";

/** A page section that rises in after the ones before it. Use `index` to order sections top to bottom. */
export function Reveal({ index = 0, className, children }: { index?: number; className?: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : isDesktop ? 6 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_ORA, delay: reduceMotion ? 0 : 0.1 + Math.min(index, 6) * 0.07 }}
    >
      {children}
    </motion.div>
  );
}
