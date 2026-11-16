"use client";

import { AnimatePresence, easeInOut, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useFullMotion } from "./scrub";

const WIDTH = 300;
const HEIGHT = 480;
const WHOLE = `0 0 ${WIDTH} ${HEIGHT}`;
const SMALL = 4.7;
const LARGE = 6.8;
const MEDAL = { x: 150, y: 288 };
const CRUCIFIX = { x: 150, y: 428 };

type Point = { x: number; y: number };
type Bead = Point & { id: string; r: number };

const round = (n: number) => Math.round(n * 100) / 100;

/** The loop as it hangs from the medal: a teardrop, with the longer run of chain either side of each Our Father. */
function loopBeads(): Bead[] {
  const samples: Point[] = [];
  for (let i = 0; i <= 1200; i++) {
    const t = (i / 1200) * 2 * Math.PI;
    samples.push({
      x: MEDAL.x + 146 * Math.sin(t) * Math.pow(Math.sin(t / 2), 0.8),
      y: MEDAL.y - 129 * (1 - Math.cos(t)),
    });
  }
  const lengths = [0];
  samples.slice(1).forEach((p, i) => lengths.push(lengths[i] + Math.hypot(p.x - samples[i].x, p.y - samples[i].y)));

  const slots: { id: string; gap: number }[] = [];
  for (let d = 0; d < 5; d++) {
    // The first mystery bead hangs on the tail below the medal, so the loop starts with that decade's first small bead.
    for (let b = d === 0 ? 1 : 0; b <= 10; b++) slots.push({ id: `d${d}-${b}`, gap: b === 0 ? 2.1 : b === 1 ? 1.9 : 1 });
  }
  const total = slots.reduce((sum, slot) => sum + slot.gap, 0) + 2.1;

  let walked = 0;
  let cursor = 0;
  return slots.map(({ id, gap }) => {
    walked += gap;
    const target = (walked / total) * lengths[lengths.length - 1];
    while (lengths[cursor] < target) cursor++;
    const p = samples[cursor];
    return { id, x: round(p.x), y: round(p.y), r: id.endsWith("-0") ? LARGE : SMALL };
  });
}

const LOOP = loopBeads();
// From the medal down: the first mystery's large bead, the three Hail Marys, then the large bead by the crucifix.
const TAIL: Bead[] = [
  { id: "d0-0", x: MEDAL.x, y: 314, r: LARGE },
  { id: "tail-3", x: MEDAL.x, y: 336, r: SMALL },
  { id: "tail-2", x: MEDAL.x, y: 347, r: SMALL },
  { id: "tail-1", x: MEDAL.x, y: 358, r: SMALL },
  { id: "tail-0", x: MEDAL.x, y: 380, r: LARGE },
];
const BEADS = [...TAIL, ...LOOP];
const at = (id: string) => BEADS.find((bead) => bead.id === id)!;
const midpoint = (a: Point, b: Point) => ({ x: round((a.x + b.x) / 2), y: round((a.y + b.y) / 2) });
const decade = (d: number) => Array.from({ length: 11 }, (_, b) => `d${d}-${b}`);

/** The order the beads are prayed in, so everything before the current part can stay lit. */
const WALK = ["crucifix", "tail-0", "tail-1", "tail-2", "tail-3", ...[0, 1, 2, 3, 4].flatMap(decade), "medal"];

// Real links rather than a line: one flat oval, then one seen edge-on, along every run between two beads.
function chainPaths() {
  const stops: (Point & { r: number })[] = [
    { ...CRUCIFIX, y: CRUCIFIX.y - 27, r: 0 },
    ...[...TAIL].reverse(),
    { ...MEDAL, r: 10 },
    ...LOOP,
    { ...MEDAL, r: 10 },
  ];
  let flat = "";
  let edge = "";
  stops.slice(1).forEach((to, i) => {
    const from = stops[i];
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const span = distance - from.r - to.r;
    if (span <= 0.5) return;
    const ux = (to.x - from.x) / distance;
    const uy = (to.y - from.y) / distance;
    const count = Math.max(1, Math.round(span / 2.6));
    const size = span / count;
    const angle = round((Math.atan2(uy, ux) * 180) / Math.PI);
    for (let n = 0; n < count; n++) {
      const start = from.r + n * size;
      const ax = round(from.x + ux * start);
      const ay = round(from.y + uy * start);
      const bx = round(from.x + ux * (start + size));
      const by = round(from.y + uy * (start + size));
      if (n % 2 === 0) {
        const rx = round(size / 2);
        flat += `M${ax} ${ay}A${rx} 0.85 ${angle} 1 0 ${bx} ${by}A${rx} 0.85 ${angle} 1 0 ${ax} ${ay}`;
      } else {
        edge += `M${ax} ${ay}L${bx} ${by}`;
      }
    }
  });
  return { flat, edge };
}

