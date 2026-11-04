import type { ReactNode } from "react";

/**
 * The Litany as a wall of lancet windows. Flat glass and lead, no features on the faces (the same
 * language as ChristFigure). Each window is one SVG on a 200 by 540 grid; SaintWall lights them in turn.
 */

const LEAD = "#0b1226";
const SKIN = "#f1d9b5";
const GOLD = "#e6bd5a";
const GOLD_DEEP = "#b98a2c";
const WHITE = "#f4efe0";
const SHADE = "#cfc7b2";

function Glass({ d, fill }: { d: string; fill: string }) {
  return <path d={d} fill={fill} stroke={LEAD} strokeWidth={2.5} strokeLinejoin="round" />;
}

/** Diamond quarries behind the figure, in two tones of one colour. */
function Quarries({ a, b, id }: { a: string; b: string; id: string }) {
  const cells: ReactNode[] = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 7; col++) {
      const x = col * 36 + (row % 2 ? 18 : 0) - 8;
      const y = row * 19 * 2 - 14;
      cells.push(
        <path
          key={`${row}-${col}`}
          d={`M${x} ${y - 19}L${x + 18} ${y}L${x} ${y + 19}L${x - 18} ${y}Z`}
          fill={(row * 3 + col * 5) % 4 === 0 ? b : a}
          stroke={LEAD}
          strokeWidth={1.5}
        />,
      );
    }
  }
  return <g clipPath={`url(#${id})`}>{cells}</g>;
}

/** A segmented gold nimbus, the way glaziers cut one from several pieces. */
function Halo({ cx = 100, cy = 118, r = 40 }: { cx?: number; cy?: number; r?: number }) {
  const segments = Array.from({ length: 12 }, (_, i) => {
    const a0 = (i * Math.PI) / 6;
    const a1 = ((i + 1) * Math.PI) / 6;
    const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    return (
      <path
        key={i}
        d={`M${cx} ${cy}L${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}Z`}
        fill={i % 2 ? GOLD : GOLD_DEEP}
        stroke={LEAD}
        strokeWidth={1.5}
      />
    );
  });
  return <g className="pane">{segments}</g>;
}

function Face({ cy = 118 }: { cy?: number }) {
  // Painted on the glass, as glaziers did: eyes closed in prayer, a line of brow and nose, a quiet mouth.
  return (
    <g>
      <ellipse cx={100} cy={cy} rx={19} ry={23} fill={SKIN} stroke={LEAD} strokeWidth={2.5} />
      <path
        d={`M88 ${cy - 3}q5 4 9 0M103 ${cy - 3}q5 4 9 0M97 ${cy - 8}q3 -2 2 2v9q0 3 3 3M95 ${cy + 13}q5 2 10 0`}
        fill="none"
        stroke="#5a3d22"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </g>
  );
}

function Hand({ x, y }: { x: number; y: number }) {
  return <ellipse cx={x} cy={y} rx={8} ry={9.5} fill={SKIN} stroke={LEAD} strokeWidth={2.5} />;
}

