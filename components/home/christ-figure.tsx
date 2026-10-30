/**
 * A minimalist Christ: flat shapes, no features, a cruciform halo. It takes its colour from
 * `currentColor` (robe, hair, face) and the gold token (halo), so it follows the theme.
 * The halo disc is the candle: it breathes slowly behind the head.
 */
export function ChristFigure({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 160 160" className={className}>
      <circle cx={80} cy={56} r={46} className="ora-candle fill-gold/15" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <circle cx={80} cy={56} r={46} fill="none" strokeWidth={1.5} className="stroke-gold/60" />
      <g className="fill-gold">
        <rect x={75} y={10} width={10} height={15} />
        <rect x={34} y={51} width={20} height={10} />
        <rect x={106} y={51} width={20} height={10} />
      </g>

      <g fill="currentColor">
        <path opacity={0.28} d="M16 160C16 126 42 110 66 104L80 118L94 104C118 110 144 126 144 160Z" />
        <path
          opacity={0.45}
          d="M54 52C54 30 66 24 80 24C94 24 106 30 106 52L110 98C100 92 96 88 94 82L66 82C64 88 60 92 50 98Z"
        />
        <path d="M65 60L65 50C65 38 71 34 80 34C89 34 95 38 95 50L95 60Z" />
        <path opacity={0.7} d="M65 60L95 60C96 72 90 84 80 88C70 84 64 72 65 60Z" />
      </g>
    </svg>
  );
}