const CHAIN = chainPaths();

type Part = {
  title: string;
  prayers: string;
  detail: string;
  beads: string[];
  reach: string;
  camera: { x: number; y: number; width: number };
};

const FIRST_DECADE_MIDDLE = at("d0-5");
const AFTER_TENTH = midpoint(at("d0-10"), at("d1-0"));

const PARTS: Part[] = [
  {
    title: "The crucifix",
    prayers: "Sign of the Cross, then the Apostles’ Creed",
    detail: "Hold the cross, bless yourself, and profess the faith the Rosary rests on.",
    beads: ["crucifix"],
    reach: "crucifix",
    camera: { ...CRUCIFIX, width: 124 },
  },
  {
    title: "The first large bead",
    prayers: "Our Father",
    detail: "The prayer Jesus taught his disciples.",
    beads: ["tail-0"],
    reach: "tail-0",
    camera: { x: 150, y: 386, width: 110 },
  },
  {
    title: "The three small beads",
    prayers: "Three Hail Marys",
    detail: "One each for faith, hope and charity.",
    beads: ["tail-1", "tail-2", "tail-3"],
    reach: "tail-3",
    camera: { x: 150, y: 347, width: 82 },
  },
  {
    title: "The chain above them",
    prayers: "Glory Be",
    detail: "Praise of the Trinity closes the opening prayers.",
    beads: ["chain-opening"],
    reach: "tail-3",
    camera: { x: 150, y: 325, width: 82 },
  },
  {
    title: "The next large bead",
    prayers: "Name the mystery, then Our Father",
    detail: "Each decade begins with a moment from the lives of Jesus and Mary.",
    beads: ["d0-0"],
    reach: "d0-0",
    camera: { x: at("d0-0").x, y: at("d0-0").y, width: 110 },
  },
  {
    title: "The ten small beads",
    prayers: "Ten Hail Marys",
    detail: "The words hold steady while you rest your mind on the mystery.",
    beads: decade(0).slice(1),
    reach: "d0-10",
    camera: { x: FIRST_DECADE_MIDDLE.x - 8, y: FIRST_DECADE_MIDDLE.y, width: 170 },
  },
  {
    title: "The chain after the tenth",
    prayers: "Glory Be, then the Fatima Prayer",
    detail: "Every decade closes the same way.",
    beads: ["chain-decade"],
    reach: "d0-10",
    camera: { ...AFTER_TENTH, width: 100 },
  },
  {
    title: "Around the loop",
    prayers: "Four more decades",
    detail: "A mystery, an Our Father, ten Hail Marys, a Glory Be and the Fatima Prayer, four more times.",
    beads: [1, 2, 3, 4].flatMap(decade),
    reach: "d4-10",
    camera: { x: 150, y: 240, width: 300 },
  },
  {
    title: "The centre medal",
    prayers: "Hail, Holy Queen, then the Closing Prayer",
    detail: "Back at the medal, the loop is complete.",
    beads: ["medal"],
    reach: "medal",
    camera: { ...MEDAL, width: 100 },
  },
  {
    title: "Back to the crucifix",
    prayers: "Sign of the Cross",
    detail: "You finish where you started, with the cross in your hand.",
    beads: ["crucifix"],
    reach: "medal",
    camera: { x: 150, y: 240, width: 300 },
  },
];

// Always in the page, so each glow can fade out as gently as it fades in. The chain ones mark prayers said between beads.
const HALOS = [
  ...BEADS.map((bead) => ({ id: bead.id, x: bead.x, y: bead.y, r: bead.r * 2.6, strength: 1 })),
  { id: "crucifix", ...CRUCIFIX, r: 38, strength: 0.5 },
  { id: "medal", ...MEDAL, r: 24, strength: 1 },
  { id: "chain-opening", ...midpoint(at("tail-3"), at("d0-0")), r: 11, strength: 1 },
  { id: "chain-decade", ...AFTER_TENTH, r: 11, strength: 1 },
];

