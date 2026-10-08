"use client";

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { AlertCircle, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

import { AppButton } from "@/components/app-button";
import { ToastFlash } from "@/components/toast/toast-flash";
import { DURATION, EASE_ORA } from "@/lib/motion";
import { toast, useToasts, type ToastItem } from "@/lib/toast";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";

const LIFETIME = { success: 4000, error: 6000 } as const;
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

function ToastCard({ item, isDesktop }: { item: ToastItem; isDesktop: boolean }) {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const offset = reduceMotion ? 0 : isDesktop ? 6 : -16;

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => toast.dismiss(item.id), LIFETIME[item.kind]);
    return () => clearTimeout(timer);
  }, [paused, item.id, item.kind]);

  function onDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY) toast.dismiss(item.id);
  }

  const Icon = item.kind === "error" ? AlertCircle : Check;

  return (
    <motion.li
      layout={!reduceMotion}
      role={item.kind === "error" ? "alert" : undefined}
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0, transition: { duration: DURATION.base + 0.06, ease: EASE_ORA } }}
      exit={{ opacity: 0, y: offset / 2, transition: { duration: DURATION.quick + 0.03, ease: EASE_ORA } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={onDragEnd}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "pointer-events-auto flex touch-pan-y items-center gap-3 rounded-2xl border border-border border-l-[3px] bg-card py-1 pr-1 pl-4 text-card-foreground shadow-lg",
        item.kind === "error" ? "border-l-destructive" : "border-l-gold",
      )}
    >
      <Icon aria-hidden className={cn("size-5 shrink-0", item.kind === "error" ? "text-destructive" : "text-gold")} />
      <p className="min-w-0 flex-1 py-2 text-base">{item.message}</p>
      <AppButton variant="ghost" size="icon" aria-label="Dismiss" onClick={() => toast.dismiss(item.id)}>
        <X aria-hidden />
      </AppButton>
    </motion.li>
  );
}

/** Custom toast region: slides down from the top on phones, fades up bottom-right on desktop. */
export function Toaster() {
  const toasts = useToasts();
  const isDesktop = useIsDesktop();

  return (
    <>
      <ToastFlash />
      <ul
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-0 z-70 flex flex-col gap-2 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:inset-x-auto md:top-auto md:right-6 md:bottom-6 md:w-96 md:px-0 md:pt-0"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} isDesktop={isDesktop} />
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
