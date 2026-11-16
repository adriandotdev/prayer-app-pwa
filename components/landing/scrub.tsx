"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";

const QUERY = "(prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * False on the server and for people who ask for less motion. MotionConfig only tames `animate`, not values
 * bound to scroll, so every scrubbed style is gated on this. The page's resting state is the server HTML.
 */
export function useFullMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

const OPENINGS = {
  // Walking up to a painting: it opens from the middle of its frame and never starts fully hidden.
  frame: ["inset(12% 9% 12% 9% round 0% 0% 0% 0%)", "inset(0% 0% 0% 0% round 0% 0% 0% 0%)"],
  // The same, through a chapel arch.
  arch: ["inset(16% 16% 0% 16% round 50% 50% 0% 0%)", "inset(0% 0% 0% 0% round 0% 0% 0% 0%)"],
};

/** A painting that opens as it is scrolled to. The words around it never move, so they can always be read. */
export function Unveil({
  shape = "frame",
  className,
  children,
}: {
  shape?: keyof typeof OPENINGS;
  className?: string;
  children: ReactNode;
}) {
  const full = useFullMotion();
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "start 35%"] });
  const clipPath = useTransform(scrollYProgress, [0, 1], OPENINGS[shape]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.16, 1]);

  return (
    <motion.div ref={frame} className={className} style={full ? { clipPath } : undefined}>
      <motion.div className="land-unveil" style={full ? { scale, willChange: "transform" } : undefined}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Moves with the scroll between two offsets, for things that sit at a different depth from the page. */
export function Depth({
  as = "div",
  x = [0, 0],
  y = [0, 0],
  offset = ["start end", "end start"],
  className,
  children,
}: {
  as?: "div" | "span";
  x?: [number | string, number | string];
  y?: [number | string, number | string];
  offset?: Offset;
  className?: string;
  children: ReactNode;
}) {
  const full = useFullMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const tx = useTransform(scrollYProgress, [0, 1], x);
  const ty = useTransform(scrollYProgress, [0, 1], y);
  const Tag = as === "span" ? motion.span : motion.div;

  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement & HTMLSpanElement>}
      className={className}
      style={full ? { x: tx, y: ty, willChange: "transform" } : undefined}
    >
      {children}
    </Tag>
  );
}