const COUNT = PARTS.length;
/** The layer is drawn as large as the closest camera zoom (narrowest view of WIDTH), so it is only ever scaled down. */
const LAYER_SCALE = WIDTH / Math.min(...PARTS.map((part) => part.camera.width));
const LAYER_BOX = { left: `${((1 - LAYER_SCALE) / 2) * 100}%`, top: `${((1 - LAYER_SCALE) / 2) * 100}%`, width: `${LAYER_SCALE * 100}%`, height: `${LAYER_SCALE * 100}%` };
// Each part rests briefly, and the camera spends the rest of its stretch of scroll easing to the next.
const STOPS = PARTS.flatMap((_, i) => [(i + 0.36) / COUNT, (i + 0.64) / COUNT]);
const track = (read: (camera: Part["camera"]) => number) => PARTS.flatMap(({ camera }) => [read(camera), read(camera)]);

const CORPUS =
  "M-12.1 -10.9C-8.4 -10.4 -4.6 -10.5 -1.7 -10.9C-0.6 -11.2 0.8 -11.2 1.7 -10.9C4.6 -10.5 8.4 -10.4 12.1 -10.9C12.5 -10.8 12.5 -10.3 12.1 -10.1C9 -9.4 5.2 -8.8 2.5 -8C2.6 -6 2.1 -3.8 1.9 -1.6C2.3 -0.7 2.2 0.2 1.9 0.9C2.2 3.5 1.9 6 1.3 8.2C1.2 10.6 1 13 0.8 15.4L0.3 18C0.1 18.5 -0.4 18.5 -0.6 18L-0.7 15.4C-1 13 -1.3 10.6 -1.4 8.2C-1.9 6 -2.2 3.5 -1.9 0.9C-2.2 0.2 -2.3 -0.7 -1.9 -1.6C-2.1 -3.8 -2.6 -6 -2.5 -8C-5.2 -8.8 -9 -9.4 -12.1 -10.1C-12.5 -10.3 -12.5 -10.8 -12.1 -10.9Z";

function Crucifix() {
  return (
    <g transform={`translate(${CRUCIFIX.x} ${CRUCIFIX.y})`}>
      <circle cy={-27} r={1.5} fill="none" stroke="url(#walk-cross)" strokeWidth={0.8} />
      <g fill="url(#walk-cross)">
        {/* Budded ends: a cross made by a jeweller, not a plus sign. */}
        <path d="M-1.5 -23.6H1.5V-11.3H12.8V-8.7H1.5V24.6H-1.5V-8.7H-12.8V-11.3H-1.5Z" />
        <circle cy={-25.2} r={1.75} />
        <circle cx={-1.5} cy={-23.8} r={1.15} />
        <circle cx={1.5} cy={-23.8} r={1.15} />
        <circle cy={26.2} r={1.75} />
        <circle cx={-1.5} cy={24.8} r={1.15} />
        <circle cx={1.5} cy={24.8} r={1.15} />
        <circle cx={-14.4} cy={-10} r={1.75} />
        <circle cx={-13} cy={-11.5} r={1.15} />
        <circle cx={-13} cy={-8.5} r={1.15} />
        <circle cx={14.4} cy={-10} r={1.75} />
        <circle cx={13} cy={-11.5} r={1.15} />
        <circle cx={13} cy={-8.5} r={1.15} />
      </g>
      {/* A bevel rather than an outline: light down one edge of the metal, shade down the other. */}
      <path d="M-1.05 -23.4V24.4M-12.6 -10.9H12.6" stroke="#fff3cf" strokeOpacity={0.55} strokeWidth={0.3} fill="none" />
      <path d="M1.2 -23.4V24.4M-12.6 -9H12.6" stroke="#5e4518" strokeOpacity={0.55} strokeWidth={0.3} fill="none" />
      {/* The corpus: arms drawn down by the weight of the body, head bowed, its shadow falling on the cross. */}
      <path d={CORPUS} fill="#2c2009" fillOpacity={0.5} transform="translate(0.4 0.45)" />
      <path d={CORPUS} fill="url(#walk-corpus)" />
      <path d="M-1.95 -0.6C-0.8 0 0.9 0 1.95 -0.6L2 1.9C0.9 2.7 -0.2 3.6 -0.7 4.6C-1.1 3.7 -1.6 2.8 -2 2Z" fill="#fff8e6" />
      <path d="M-0.05 4.8C-0.1 8 -0.1 12 -0.15 17.6M-1.3 -6.6C-0.5 -6.2 0.5 -6.2 1.3 -6.6M-1.2 -5.2C-0.5 -4.9 0.5 -4.9 1.2 -5.2" fill="none" stroke="#6d5a33" strokeOpacity={0.6} strokeWidth={0.16} />
      <g transform="rotate(14 0.45 -12.9)">
        <ellipse cx={0.45} cy={-12.9} rx={1.1} ry={1.45} fill="url(#walk-corpus)" />
        <path d="M-0.65 -12.6C-0.9 -14.2 0.2 -14.7 1 -14.4C1.8 -14.1 1.9 -13 1.6 -12.2C1.6 -11.6 1.2 -11.2 0.7 -11.2C1.1 -12.2 0.9 -13.3 0.3 -13.6C-0.1 -13.4 -0.4 -13.1 -0.65 -12.6Z" fill="#6d5a33" />
      </g>
    </g>
  );
}

