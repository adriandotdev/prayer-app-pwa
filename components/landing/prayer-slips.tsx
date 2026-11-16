"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { ROSARY_PRAYERS } from "@/data/rosary/prayers";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { useFullMotion } from "./scrub";

// Exact texts from data/rosary/prayers.ts; never retype a prayer here.
const SLIPS = ["sign-of-the-cross", "glory-be", "hail-mary", "fatima", "our-father", "hail-holy-queen"];

/** Each slip is laid down on the altarpiece after the one before it, tilted until it comes to rest. */
function Slip({ id, index, progress, laid }: { id: string; index: number; progress: MotionValue<number>; laid: boolean }) {
  const prayer = ROSARY_PRAYERS[id];
  const start = index * 0.09;
  const y = useTransform(progress, [start, start + 0.55], [150, 0]);
  const rotate = useTransform(progress, [start, start + 0.55], [index % 2 ? 4 : -3.5, 0]);

  return (
    <motion.li className="land-slip" style={laid ? { y, rotate, willChange: "transform" } : undefined}>
      <h3 className="land-slip-title">{prayer.name}</h3>
      {prayer.text.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </motion.li>
  );
}

export function PrayerSlips() {
  const full = useFullMotion();
  const isDesktop = useIsDesktop();
  const list = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start end", "start 30%"] });
  // A phone's row scrolls sideways, so a single slip moved down would make the row scroll vertically too.
  const rowY = useTransform(scrollYProgress, [0, 1], [90, 0]);

  return (
    <motion.ul ref={list} className="land-slips" aria-label="Prayers in Ora" style={full && !isDesktop ? { y: rowY, willChange: "transform" } : undefined}>
      {SLIPS.map((id, index) => (
        <Slip key={id} id={id} index={index} progress={scrollYProgress} laid={full && isDesktop} />
      ))}
    </motion.ul>
  );
}
