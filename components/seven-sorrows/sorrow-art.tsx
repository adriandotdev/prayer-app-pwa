import type { ReactNode } from "react";

import { Beam, CARD, Crucifix, Figure, GOLD, INK, Scene } from "@/components/illustration/parts";
import { cn } from "@/lib/utils";

const HEART = "M32 27c-6-4-8-8-5.5-11 2-2.2 4.5-1 5.5 1 1-2 3.5-3.2 5.5-1 2.5 3 .5 7-5.5 11Z";

const SORROW_ART: ReactNode[] = [
  // 1. The prophecy of Simeon: Mary holds the child; a sword over her heart.
  <Scene key="1">
    <Figure x={20} fill={GOLD} veil />
    <Figure x={20} y={44} scale={0.34} halo />
    <Figure x={47} />
    <path d={HEART} fill={GOLD} transform="translate(0 -3)" />
    <Beam x1={32} y1={5} x2={32} y2={17} w={1.4} />
  </Scene>,
  // 2. The flight into Egypt: Mary and the child on a donkey, Joseph leading under a star.
  <Scene key="2">
    <path d="M32 8l1.3 3.2 3.4.3-2.6 2.2.8 3.3-2.9-1.8-2.9 1.8.8-3.3-2.6-2.2 3.4-.3Z" fill={GOLD} />
    <Figure x={13} rot={-4} />
    <g fill={INK}>
      <ellipse cx="41" cy="45" rx="12" ry="6.5" />
      <path d="M50 41l7-8 3 2-3 11Z" />
      <path d="M33 48l-1 9M38 49l-.5 8M46 49l.5 8M51 48l1 9" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </g>
    <Figure x={40} y={44} scale={0.62} fill={GOLD} veil />
  </Scene>,
  // 3. The loss of Jesus in the temple: they search; a lit doorway behind.
  <Scene key="3">
    <path d="M38 58V30a10 10 0 0 1 20 0v28Z" fill={INK} fillOpacity=".7" />
    <circle cx="48" cy="40" r="6" fill={GOLD} fillOpacity=".35" stroke={GOLD} strokeWidth=".9" />
    <path d="M40 58V34M56 58V34" stroke={CARD} strokeOpacity=".5" strokeWidth="1" />
    <Figure x={10} rot={-6} fill={GOLD} veil />
    <Figure x={24} scale={0.92} rot={-4} />
    <path d="M14 8c1.5-2.5 5-2.5 6.5 0M23 10c1.5-2.5 5-2.5 6.5 0" stroke={GOLD} strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </Scene>,
  // 4. Mary meets Jesus on the way of the cross.
  <Scene key="4">
    <Beam x1={24} y1={58} x2={58} y2={30} />
    <Beam x1={49} y1={33} x2={57} y2={43} w={2.6} />
    <Figure x={14} rot={5} fill={GOLD} veil />
    <Figure x={38} rot={9} halo />
    <path d={HEART} fill={GOLD} transform="translate(-7 -8) scale(.55)" />
  </Scene>,
  // 5. The crucifixion: Mary at the foot of the cross.
  <Scene key="5" dark>
    <circle cx="50" cy="14" r="6" fill={GOLD} fillOpacity=".5" />
    <circle cx="53" cy="12" r="6" fill={INK} fillOpacity=".8" />
    <Crucifix tilt={9} nails={false} />
    <Figure x={16} scale={0.6} fill={GOLD} veil />
    <Figure x={48} scale={0.6} />
  </Scene>,
  // 6. Jesus is taken down: Mary holds her son.
  <Scene key="6">
    <Figure x={18} y={55} fill={GOLD} veil rot={4} />
    <Figure x={54} y={53} scale={0.85} rot={-86} halo />
  </Scene>,
  // 7. The burial: Mary mourns before the tomb, the stone beside it.
  <Scene key="7" dark>
    <path d="M26 58V36a16 16 0 0 1 32 0v22Z" fill={INK} fillOpacity=".88" />
    <circle cx="42" cy="34" r="5" fill={GOLD} fillOpacity=".35" stroke={GOLD} strokeWidth=".9" />
    <path d="M32 58V46h20v12" fill="none" stroke={CARD} strokeOpacity=".4" strokeWidth="1" />
    <Figure x={14} fill={GOLD} veil rot={6} />
  </Scene>,
];

/** The opening and closing prayers: a pierced heart in a gold light. */
const HEART_SCENE: ReactNode = (
  <Scene>
    <circle cx="32" cy="30" r="17" fill={GOLD} fillOpacity=".3" stroke={GOLD} strokeWidth=".9" />
    <path d={HEART} fill={GOLD} transform="translate(0 6) scale(1)" />
    <Beam x1={32} y1={8} x2={32} y2={36} w={1.8} />
    <Figure x={13} scale={0.62} fill={GOLD} veil />
    <Figure x={51} scale={0.62} />
  </Scene>
);

/** Sorrow number (1-based) and Hail Mary count (0 for the sorrow itself) from a bead id such as "s2-5". */
export function sorrowPosition(beadId: string) {
  const match = /^s(\d)-(\d)$/.exec(beadId);
  return match ? { sorrow: Number(match[1]) + 1, hailMary: Number(match[2]) } : null;
}

export function SorrowArt({ sorrow, className }: { sorrow: number | null; className?: string }) {
  const art = sorrow === null ? HEART_SCENE : SORROW_ART[sorrow - 1] ?? HEART_SCENE;
  return (
    <svg aria-hidden viewBox="0 0 64 64" fill="currentColor" className={cn("size-14 shrink-0", className)}>
      {art}
    </svg>
  );
}
