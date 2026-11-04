"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";

import { AppButton } from "@/components/app-button";
import { ROSARY_PRAYERS } from "@/data/rosary/prayers";
import { DURATION, EASE_ORA } from "@/lib/motion";
import { useFullMotion } from "./scrub";

const BEADS = 10;
const HAIL_MARY = ROSARY_PRAYERS["hail-mary"].text;

// Ten beads hanging on a thread, on a grid wide enough to stay legible at 360px.
const POINTS = Array.from({ length: BEADS }, (_, i) => {
  const t = (i - (BEADS - 1) / 2) / ((BEADS - 1) / 2);
  return { x: 24 + i * 39.1, y: 20 + 46 * (1 - t * t) };
});
const THREAD = POINTS.reduce((d, p, i) => {
  if (i === 0) return `M${p.x} ${p.y}`;
  const prev = POINTS[i - 1];
  const mid = (prev.x + p.x) / 2;
  return `${d} C${mid} ${prev.y} ${mid} ${p.y} ${p.x} ${p.y}`;
}, "");

// Where the scrolled preview is, from 0 to 1: the strand gathers, then a glint runs back along it to the first bead.
const GATHERED = 0.6;
const GLINT_START = 0.55;
const GLINT_END = 0.92;

/** One bead. Scroll only gathers it onto the thread: gold is kept for beads that have really been prayed. */
function StrandBead({
  index,
  count,
  full,
  preview,
  invite,
}: {
  index: number;
  count: number;
  full: boolean;
  preview: MotionValue<number>;
  invite: MotionValue<number>;
}) {
  const point = POINTS[index];
  const prayed = index < count;
  const start = (index / BEADS) * (GATHERED - 0.12);
  const y = useTransform(preview, [start, start + 0.12], [-20, 0]);
  const opacity = useTransform(preview, [start, start + 0.12], [0, 1]);

  return (
    <motion.g style={full ? { y, opacity } : undefined}>
      {index === count && (
        <motion.g style={full ? { opacity: invite } : undefined}>
          <circle cx={point.x} cy={point.y} r={15} className="land-bead-next ora-halo" />
        </motion.g>
      )}
      {/* A ring opening from the bead just prayed, so the tap is answered at the bead and not only at the button. */}
      {full && index === count - 1 && (
        <motion.circle
          key={count}
          cx={point.x}
          cy={point.y}
          className="land-bead-ring"
          initial={{ r: 8, opacity: 0.9 }}
          animate={{ r: 30, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_ORA }}
        />
      )}
      <motion.circle
        cx={point.x}
        cy={point.y}
        r={8}
        className={prayed ? "land-bead land-bead-prayed" : "land-bead"}
        initial={false}
        animate={{ scale: prayed ? 1 : 0.82 }}
        transition={{ type: "spring", duration: 0.45, bounce: 0.35 }}
      />
    </motion.g>
  );
}

