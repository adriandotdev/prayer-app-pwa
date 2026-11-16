import type { ReactNode } from "react";

export const GOLD = "var(--gold)";
export const CARD = "var(--card)";
export const INK = "currentColor";

// Shared pieces for the flat illustrations on a 64x64 arch. Ink follows currentColor, gold is the single
// accent, and the card colour cuts folds and faces out of the shapes. Figures are
// faceless silhouettes: a robe, a head, and a halo for Christ.

type FigureProps = {
  /** Where the feet stand. */
  x: number;
  y?: number;
  scale?: number;
  /** Degrees, clockwise, pivoting on the feet. */
  rot?: number;
  fill?: string;
  halo?: boolean;
  veil?: boolean;
};

/** A standing figure, 30 units tall at scale 1, built around a head at the origin. */
export function Figure({ x, y = 53, scale = 1, rot = 0, fill = INK, halo = false, veil = false }: FigureProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale}) translate(0 -30)`}>
      {halo && <circle r="6.4" fill={GOLD} fillOpacity=".35" stroke={GOLD} strokeWidth=".9" />}
      <path d="M-3 4.2C-6.5 5.5-8 11-9.5 30h19C8 11 6.5 5.5 3 4.2c-1.5-.6-4.5-.6-6 0Z" fill={fill} />
      {veil ? (
        <path d="M-4.4 0c0-5.4 8.8-5.4 8.8 0 0 3.5 1.8 6.5 3 10.5l-13.8 0c1.2-4 3-7 3-10.5Z" fill={fill} />
      ) : (
        <circle r="3.7" fill={fill} />
      )}
      {veil && <ellipse cx="0" cy="1" rx="2.2" ry="2.8" fill={CARD} fillOpacity=".85" />}
      <path d="M-1.2 12-2.4 30M3 13l1.6 17" stroke={CARD} strokeWidth=".7" strokeOpacity=".6" fill="none" />
    </g>
  );
}

/** The arch window every scene sits in; `dark` dims the sky for the crucifixion. */
export function Scene({ dark = false, children }: { dark?: boolean; children: ReactNode }) {
  return (
    <>
      <path d="M4 60V30C4 14 16 4 32 4s28 10 28 26v30Z" fill={INK} fillOpacity={dark ? 0.26 : 0.08} />
      <path d="M4 49c10-3 20-4 28-4s18 1 28 4v11H4Z" fill={INK} fillOpacity=".16" />
      {children}
    </>
  );
}

export function Beam({ x1, y1, x2, y2, w = 3 }: { x1: number; y1: number; x2: number; y2: number; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={w} strokeLinecap="round" />;
}

/** The cross carried on the shoulder, climbing to the right. */
export const CARRIED = (
  <>
    <Beam x1={8} y1={57} x2={52} y2={15} />
    <Beam x1={38} y1={20} x2={50} y2={32} w={2.6} />
  </>
);

/** Jesus on the cross: arms along the beam, halo, nails in gold. `tilt` leans the head. */
export function Crucifix({ cx = 32, tilt = 0, nails = true }: { cx?: number; tilt?: number; nails?: boolean }) {
  return (
    <g transform={`translate(${cx - 32} 0)`}>
      <Beam x1={32} y1={8} x2={32} y2={50} w={3.4} />
      <Beam x1={14} y1={21} x2={50} y2={21} w={3.4} />
      <circle cx="32" cy="14.5" r="6.4" fill={GOLD} fillOpacity=".35" stroke={GOLD} strokeWidth=".9" />
      <g transform={`rotate(${tilt} 32 17)`}>
        <circle cx="32" cy="14.5" r="3.3" fill={INK} />
      </g>
      <path d="M29 19.2h6l1.6 24h-9.2Z" fill={INK} />
      <path d="M30.8 24l.8 18M33.4 24l-.6 18" stroke={CARD} strokeWidth=".6" strokeOpacity=".6" />
      {nails && (
        <g fill={GOLD}>
          <circle cx="14" cy="21" r="1.8" />
          <circle cx="50" cy="21" r="1.8" />
          <circle cx="32" cy="48" r="1.8" />
        </g>
      )}
    </g>
  );
}