function Medal() {
  return (
    <g transform={`translate(${MEDAL.x} ${MEDAL.y})`}>
      <ellipse rx={7.6} ry={10} fill="url(#walk-metal)" stroke="#6f5522" strokeWidth={0.35} />
      <ellipse rx={6.3} ry={8.7} fill="none" stroke="#6f5522" strokeOpacity={0.75} strokeWidth={0.35} />
      {/* The Marian monogram: an M beneath a cross. */}
      <path
        d="M-3.3 5.2V-0.8L0 3 3.3 -0.8V5.2M0 -1.2V-6.4M-1.8 -4.7H1.8"
        fill="none"
        stroke="#4d3c18"
        strokeWidth={0.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </g>
  );
}

/** The real Rosary, part by part: it holds the screen while scrolling walks the prayers from the crucifix around the loop. */
export function RosaryWalk() {
  const full = useFullMotion();
  const [index, setIndex] = useState(0);
  const part = PARTS[index];

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setIndex(Math.min(COUNT - 1, Math.floor(value * COUNT)));
  });

  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24 });
  const cameraX = useTransform(progress, STOPS, track((c) => c.x), { ease: easeInOut });
  const cameraY = useTransform(progress, STOPS, track((c) => c.y), { ease: easeInOut });
  // Zoom is eased as a ratio, so pulling back from the medal feels the same speed all the way out.
  const cameraZoom = useTransform(progress, STOPS, track((c) => Math.log(c.width)), { ease: easeInOut });

  // The camera is a transform on a compositor layer, not a viewBox: changing the viewBox repaints all ~120 gradient
  // circles on the main thread every frame, which a phone cannot keep up with. The SVG is drawn at its closest zoom
  // (LAYER_SCALE x the figure) and only ever scaled down from there, so it stays sharp without being re-rastered.
  const figure = useRef<HTMLDivElement>(null);
  const fit = useMotionValue(1); // px per user unit when the whole rosary fits the figure
  useEffect(() => {
    const el = figure.current;
    if (!el) return;
    const measure = () => fit.set(Math.min(el.clientWidth, (el.clientHeight * WIDTH) / HEIGHT) / WIDTH);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit]);
  const zoom = useTransform(cameraZoom, (z) => WIDTH / Math.exp(z)); // 1 = whole rosary, 3 = closest
  const scale = useTransform(zoom, (k) => k / LAYER_SCALE);
  const x = useTransform([zoom, fit, cameraX], ([k, f, cx]: number[]) => k * f * (WIDTH / 2 - cx));
  const y = useTransform([zoom, fit, cameraY], ([k, f, cy]: number[]) => k * f * (HEIGHT / 2 - cy));

  const reached = WALK.indexOf(part.reach);
  const stateOf = (id: string) => {
    if (!full) return "prayed";
    if (part.beads.includes(id)) return "current";
    return WALK.indexOf(id) <= reached ? "prayed" : "ahead";
  };

  // The light runs along the beads of a part in prayer order, and leaves all at once.
  const lightDelay = (id: string) => {
    const position = part.beads.indexOf(id);
    return { transitionDelay: `${Math.max(position, 0) * (part.beads.length > 11 ? 14 : 45)}ms` };
  };

  return (
    <section className="land-walk" aria-labelledby="walk-title">
      <div ref={trackRef} className="land-walk-track">
        <div className="land-walk-stage">
          <h2 id="walk-title" className="land-walk-title">
            The Rosary, bead by bead
          </h2>

          <div ref={figure} className="land-walk-figure" aria-hidden>
            <motion.svg
              viewBox={WHOLE}
              className={full ? "land-walk-rosary land-walk-rosary-live" : "land-walk-rosary"}
              style={full ? { ...LAYER_BOX, x, y, scale } : undefined}
            >
              <defs>
                {/* Pearl: lit from the upper left, with a warm core and a darker edge so each bead reads as round. */}
                <radialGradient id="walk-pearl" cx="50%" cy="50%" r="55%" fx="34%" fy="28%">
                  <stop offset="0%" stopColor="#fffdf6" />
                  <stop offset="28%" stopColor="#f2e8d3" />
                  <stop offset="68%" stopColor="#c9b797" />
                  <stop offset="100%" stopColor="#6a5a43" />
                </radialGradient>
                <linearGradient id="walk-metal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f3dc9c" />
                  <stop offset="45%" stopColor="#c9a24b" />
                  <stop offset="100%" stopColor="#8a6a2c" />
                </linearGradient>
                {/* The same pearl with no light on it: warm and low, so beads not yet reached do not turn grey. */}
                <radialGradient id="walk-pearl-unlit" cx="50%" cy="50%" r="55%" fx="34%" fy="28%">
                  <stop offset="0%" stopColor="#a8987a" />
                  <stop offset="45%" stopColor="#786a50" />
                  <stop offset="100%" stopColor="#332b1e" />
                </radialGradient>
                {/* Spans the whole cross, so its arms and buds catch the light as one piece of metal. */}
                <linearGradient id="walk-cross" gradientUnits="userSpaceOnUse" x1={-16} y1={-28} x2={16} y2={28}>
                  <stop offset="0%" stopColor="#f6e2a8" />
                  <stop offset="50%" stopColor="#c9a24b" />
                  <stop offset="100%" stopColor="#8a6a2c" />
                </linearGradient>
                <linearGradient id="walk-corpus" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fbf3dd" />
                  <stop offset="55%" stopColor="#e2d4b2" />
                  <stop offset="100%" stopColor="#9c8862" />
                </linearGradient>
                <radialGradient id="walk-glow">
                  <stop offset="0%" stopColor="#ecd08a" stopOpacity={0.6} />
                  <stop offset="55%" stopColor="#ecd08a" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ecd08a" stopOpacity={0} />
                </radialGradient>
              </defs>

              {full &&
                HALOS.map((halo) => (
                  <circle
                    key={halo.id}
                    cx={halo.x}
                    cy={halo.y}
                    r={halo.r}
                    fill="url(#walk-glow)"
                    fillOpacity={halo.strength}
                    className="land-walk-halo"
                    data-on={part.beads.includes(halo.id)}
                    style={lightDelay(halo.id)}
                  />
                ))}

              <g fill="none" stroke="#c9a24b" strokeLinecap="round" opacity={0.9}>
                <path d={CHAIN.flat} strokeWidth={0.42} />
                <path d={CHAIN.edge} strokeWidth={0.7} />
              </g>

              {BEADS.map((bead) => (
                <g key={bead.id} className="land-walk-bead" data-state={stateOf(bead.id)}>
                  <circle cx={bead.x} cy={bead.y} r={bead.r} fill="url(#walk-pearl-unlit)" />
                  <circle cx={bead.x} cy={bead.y} r={bead.r} fill="url(#walk-pearl)" className="land-walk-lit" style={lightDelay(bead.id)} />
                </g>
              ))}
              <g className="land-walk-part" data-state={stateOf("medal")}>
                <Medal />
              </g>
              <g className="land-walk-part" data-state={stateOf("crucifix")}>
                <Crucifix />
              </g>
            </motion.svg>
          </div>

          {/* Read by eye only: the list below carries the same words for assistive tech, in one piece. */}
          <div className="land-walk-caption" aria-hidden>
            <AnimatePresence initial={false}>
              <motion.div
                key={index}
                className="land-walk-words"
                initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(3px)", transition: { duration: 0.4, ease: "easeInOut" } }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <p className="land-walk-where">{part.title}</p>
                <p className="land-walk-prayers">{part.prayers}</p>
                <p className="land-walk-detail">{part.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ol className="land-walk-list">
        {PARTS.map((item) => (
          <li key={item.title}>
            <p className="land-walk-where">{item.title}</p>
            <p className="land-walk-prayers">{item.prayers}</p>
            <p className="land-walk-detail">{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
