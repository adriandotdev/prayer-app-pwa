"use client";

import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { EASE_ORA } from "@/lib/motion";
import { useOnline } from "@/lib/use-online";

export function OfflineIndicator() {
  const online = useOnline();
  return (
    <AnimatePresence initial={false}>
      {online ? null : (
        <motion.div
          role="status"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_ORA }}
          className="overflow-hidden bg-primary text-xs text-primary-foreground"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-1.5 pt-[calc(0.375rem+env(safe-area-inset-top))]">
            <WifiOff className="size-3.5" aria-hidden />
            You&apos;re offline. The Rosary and saved prayers still work.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
