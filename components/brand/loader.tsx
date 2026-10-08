/** Bead positions (cx, cy, r) from public/brand/ora-loading.svg. */
const BEADS: [number, number, number][] = [
  [48, 17, 3],
  [63.5, 21.2, 3],
  [74.8, 32.5, 3],
  [79, 48, 3],
  [74.8, 63.5, 3],
  [63.5, 74.8, 3],
  [48, 79, 4.5],
  [32.5, 74.8, 3],
  [21.2, 63.5, 3],
  [17, 48, 3],
  [21.2, 32.5, 3],
  [32.5, 21.2, 3],
];

/**
 * Inline version of ora-loading.svg so the beads follow the theme through
 * currentColor. The animation lives in globals.css and respects reduced motion.
 */
export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center py-16 text-foreground">
      <svg viewBox="0 0 96 96" className="ora-loader size-24" aria-hidden>
        <g className="ora-loader-beads" transform="translate(4.8 -4.2) scale(.9)">
          {BEADS.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <g fill="var(--gold)" transform="translate(4.8 -4.2) scale(.9)">
          {BEADS.map(([cx, cy, r], i) => (
            <circle
              key={`${cx}-${cy}`}
              className="ora-loader-glow"
              style={{ animationDelay: `${-1.8 + i * 0.15}s` }}
              cx={cx}
              cy={cy}
              r={r}
            />
          ))}
        </g>
        <path d="M48 70v7" fill="none" stroke="currentColor" strokeWidth="2" opacity=".5" />
        <path d="M46 75h4v5h5v4h-5v9h-4v-9h-5v-4h5z" fill="currentColor" opacity=".72" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
