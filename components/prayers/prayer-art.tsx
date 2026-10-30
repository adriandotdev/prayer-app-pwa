import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const GOLD = "var(--gold)";

// Flat line glyphs, 64x64, in the same language as the mystery art: ink follows
// currentColor, the single accent is gold.
const ART = {
  cross: (
    <>
      <path d="M32 8v44M20 22h24" />
      <path d="M14 58h36" stroke={GOLD} />
    </>
  ),
  hands: (
    <>
      <path d="M32 54V26M32 26c-4-6-10-8-14-6 0 14 4 24 14 34M32 26c4-6 10-8 14-6 0 14-4 24-14 34" />
      <path d="M32 6v6M24 9l3 4M40 9l-3 4" stroke={GOLD} />
    </>
  ),
  rose: (
    <>
      <path d="M32 58V38" />
      <path d="M32 46c-6 0-10-3-12-7 6-1 10 1 12 7ZM32 50c6 0 10-3 12-7-6-1-10 1-12 7Z" />
      <circle cx="32" cy="26" r="12" />
      <path d="M32 26c0-4 3-6 6-5M32 26c-3 3-7 2-8-1" stroke={GOLD} />
    </>
  ),
  rays: (
    <>
      <circle cx="32" cy="32" r="9" />
      <g stroke={GOLD}>
        <path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M49 15l-6 6M21 43l-6 6" />
      </g>
    </>
  ),
  star: (
    <>
      <path d="M32 6l5 14 15 1-12 9 4 15-12-9-12 9 4-15-12-9 15-1Z" />
      <circle cx="32" cy="30" r="2" stroke={GOLD} />
    </>
  ),
  crown: (
    <>
      <path d="M12 46V24l13 11 7-17 7 17 13-11v22ZM12 54h40" />
      <g stroke={GOLD}>
        <circle cx="12" cy="19" r="2.2" />
        <circle cx="32" cy="12" r="2.2" />
        <circle cx="52" cy="19" r="2.2" />
      </g>
    </>
  ),
  veil: (
    <>
      <path d="M32 8c-9 0-15 7-15 17 0 9-3 15-7 23h44c-4-8-7-14-7-23 0-10-6-17-15-17Z" />
      <circle cx="32" cy="24" r="4" stroke={GOLD} />
    </>
  ),
  bell: (
    <>
      <path d="M32 8v5M20 44c2-4 4-8 4-17a8 8 0 0 1 16 0c0 9 2 13 4 17ZM18 44h28" />
      <path d="M28 50a4 4 0 0 0 8 0" stroke={GOLD} />
    </>
  ),
  wings: (
    <>
      <path d="M32 54V22M32 22c-4-8-12-12-22-12 2 12 8 20 22 22M32 22c4-8 12-12 22-12-2 12-8 20-22 22" />
      <circle cx="32" cy="14" r="2.5" stroke={GOLD} />
    </>
  ),
  shield: (
    <>
      <path d="M32 6l20 7v16c0 13-8 22-20 29C20 51 12 42 12 29V13Z" />
      <path d="M32 18v24M24 26h16" stroke={GOLD} />
    </>
  ),
  heart: (
    <>
      <path d="M32 54C16 42 10 32 10 23a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 9-6 19-22 31Z" />
      <path d="M32 22v14M26 28h12" stroke={GOLD} />
    </>
  ),
  candle: (
    <>
      <path d="M24 28h16v26H24ZM32 28v-4" />
      <path d="M32 6c4 5 6 8 6 12a6 6 0 0 1-12 0c0-4 2-7 6-12Z" stroke={GOLD} />
      <path d="M18 54h28" />
    </>
  ),
  dove: (
    <>
      <path d="M10 34c8 0 14-4 18-12 3 4 8 6 14 5l6-5-2 9c-1 11-10 19-22 19-6 0-10-3-14-9ZM28 22c-1-6 2-11 8-14" />
      <circle cx="40" cy="26" r="1.6" stroke={GOLD} />
    </>
  ),
  book: (
    <>
      <path d="M32 18C24 12 16 12 9 16v34c7-4 15-4 23 2 8-6 16-6 23-2V16c-7-4-15-4-23 2ZM32 18v34" />
      <path d="M32 6v4M26 8l2 3M38 8l-2 3" stroke={GOLD} />
    </>
  ),
} satisfies Record<string, ReactNode>;

type ArtKey = keyof typeof ART;

// Starter prayers by title; anything else is matched by a keyword in the title.
const BY_TITLE: Record<string, ArtKey> = {
  "sign of the cross": "cross",
  "our father": "hands",
  "hail mary": "rose",
  "glory be": "rays",
  "fatima prayer": "star",
  "hail, holy queen": "crown",
  memorare: "veil",
  "the angelus": "bell",
  "prayer to saint michael": "shield",
  "act of contrition": "heart",
};

const KEYWORDS: [RegExp, ArtKey][] = [
  [/cross|passion|calvary/i, "cross"],
  [/michael|protect|shield|armor/i, "shield"],
  [/angel/i, "wings"],
  [/mary|marian|rosary|lady/i, "rose"],
  [/queen|king|christ the/i, "crown"],
  [/spirit|dove|peace/i, "dove"],
  [/contrition|sorry|forgive|mercy|heart/i, "heart"],
  [/glory|praise|thanks|morning|dawn/i, "rays"],
  [/evening|night|compline|rest|sleep/i, "star"],
  [/father|lord|our/i, "hands"],
];

// Personal prayers with no matching word still get a stable picture.
const FALLBACK: ArtKey[] = ["candle", "book", "dove", "star", "hands", "rays"];

export function prayerArtKey(id: string, title: string): ArtKey {
  const t = title.trim().toLowerCase();
  if (t in BY_TITLE) return BY_TITLE[t];
  const hit = KEYWORDS.find(([re]) => re.test(title));
  if (hit) return hit[1];
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FALLBACK[h % FALLBACK.length];
}

export function PrayerArt({ id, title, className }: { id: string; title: string; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-10 shrink-0", className)}
    >
      {ART[prayerArtKey(id, title)]}
    </svg>
  );
}
