"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { SAINTS, SaintWindow } from "./saint-windows";
import { useFullMotion } from "./scrub";

/** The veil is the colour of the wall, so it dims the glass without drawing a box around the lancet. */
function Veil({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const start = index / SAINTS.length;
  const opacity = useTransform(progress, [start * 0.8, start * 0.8 + 0.35], [0.82, 0]);
  return <motion.span className="land-window-veil" style={{ opacity }} aria-hidden />;
}

/** The sun coming round the chapel: the Litany's windows catch the light one after another as you scroll. */
export function SaintWall() {
  const full = useFullMotion();
  const wall = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({ target: wall, offset: ["start 90%", "start 20%"] });

  return (
    <ul ref={wall} className="land-wall" tabIndex={0} aria-label="Saints of the litany">
      {SAINTS.map((saint, index) => (
        <li key={saint.id} className="land-saint">
          <div className="land-window-frame">
            <SaintWindow id={saint.id} label={`${saint.english}, ${saint.about}. Stained glass illustration.`} />
            {full && <Veil index={index} progress={scrollYProgress} />}
          </div>
          <p className="land-saint-latin">{saint.latin},</p>
          <p className="land-saint-response">ora pro nobis</p>
        </li>
      ))}
    </ul>
  );
}
