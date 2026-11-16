import type { ReactNode } from "react";

import { Beam, CARD, CARRIED, Crucifix, Figure, GOLD, INK, Scene } from "@/components/illustration/parts";
import { cn } from "@/lib/utils";

/** One, two or three gold dots in the sky: the number of falls. */
function tally(count: number) {
  return (
    <g fill={GOLD}>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={32 + (i - (count - 1) / 2) * 6} cy="12" r="1.7" />
      ))}
    </g>
  );
}

/** Jesus fallen beneath the cross. */
function fallen(count: number) {
  return (
    <Scene>
      <Figure x={46} y={51} scale={0.85} rot={-86} halo />
      <Beam x1={12} y1={40} x2={58} y2={30} />
      <Beam x1={50} y1={22} x2={53} y2={40} w={2.6} />
      {tally(count)}
    </Scene>
  );
}

const STATION_ART: ReactNode[] = [
  // 1. Jesus is condemned to death: bound before Pilate, who washes his hands.
  <Scene key="1">
    <Figure x={18} rot={4} halo />
    <Figure x={38} fill={GOLD} />
    <path d="M47 46h12c0 5-2.5 7-6 7s-6-2-6-7Z" fill={GOLD} />
  </Scene>,
  // 2. Jesus takes up his cross.
  <Scene key="2">
    {CARRIED}
    <Figure x={28} rot={9} halo />
  </Scene>,
  // 3. First fall.
  fallen(1),
  // 4. Jesus meets his mother: a pierced heart between them.
  <Scene key="3">
    <Figure x={17} rot={7} halo />
    <Figure x={46} fill={GOLD} veil />
    <path d="M32 27c-6-4-8-8-5.5-11 2-2.2 4.5-1 5.5 1 1-2 3.5-3.2 5.5-1 2.5 3 .5 7-5.5 11Z" fill={GOLD} />
    <Beam x1={32} y1={6} x2={32} y2={20} w={1.4} />
  </Scene>,
  // 5. Simon of Cyrene helps: he takes the weight behind Jesus.
  <Scene key="4">
    {CARRIED}
    <Figure x={18} rot={8} fill={GOLD} />
    <Figure x={38} rot={9} halo />
  </Scene>,
  // 6. Veronica wipes the face of Jesus: she offers the veil, his face on it.
  <Scene key="5">
    <Figure x={15} y={54} scale={0.9} rot={10} fill={GOLD} veil />
    <path d="M29 9h26v35c-4 4-9-3-13 0s-9 4-13 0Z" fill={CARD} stroke={INK} strokeWidth="1.1" />
    <circle cx="42" cy="24" r="8" fill={GOLD} fillOpacity=".3" stroke={GOLD} strokeWidth=".9" />
    <circle cx="42" cy="24" r="3.7" fill={INK} fillOpacity=".8" />
  </Scene>,
  // 7. Second fall.
  fallen(2),
  // 8. The women of Jerusalem weep; Jesus turns to them.
  <Scene key="6">
    <Figure x={13} scale={0.92} fill={GOLD} veil rot={-4} />
    <Figure x={27} scale={0.82} fill={GOLD} veil rot={-4} />
    <path d="M20 14s-3 4-3 7a3 3 0 0 0 6 0c0-3-3-7-3-7Z" fill={GOLD} fillOpacity=".7" />
    <Figure x={48} rot={-3} halo />
  </Scene>,
  // 9. Third fall.
  fallen(3),
  // 10. Jesus is stripped of his garments: the tunic is taken from him.
  <Scene key="7">
    <Figure x={20} halo />
    <g transform="translate(31 17) scale(.58)" fill={GOLD}>
      <path d="M22 8 8 20l7 9 7-5v34h20V24l7 5 7-9-14-12c-2 5-6 8-10 8s-8-3-10-8Z" />
      <path d="M32 24v32" stroke={CARD} strokeWidth="2" strokeDasharray="4 4" fill="none" />
    </g>
  </Scene>,
  // 11. Jesus is nailed to the cross.
  <Scene key="8">
    <Crucifix />
    <Figure x={12} scale={0.55} fill={GOLD} />
    <g stroke={GOLD} strokeWidth="1.2" strokeLinecap="round">
      <line x1="6" y1="14" x2="10" y2="18" />
      <line x1="58" y1="14" x2="54" y2="18" />
    </g>
  </Scene>,
  // 12. Jesus dies on the cross: darkened sun, Mary and John at the foot.
  <Scene key="9" dark>
    <circle cx="50" cy="14" r="6" fill={GOLD} fillOpacity=".5" />
    <circle cx="53" cy="12" r="6" fill={INK} fillOpacity=".8" />
    <Crucifix tilt={9} nails={false} />
    <Figure x={14} scale={0.55} fill={GOLD} veil />
    <Figure x={50} scale={0.55} />
  </Scene>,
  // 13. Jesus is taken down from the cross.
  <Scene key="10">
    <Crucifix cx={44} />
    <g stroke={GOLD} strokeWidth="1.6" strokeLinecap="round">
      <line x1="9" y1="56" x2="26" y2="14" />
      <line x1="19" y1="56" x2="36" y2="14" />
      <line x1="12.5" y1="46" x2="22.5" y2="46" />
      <line x1="15.5" y1="36" x2="25.5" y2="36" />
      <line x1="18.5" y1="26" x2="28.5" y2="26" />
    </g>
  </Scene>,
  // 14. Jesus is laid in the tomb: wrapped in linen, the stone beside the door.
  <Scene key="11" dark>
    <path d="M10 58V34a22 22 0 0 1 44 0v24Z" fill={INK} fillOpacity=".88" />
    <rect x="14" y="43" width="30" height="9" rx="4.5" fill={CARD} />
    <circle cx="19" cy="47.5" r="6" fill={GOLD} fillOpacity=".35" stroke={GOLD} strokeWidth=".9" />
    <path d="M26 44v7M31 44v7M36 44v7" stroke={INK} strokeOpacity=".35" strokeWidth=".8" />
    <circle cx="51" cy="47" r="10" fill={GOLD} />
    <path d="M45 43c3-2 7-2 10 1" stroke={CARD} strokeOpacity=".5" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </Scene>,
];

/** Opening and closing prayers: worshippers before the cross, in a gold light. */
const CROSS: ReactNode = (
  <Scene>
    <circle cx="32" cy="24" r="13" fill={GOLD} fillOpacity=".3" stroke={GOLD} strokeWidth=".9" />
    <Beam x1={32} y1={8} x2={32} y2={50} w={3.4} />
    <Beam x1={21} y1={21} x2={43} y2={21} w={3.4} />
    <Figure x={13} scale={0.62} fill={GOLD} />
    <Figure x={51} scale={0.62} />
  </Scene>
);

/** Station number (1-based) from a bead id such as "station-3", or null for the opening and closing. */
export function stationNumber(beadId: string) {
  const match = /^station-(\d+)$/.exec(beadId);
  return match ? Number(match[1]) : null;
}

export function StationArt({ station, className }: { station: number | null; className?: string }) {
  const art = station === null ? CROSS : STATION_ART[station - 1] ?? CROSS;
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-14 shrink-0", className)}
    >
      {art}
    </svg>
  );
}
