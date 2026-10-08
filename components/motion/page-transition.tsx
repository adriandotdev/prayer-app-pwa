"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { EASE_ORA } from "@/lib/motion";
import { useIsDesktop } from "@/lib/use-is-desktop";

/** Every page eases in: a short fade and rise, calmer (less travel) on desktop. */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  // A root template only remounts when the first path segment changes, so /prayers -> /prayers/new
  // would not replay. Keying by pathname makes every page change ease in (search params still don't).
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: reduceMotion ? 0 : isDesktop ? 6 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.32, ease: EASE_ORA }}
    >
      {children}
    </motion.div>
  );
}
