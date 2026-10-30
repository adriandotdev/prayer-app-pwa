import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const GOLD = "var(--gold)";

/** Short strokes radiating from (cx, cy), used for sun rays and thorns. */
function radial(cx: number, cy: number, r1: number, r2: number, angles: number[], rx = 1, ry = 1) {
  return angles.map((deg) => {
    const a = (deg * Math.PI) / 180;
    return (
      <line
        key={deg}
        x1={cx + Math.cos(a) * r1 * rx}
        y1={cy + Math.sin(a) * r1 * ry}
        x2={cx + Math.cos(a) * r2 * rx}
        y2={cy + Math.sin(a) * r2 * ry}
      />
    );
  });
}

const THORN_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

// One flat line glyph per mystery, 64x64. Ink follows currentColor; the single
// accent is gold. Keyed by mystery name, which is how the sequence labels steps.
const ART: Record<string, ReactNode> = {
  // Joyful
  "The Annunciation": (
    <>
      <path d="M32 56V30M32 30C26 26 24 18 28 12c3 3 4 8 4 18ZM32 30c6-4 8-12 4-18-3 3-4 8-4 18ZM32 44c-6-2-10-6-12-12M32 44c6-2 10-6 12-12" />
      <g stroke={GOLD}>{radial(32, 8, 3, 6, [-150, -90, -30])}</g>
    </>
  ),
  "The Visitation": (
    <>
      <circle cx="21" cy="19" r="4.5" />
      <circle cx="43" cy="19" r="4.5" />
      <path d="M12 56V42c0-9 4-13 9-13s9 4 9 13M34 56V42c0-9 4-13 9-13s9 4 9 13" />
      <circle cx="32" cy="44" r="2" stroke={GOLD} />
    </>
  ),
  "The Nativity": (
    <>
      <path d="M12 42h40M16 42l-4 14M48 42l4 14M22 56h20" />
      <path d="M22 40c0-6 20-6 20 0" />
      <path d="M32 6l2.5 6.5L41 15l-6.5 2.5L32 24l-2.5-6.5L23 15l6.5-2.5Z" stroke={GOLD} />
    </>
  ),
  "The Presentation": (
    <>
      <path d="M10 28 32 12l22 16ZM18 28v22M28 28v22M36 28v22M46 28v22M8 52h48" />
      <circle cx="32" cy="22" r="2.2" stroke={GOLD} />
    </>
  ),
  "The Finding in the Temple": (
    <>
      <path d="M32 22C24 16 16 16 9 20v26c7-4 15-4 23 2 8-6 16-6 23-2V20c-7-4-15-4-23 2ZM32 22v26" />
      <circle cx="32" cy="10" r="3" stroke={GOLD} />
    </>
  ),
  // Luminous
  "The Baptism of Jesus": (
    <>
      <path d="M32 8c0 0-13 17-13 28a13 13 0 0 0 26 0C45 25 32 8 32 8Z" />
      <path d="M12 56c6-4 10-4 14 0s10 4 14 0 8-4 12 0" stroke={GOLD} />
    </>
  ),
  "The Wedding at Cana": (
    <>
      <path d="M25 10h14M27 10v8c-11 6-11 28-1 34h12c10-6 10-28 0-34v-8" />
      <path d="M19 36c4 3 8 3 13 0s9-3 13 0" stroke={GOLD} />
    </>
  ),
  "The Proclamation of the Kingdom": (
    <>
      <circle cx="22" cy="22" r="10" />
      <path d="M29 29 52 52M44 44l6-6M50 50l5-5" />
      <circle cx="22" cy="22" r="3" stroke={GOLD} />
    </>
  ),
  "The Transfiguration": (
    <>
      <path d="M8 56 28 32l8 10 6-8 14 22Z" />
      <circle cx="32" cy="16" r="5" stroke={GOLD} />
      <g stroke={GOLD}>{radial(32, 16, 9, 13, [-180, -135, -90, -45, 0])}</g>
    </>
  ),
  "The Institution of the Eucharist": (
    <>
      <path d="M19 30h26c0 9-6 14-13 14s-13-5-13-14ZM32 44v10M24 54h16" />
      <circle cx="32" cy="16" r="8" stroke={GOLD} />
      <path d="M32 12v8M28 16h8" stroke={GOLD} />
    </>
  ),
  // Sorrowful
  "The Agony in the Garden": (
    <>
      <path d="M12 54C28 46 42 34 52 10" />
      <g transform="rotate(-55 21 38)"><ellipse cx="21" cy="38" rx="7" ry="2.8" /></g>
      <g transform="rotate(25 35 46)"><ellipse cx="35" cy="46" rx="7" ry="2.8" /></g>
      <g transform="rotate(-60 33 26)"><ellipse cx="33" cy="26" rx="7" ry="2.8" /></g>
      <g transform="rotate(20 49 31)"><ellipse cx="49" cy="31" rx="7" ry="2.8" /></g>
      <circle cx="14" cy="20" r="2.4" stroke={GOLD} />
    </>
  ),
  "The Scourging at the Pillar": (
    <>
      <path d="M22 10h20M24 10v6h16v-6M26 16v34M38 16v34M20 50h24M18 56h28" />
      <path d="M26 26c4 3 8 3 12 0M26 36c4 3 8 3 12 0" stroke={GOLD} />
    </>
  ),
  "The Crowning with Thorns": (
    <>
      <ellipse cx="32" cy="28" rx="18" ry="9" />
      {radial(32, 28, 1, 1.3, THORN_ANGLES, 18, 9)}
      <path d="M32 44c0 0-3 4-3 7a3 3 0 0 0 6 0c0-3-3-7-3-7Z" stroke={GOLD} />
    </>
  ),
  "The Carrying of the Cross": (
    <>
      <g transform="rotate(-24 32 30)">
        <path d="M32 6v46M20 18h24" />
      </g>
      <path d="M8 56h48" stroke={GOLD} />
    </>
  ),
  "The Crucifixion": (
    <>
      <path d="M32 6v46M20 18h24" />
      <path d="M8 58c8-4 14-6 24-6s16 2 24 6" stroke={GOLD} />
    </>
  ),
  // Glorious
  "The Resurrection": (
    <>
      <path d="M14 56V40a18 18 0 0 1 36 0v16M8 56h48" />
      <g stroke={GOLD}>{radial(32, 28, 8, 16, [-180, -150, -120, -90, -60, -30, 0])}</g>
    </>
  ),
  "The Ascension": (
    <>
      <path d="M10 56h44M18 48h28" />
      <path d="M32 40V8M22 18l10-10 10 10" stroke={GOLD} />
    </>
  ),
  "The Descent of the Holy Spirit": (
    <>
      <path d="M32 6c8 12 16 20 16 32a16 16 0 0 1-32 0c0-8 6-12 9-20 2 4 3 6 5 7 2-6 2-12 2-19Z" />
      <path d="M32 54a7 7 0 0 1-7-7c0-6 7-9 7-16 0 7 7 10 7 16a7 7 0 0 1-7 7Z" stroke={GOLD} />
    </>
  ),
  "The Assumption of Mary": (
    <>
      <path d="M42 8A24 24 0 1 0 42 56 18 18 0 1 1 42 8Z" />
      <path d="M48 20l1.8 4.2 4.2 1.8-4.2 1.8L48 32l-1.8-4.2L42 26l4.2-1.8Z" stroke={GOLD} />
    </>
  ),
  "The Coronation of Mary": (
    <>
      <path d="M12 46V24l13 11 7-17 7 17 13-11v22ZM12 54h40" />
      <g stroke={GOLD}>
        <circle cx="12" cy="19" r="2.2" />
        <circle cx="32" cy="12" r="2.2" />
        <circle cx="52" cy="19" r="2.2" />
      </g>
    </>
  ),
};

export function hasMysteryArt(name: string) {
  return name in ART;
}

export function MysteryArt({ name, className }: { name: string; className?: string }) {
  const art = ART[name];
  if (!art) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-14 shrink-0", className)}
    >
      {art}
    </svg>
  );
}
