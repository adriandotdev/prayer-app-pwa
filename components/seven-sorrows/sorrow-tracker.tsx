"use client";

import { SorrowArt, sorrowPosition } from "@/components/seven-sorrows/sorrow-art";
import type { SequenceDefinition } from "@/lib/sequence/types";
import { cn } from "@/lib/utils";

type Props = {
  sequence: SequenceDefinition;
  index: number;
  onSelectBead: (beadId: string) => void;
  className?: string;
};

const SORROWS = 7;
const HAIL_MARYS = 7;

/** Replaces the bead tracker for the Seven Sorrows: artwork for the current sorrow, seven dots for its Hail Marys, and a path of seven sorrows. */
export function SorrowTracker({ sequence, index, onSelectBead, className }: Props) {
  const step = sequence.steps[index];
  const position = sorrowPosition(step.beadId);
  const current = position?.sorrow ?? null;
  // Opening is before every sorrow; closing is after all of them.
  const finished = current === null && step.section === "Closing";
  const caption = current === null ? step.section : `Sorrow ${current} of ${SORROWS}`;

  const sorrowState = (n: number) =>
    finished || (current !== null && n < current) ? "completed" : n === current ? "current" : "upcoming";

  return (
    <div
      role="group"
      aria-label={`Seven Sorrows tracker. ${caption}, step ${index + 1} of ${sequence.steps.length}.`}
      className={cn("flex flex-col items-center gap-3 rounded-3xl bg-card p-4 md:gap-5 md:p-6", className)}
    >
      <SorrowArt
        key={current ?? "heart"}
        sorrow={current}
        className="ora-enter size-24 text-primary sm:size-32 md:size-56 dark:text-gold"
      />
      <p className="hidden text-sm font-medium text-gold-foreground md:block dark:text-gold">{caption}</p>

      {/* Hail Marys said in this sorrow. */}
      {position && (
        <span aria-hidden className="hidden items-center gap-1.5 md:flex">
          {Array.from({ length: HAIL_MARYS }, (_, i) => (
            <span
              key={i}
              className={cn(
                "size-2 rounded-full transition-colors duration-300",
                i < position.hailMary ? "bg-gold" : "bg-muted-foreground/30",
              )}
            />
          ))}
        </span>
      )}

      {/* Phone: a quiet strip of seven; swiping moves between steps. */}
      <span aria-hidden className="flex items-center gap-1 md:hidden">
        {Array.from({ length: SORROWS }, (_, i) => {
          const state = sorrowState(i + 1);
          return (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                state === "current" ? "w-4 bg-gold" : "w-1.5",
                state === "completed" && "bg-primary dark:bg-primary/55",
                state === "upcoming" && "bg-muted-foreground/30",
              )}
            />
          );
        })}
      </span>

      {/* Desktop: tap a number to jump to that sorrow. */}
      <ol className="hidden grid-cols-7 gap-1.5 md:grid">
        {Array.from({ length: SORROWS }, (_, i) => {
          const state = sorrowState(i + 1);
          const bead = sequence.beads.find((b) => b.id === `s${i}-0`);
          return (
            <li key={i}>
              <button
                type="button"
                aria-label={`${bead?.label ?? `Sorrow ${i + 1}`}, ${state}`}
                aria-current={state === "current" ? "step" : undefined}
                onClick={() => onSelectBead(`s${i}-0`)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  state === "completed" && "bg-primary text-primary-foreground dark:bg-primary/55",
                  state === "current" && "bg-gold text-gold-foreground",
                  state === "upcoming" && "bg-secondary text-muted-foreground",
                )}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