function Star({ x, y, r = 8, fill = GOLD }: { x: number; y: number; r?: number; fill?: string }) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8;
    const d = i % 2 ? r * 0.38 : r;
    return `${(x + d * Math.cos(a)).toFixed(1)},${(y + d * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <polygon points={points} fill={fill} stroke={LEAD} strokeWidth={1.2} />;
}

/** A hanging rosary: beads along a path of points, ending in a small cross. */
function Beads({ points, fill = "#16233f" }: { points: [number, number][]; fill?: string }) {
  const [lx, ly] = points[points.length - 1];
  return (
    <g>
      <polyline points={points.map((p) => p.join(",")).join(" ")} fill="none" stroke={LEAD} strokeWidth={1.5} />
      {points.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3.6} fill={fill} stroke={GOLD} strokeWidth={1} />
      ))}
      <path d={`M${lx - 2} ${ly + 3}h4v8h6v4h-6v12h-4v-12h-6v-4h6z`} fill={GOLD} stroke={LEAD} strokeWidth={1} />
    </g>
  );
}

function Mary() {
  return (
    <>
      <Halo />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = Math.PI + (i * Math.PI) / 6;
        return <Star key={i} x={100 + 56 * Math.cos(a)} y={118 + 56 * Math.sin(a)} r={7} />;
      })}
      <Glass d="M76 170C88 160 112 160 124 170L134 300L128 470H72L66 300Z" fill="#f4efe0" />
      <Glass d="M85 200H115L120 290H80Z" fill="#b6382e" />
      <Glass d="M100 72C72 76 66 104 68 138C60 190 46 300 32 470H84L92 300L88 190C84 160 80 140 84 118C86 100 92 92 100 92Z" fill="#2a58b8" />
      <Glass d="M100 72C128 76 134 104 132 138C140 190 154 300 168 470H116L108 300L112 190C116 160 120 140 116 118C114 100 108 92 100 92Z" fill="#1d4394" />
      <Glass d="M58 300C50 360 42 420 32 470H84L92 300Z" fill="#3a6cd0" />
      <Face cy={122} />
      <Hand x={92} y={236} />
      <Hand x={110} y={232} />
      <Beads points={[[100, 244], [103, 256], [99, 268], [103, 280], [99, 292], [102, 304], [98, 316]]} />
      <Star x={74} y={350} r={6} />
      <Star x={132} y={390} r={6} />
    </>
  );
}

function Michael() {
  return (
    <>
      <Glass d="M78 180C50 150 22 150 14 110C10 180 24 260 66 300Z" fill="#c9d6e8" />
      <Glass d="M122 180C150 150 178 150 186 110C190 180 176 260 134 300Z" fill="#c9d6e8" />
      <Glass d="M66 210C48 200 30 190 20 170C22 220 38 270 70 300Z" fill="#8fa8cc" />
      <Glass d="M134 210C152 200 170 190 180 170C178 220 162 270 130 300Z" fill="#8fa8cc" />
      <Halo />
      <Glass d="M80 166C92 158 108 158 120 166L130 270L122 300H78L70 270Z" fill="#c9a24b" />
      <Glass d="M86 180H114L118 262H82Z" fill="#e8d187" />
      <Glass d="M74 296H126L146 470H54Z" fill="#b6382e" />
      <Glass d="M100 296H126L146 470H100Z" fill="#8f2820" />
      <Glass d="M64 180L44 150L34 176L58 214Z" fill="#c9a24b" />
      <Glass d="M145 28L155 28L155 196L145 196Z" fill={WHITE} />
      <Glass d="M128 192H172V204H128Z" fill={GOLD} />
      <Glass d="M145 204H155V226H145Z" fill={GOLD_DEEP} />
      <Glass d="M124 180L146 214L134 222L112 196Z" fill="#c9a24b" />
      <Face />
      <Glass d="M80 110C78 88 92 80 100 80C108 80 122 88 120 110C112 96 88 96 80 110Z" fill="#c0822e" />
      <Hand x={150} y={214} />
      <Hand x={38} y={160} />
      <Glass d="M46 470C70 450 120 448 156 470L150 500H52Z" fill="#2f3c2a" />
      <Glass d="M58 470C78 458 96 468 108 460C122 452 138 460 150 470L136 486H66Z" fill="#6a8f3e" />
    </>
  );
}

function Joseph() {
  return (
    <>
      <Halo />
      <Glass d="M76 168C88 158 112 158 124 168L140 300L146 470H54L60 300Z" fill="#7a5a33" />
      <Glass d="M78 168C60 186 48 260 40 340C60 360 88 340 98 300L98 190C94 178 88 170 78 168Z" fill="#c78f2d" />
      <Glass d="M40 340C60 360 88 340 98 300L108 470H54Z" fill="#a8741f" />
      <Face />
      <Glass d="M80 112C78 88 90 80 100 80C110 80 122 88 120 112C114 98 86 98 80 112Z" fill="#6b5333" />
      <Glass d="M84 134C88 158 112 158 116 134C110 142 90 142 84 134Z" fill="#6b5333" />
      <Glass d="M136 66L142 66L146 470L138 470Z" fill="#5f7a33" />
      {[
        [139, 60],
        [124, 84],
        [156, 88],
        [120, 118],
        [160, 122],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path
            d={`M${x} ${y - 14}C${x + 8} ${y - 6} ${x + 8} ${y + 6} ${x} ${y + 14}C${x - 8} ${y + 6} ${x - 8} ${y - 6} ${x} ${y - 14}Z`}
            fill={WHITE}
            stroke={LEAD}
            strokeWidth={2}
          />
          <circle cx={x} cy={y} r={2.5} fill={GOLD} />
        </g>
      ))}
      <Hand x={140} y={230} />
      <Hand x={126} y={262} />
      <Glass d="M64 470L78 440H128L140 470Z" fill="#3d2c17" />
    </>
  );
}

function Peter() {
  return (
    <>
      <Halo />
      <Glass d="M76 168C88 158 112 158 124 168L134 300L140 470H60L66 300Z" fill="#2a58b8" />
      <Glass d="M88 170C70 190 62 260 56 330C80 372 124 352 148 318C140 260 130 190 112 170C104 196 96 196 88 170Z" fill="#d9a22e" />
      <Glass d="M56 330C80 372 124 352 148 318L154 470H96L84 366Z" fill="#b57f1c" />
      <Face />
      <Glass d="M78 118C74 90 90 80 100 80C110 80 126 90 122 118C118 100 82 100 78 118Z" fill={SHADE} />
      <Glass d="M82 134C84 168 116 168 118 134C110 144 90 144 82 134Z" fill={SHADE} />
      <Hand x={68} y={262} />
      {/* The keys, gold and silver */}
      <Glass d="M60 268L68 268L74 418L66 418Z" fill={GOLD} />
      <circle cx={70} cy={428} r={12} fill={GOLD} stroke={LEAD} strokeWidth={2.5} />
      <path d="M58 274h-16v8h6v6h6v-6h4z" fill={GOLD} stroke={LEAD} strokeWidth={2} />
      <Glass d="M78 268L86 270L84 418L76 416Z" fill={WHITE} />
      <circle cx={80} cy={428} r={9} fill={WHITE} stroke={LEAD} strokeWidth={2.5} />
      <Hand x={132} y={258} />
      {/* The book of the Gospel */}
      <Glass d="M116 268L150 262L154 306L120 312Z" fill="#b6382e" />
      <Glass d="M124 274L144 271L146 300L127 304Z" fill={GOLD_DEEP} />
    </>
  );
}

function Dominic() {
  return (
    <>
      <Halo />
      <Star x={100} y={68} r={13} />
      <Glass d="M74 170C88 160 112 160 126 170L134 300L132 470H68L66 300Z" fill={WHITE} />
      <Glass d="M92 172H108L110 330H90Z" fill={SHADE} />
      <Glass d="M74 170C56 190 42 300 34 470H82L86 280L92 172Z" fill="#141c30" />
      <Glass d="M126 170C144 190 158 300 166 470H118L114 280L108 172Z" fill="#20293f" />
      <Glass d="M68 170C78 186 122 186 132 170C124 208 76 208 68 170Z" fill="#20293f" />
      <Face />
      {/* Tonsure */}
      <Glass d="M80 112C82 96 118 96 120 112C124 100 116 92 100 92C84 92 76 100 80 112Z" fill="#7a5a33" />
      <Hand x={100} y={252} />
      <Beads
        fill="#c7a24d"
        points={[[100, 262], [104, 276], [98, 290], [104, 304], [98, 318], [103, 332], [98, 346], [102, 360]]}
      />
      <Hand x={146} y={330} />
      {/* The lily of his purity */}
      <Glass d="M148 188L152 188L150 322L146 322Z" fill="#5f7a33" />
      <path d="M150 164C160 176 160 186 150 196C140 186 140 176 150 164Z" fill={WHITE} stroke={LEAD} strokeWidth={2} />
    </>
  );
}

function Francis() {
  return (
    <>
      <Halo />
      <Glass d="M74 170C88 160 112 160 126 170L138 300L144 470H56L62 300Z" fill="#7d5a36" />
      <Glass d="M100 170L126 170L138 300L144 470H100Z" fill="#634526" />
      <Glass d="M70 172C80 192 120 192 130 172C120 216 80 216 70 172Z" fill="#8f6a42" />
      <Glass d="M72 298H128V308H72Z" fill={WHITE} />
      <Glass d="M96 308H104L106 410H94Z" fill={WHITE} />
      <Glass d="M64 190L30 148L42 136L84 182Z" fill="#7d5a36" />
      <Glass d="M136 190L170 148L158 136L116 182Z" fill="#634526" />
      <Face />
      <Glass d="M82 110C84 94 116 94 118 110C124 96 114 90 100 90C86 90 76 96 82 110Z" fill="#5c432a" />
      <Hand x={32} y={134} />
      <Hand x={168} y={134} />
      <circle cx={32} cy={134} r={2.6} fill="#b6382e" />
      <circle cx={168} cy={134} r={2.6} fill="#b6382e" />
      {/* A bird comes to his hand */}
      <Glass d="M18 108C24 94 38 94 44 106L54 100L48 114C40 122 26 120 18 108Z" fill={WHITE} />
    </>
  );
}

function Teresa() {
  return (
    <>
      <Halo />
      <Glass d="M74 170C88 160 112 160 126 170L136 300L140 470H60L64 300Z" fill="#7d5a36" />
      <Glass d="M78 168C60 190 44 300 36 470H84L92 280L94 172Z" fill={WHITE} />
      <Glass d="M122 168C140 190 156 300 164 470H116L108 280L106 172Z" fill={SHADE} />
      <Glass d="M100 78C74 80 66 106 68 136C68 158 70 170 78 182L92 172C84 156 82 134 84 118C86 104 92 96 100 96C108 96 114 104 116 118C118 134 116 156 108 172L122 182C130 170 132 158 132 136C134 106 126 80 100 78Z" fill="#141c30" />
      <Face cy={124} />
      <Glass d="M84 142C90 158 110 158 116 142L118 172H82Z" fill={WHITE} />
      {/* Open book and quill: the Doctor of prayer */}
      <Glass d="M70 244L100 254L130 244L130 286L100 296L70 286Z" fill={WHITE} />
      <Glass d="M100 254L130 244L130 286L100 296Z" fill={SHADE} />
      <Hand x={68} y={282} />
      <Hand x={132} y={224} />
      <Glass d="M132 218L164 150C170 170 164 196 140 228Z" fill={WHITE} />
      {/* The heart pierced with love */}
      <Glass d="M100 322C112 306 130 318 124 334C120 346 108 354 100 362C92 354 80 346 76 334C70 318 88 306 100 322Z" fill="#b6382e" />
      <path d="M100 298L100 324" stroke={GOLD} strokeWidth={4} />
    </>
  );
}

const SKIES: Record<string, { a: string; b: string; ground: string }> = {
  mary: { a: "#152e6e", b: "#21428f", ground: "#7f1d1a" },
  michael: { a: "#7f1d1a", b: "#a12a22", ground: "#1b2f5e" },
  joseph: { a: "#1c4a3e", b: "#27604f", ground: "#7f1d1a" },
  peter: { a: "#7f1d1a", b: "#a12a22", ground: "#152e6e" },
  dominic: { a: "#152e6e", b: "#21428f", ground: "#b98a2c" },
  francis: { a: "#1c4a3e", b: "#27604f", ground: "#b98a2c" },
  teresa: { a: "#7f1d1a", b: "#a12a22", ground: "#1c4a3e" },
};

const FIGURES: Record<string, () => ReactNode> = {
  mary: Mary,
  michael: Michael,
  joseph: Joseph,
  peter: Peter,
  dominic: Dominic,
  francis: Francis,
  teresa: Teresa,
};

export const SAINTS = [
  { id: "mary", latin: "Sancta Maria", english: "Holy Mary", about: "in a blue mantle, holding a rosary, crowned with stars" },
  { id: "michael", latin: "Sancte Michael", english: "Saint Michael", about: "winged, with a raised sword" },
  { id: "joseph", latin: "Sancte Ioseph", english: "Saint Joseph", about: "holding a lily staff" },
  { id: "peter", latin: "Sancte Petre", english: "Saint Peter", about: "with the keys and a book" },
  { id: "dominic", latin: "Sancte Dominice", english: "Saint Dominic", about: "in black and white, a star above him, holding a rosary" },
  { id: "francis", latin: "Sancte Francisce", english: "Saint Francis", about: "in a brown habit, arms open, a bird at his hand" },
  { id: "teresa", latin: "Sancta Teresia", english: "Saint Teresa of Ávila", about: "with an open book, a quill and a pierced heart" },
] as const;

const LANCET = "M6 534V150C6 90 44 34 100 6C156 34 194 90 194 150V534Z";

export function SaintWindow({ id, label }: { id: string; label: string }) {
  const Figure = FIGURES[id];
  const sky = SKIES[id];
  const clip = `lancet-${id}`;
  return (
    <svg role="img" aria-label={label} viewBox="0 0 200 540" className="land-window">
      <defs>
        <clipPath id={clip}>
          <path d={LANCET} />
        </clipPath>
      </defs>
      <Quarries a={sky.a} b={sky.b} id={clip} />
      <g clipPath={`url(#${clip})`}>
        <g className="pane">
          <Figure />
        </g>
        <path d="M0 470H200V540H0Z" fill={sky.ground} stroke={LEAD} strokeWidth={3} />
        <path d="M0 500H200M50 470V500M100 500V540M150 470V500" stroke={LEAD} strokeWidth={2.5} fill="none" />
      </g>
      <path d={LANCET} fill="none" stroke={LEAD} strokeWidth={7} />
      <path d={LANCET} fill="none" stroke={GOLD_DEEP} strokeWidth={1.5} />
    </svg>
  );
}
