"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

import { AppButton } from "@/components/app-button";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { mysterySetForDay } from "@/data/rosary/schedule";
import { DURATION, EASE_ORA } from "@/lib/motion";
import { useToday } from "@/lib/use-today";
import { MYSTERY_ART } from "./art";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDER = ["First", "Second", "Third", "Fourth", "Fifth"];
// Empty space inside each column, so the paintings rise and fall along the row.
const DROP = ["land-drop-a", "land-drop-c", "land-drop-b", "land-drop-d", "land-drop-a"];

// Picking a day is a state change the visitor asked for, so it answers fast; blur hides the swap of paintings.
const ROW = {
  enter: { transition: { staggerChildren: 0.04 } },
  exit: { opacity: 0, filter: "blur(4px)", transition: { duration: DURATION.quick, ease: EASE_ORA } },
};
const MOMENT = {
  hidden: { opacity: 0, x: 16, filter: "blur(4px)" },
  enter: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: DURATION.slow, ease: EASE_ORA } },
};

/** The page's live thing: today's mysteries with a painting for each, and any other day one tap away. */
export function MysteriesRow() {
  const today = useToday();
  const [picked, setPicked] = useState<number | null>(null);
  const day = picked ?? today ?? 0;
  const setId = mysterySetForDay(day);
  const set = MYSTERY_SETS[setId];
  const art = MYSTERY_ART[setId];
  const isToday = today !== null && day === today;

  const row = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  const onScroll = () => {
    const el = row.current;
    if (!el || !bar.current) return;
    const max = el.scrollWidth - el.clientWidth;
    const share = max > 0 ? el.clientWidth / el.scrollWidth : 1;
    const progress = max > 0 ? el.scrollLeft / max : 0;
    bar.current.style.transform = `translateX(${(progress * (1 - share) * 100) / share}%)`;
    bar.current.style.width = `${share * 100}%`;
  };

  const step = (direction: 1 | -1) => {
    const el = row.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollBy({ left: direction * 332, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <div className="land-gutter land-mysteries-head">
        <h2 className="land-h2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${isToday}-${day}-${setId}`}
              className="land-mysteries-name"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: DURATION.quick, ease: EASE_ORA }}
            >
              {isToday ? "Today" : `On ${DAYS[day]}`}, the {set.name}
            </motion.span>
          </AnimatePresence>
        </h2>
        <div className="land-days" role="group" aria-label="Choose a day of the week">
          {DAYS.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-pressed={i === day}
              aria-label={name}
              className="land-day"
              onClick={() => {
                setPicked(i);
                row.current?.scrollTo({ left: 0 });
              }}
            >
              {i === day && (
                <motion.span
                  layoutId="land-day-pill"
                  className="land-day-pill"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.12 }}
                />
              )}
              <span className="land-day-name">{name.slice(0, 3)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="land-gutter land-track-row">
        <span className="land-track">
          <span ref={bar} className="land-track-fill" />
        </span>
        <div className="land-steps">
          <AppButton variant="outline" size="icon" aria-label="Earlier mysteries" onClick={() => step(-1)}>
            <ArrowLeft />
          </AppButton>
          <AppButton variant="outline" size="icon" aria-label="Later mysteries" onClick={() => step(1)}>
            <ArrowRight />
          </AppButton>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ol
          ref={row}
          key={setId}
          onScroll={onScroll}
          className="land-row"
          tabIndex={0}
          aria-label={set.name}
          variants={ROW}
          initial="hidden"
          animate="enter"
          exit="exit"
        >
          {set.mysteries.map((mystery, i) => (
            <motion.li key={mystery.name} className="land-moment" variants={MOMENT}>
              <h3 className="land-moment-title">
                {ORDER[i]}: {mystery.name.replace(/^The /, "the ")}
              </h3>
              <p className="land-moment-text">{mystery.meditation}</p>
              <p className="land-moment-note">
                {mystery.scripture} · Fruit: {mystery.fruit.toLowerCase()}
              </p>
              <div className={`land-moment-art ${DROP[i]}`}>
                <Image src={art[i].src} alt={art[i].alt} fill sizes="(min-width: 48rem) 340px, 72vw" />
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </AnimatePresence>

      <div className="land-gutter land-mysteries-foot">
        <p className="land-body">
          Monday and Saturday, Joyful. Tuesday and Friday, Sorrowful. Wednesday and Sunday, Glorious. Thursday, Luminous.
          Ora leads you bead by bead, and you need no account to begin.
        </p>
        <AppButton href="/rosary" size="lg">
          {/* /rosary opens on today's set, so only today's day can promise a set by name. */}
          {isToday ? `Pray the ${set.name}` : "Pray the Rosary"}
        </AppButton>
      </div>
    </>
  );
}