/** The app's real gesture, on the page: one tap, one bead, the room growing warmer as the decade is prayed. */
export function Decade() {
  const full = useFullMotion();
  const [count, setCount] = useState(0);
  const done = count === BEADS;

  // Swapping panels removes the pressed button, so hand keyboard focus to the first action of the new panel.
  const moveFocus = useRef(false);
  const takeFocus = (el: HTMLElement | null) => {
    if (!el || !moveFocus.current) return;
    moveFocus.current = false;
    el.focus();
  };

  const warmth = useSpring(0, { stiffness: 60, damping: 20 });
  useEffect(() => warmth.set(count / BEADS), [count, warmth]);
  const glowOpacity = useTransform(warmth, [0, 1], [0.12, 1]);
  const glowScale = useTransform(warmth, [0, 1], [0.55, 1.25]);

  // Scrolling previews the decade and points at the first tap; it never touches the count. The first tap ends it,
  // so the strand holds still from then on, even after "Start again".
  const [begun, setBegun] = useState(false);
  const strand = useRef<SVGSVGElement>(null);
  const { scrollYProgress } = useScroll({
    target: strand as unknown as RefObject<HTMLElement | null>,
    offset: ["start 92%", "start 33%"],
  });
  const scrolled = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!begun) scrolled.set(value);
  });
  const preview = useSpring(scrolled, { stiffness: 120, damping: 24 });
  const threadLength = useTransform(preview, [0, GATHERED], [0, 1]);
  const glintLength = useMotionValue(0.1);
  const glintOffset = useTransform(preview, [GLINT_START, GLINT_END], [0.9, 0]);
  const glintOpacity = useTransform(preview, [GLINT_START, GLINT_START + 0.04, GLINT_END - 0.04, GLINT_END], [0, 1, 1, 0]);
  const invite = useTransform(preview, [GLINT_END - 0.06, GLINT_END + 0.04], [0, 1]);

  // The button answers once, the first time all of it can be seen.
  const actions = useRef<HTMLDivElement>(null);
  const actionsSeen = useInView(actions, { once: true, amount: "all", margin: "0px 0px -10% 0px" });

  return (
    <section className="land-decade" aria-labelledby="decade-title">
      <motion.div className="land-decade-glow" style={full ? { opacity: glowOpacity, scale: glowScale } : { opacity: glowOpacity }} aria-hidden />

      <div className="land-decade-head">
        <h2 id="decade-title" className="land-h2">
          Pray one decade here
        </h2>
        <p className="land-statement">One Hail Mary, one bead. This is how Ora leads you.</p>
      </div>

      <svg ref={strand} viewBox="0 0 400 90" className="land-strand" aria-hidden>
        <motion.path d={THREAD} className="land-thread" style={full ? { pathLength: threadLength } : undefined} />
        <motion.path
          d={THREAD}
          className="land-thread-lit"
          initial={false}
          animate={{ pathLength: count <= 1 ? 0 : (count - 1) / (BEADS - 1) }}
          transition={{ duration: DURATION.slow, ease: EASE_ORA }}
        />
        {full && !begun && (
          <motion.path
            d={THREAD}
            className="land-thread-glint"
            style={{ pathLength: glintLength, pathOffset: glintOffset, opacity: glintOpacity }}
          />
        )}
        {POINTS.map((point, i) => (
          <StrandBead key={point.x} index={i} count={count} full={full} preview={preview} invite={invite} />
        ))}
      </svg>

      <p className="land-decade-count" aria-live="polite">
        {done ? "Ten Hail Marys" : count === 0 ? "Ten beads to pray" : `Hail Mary ${count} of ${BEADS}`}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            className="land-decade-body"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_ORA }}
          >
            <p className="land-decade-prayer">
              That is the heart of a decade. Ora leads you through all five, with today’s mysteries to pray on.
            </p>
            <div className="land-decade-actions">
              <AppButton href="/rosary" size="lg" ref={takeFocus}>
                Pray the whole Rosary
              </AppButton>
              <AppButton
                variant="outline"
                size="lg"
                onClick={() => {
                  moveFocus.current = true;
                  setCount(0);
                }}
              >
                Start again
              </AppButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="praying"
            className="land-decade-body"
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.quick }}
          >
            {/* The words are the same each time; they brighten again so each bead reads as a new prayer. */}
            <motion.div
              key={count}
              className="land-decade-prayer"
              initial={count === 0 ? false : { opacity: 0.45 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE_ORA }}
            >
              {HAIL_MARY.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </motion.div>
            <div
              ref={actions}
              className={full && actionsSeen && !begun ? "land-decade-actions land-decade-invite" : "land-decade-actions"}
            >
              <AppButton
                size="lg"
                ref={takeFocus}
                onClick={() => {
                  moveFocus.current = count === BEADS - 1;
                  setBegun(true);
                  scrolled.set(1);
                  setCount(count + 1);
                }}
              >
                {count === BEADS - 1 ? "Amen" : count === 0 ? "Pray the first bead" : "Next bead"}
              </AppButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
