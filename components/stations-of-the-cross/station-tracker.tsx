"use client";

import { StationArt, stationNumber } from "@/components/stations-of-the-cross/station-art";
import { beadStates } from "@/lib/sequence/engine";
import type { SequenceDefinition } from "@/lib/sequence/types";
import { cn } from "@/lib/utils";

type Props = {
  sequence: SequenceDefinition;
  index: number;
  onSelectBead: (beadId: string) => void;
  className?: string;
};

const STATE_CLASS = {
  completed: "bg-primary text-primary-foreground dark:bg-primary/55",
  current: "bg-gold text-gold-foreground",
  upcoming: "bg-secondary text-muted-foreground",
} as const;

/** Replaces the bead tracker for the Stations: artwork for the current station and a numbered path of fourteen. */
export function StationTracker({ sequence, index, onSelectBead, className }: Props) {
  const states = beadStates(sequence, index);
  const step = sequence.steps[index];
  const current = stationNumber(step.beadId);
  const stations = sequence.beads.filter((b) => stationNumber(b.id) !== null);
  const total = stations.length;
  const caption = current === null ? step.section : `Station ${current} of ${total}`;

  return (
    <div
      role="group"
      aria-label={`Stations tracker. ${caption}, step ${index + 1} of ${sequence.steps.length}.`}
      className={cn("flex flex-col items-center gap-3 rounded-3xl bg-card p-4 md:gap-5 md:p-6", className)}
    >
      {/* key re-runs the entrance animation when the station changes */}
      <StationArt
        key={current ?? "cross"}
        station={current}
        className="ora-enter size-24 text-primary sm:size-32 md:size-56 dark:text-gold"
      />
      <p className="hidden text-sm font-medium text-gold-foreground md:block dark:text-gold">{caption}</p>

      {/* Phone: a quiet progress strip; swiping moves between steps. */}
      <span aria-hidden className="flex items-center gap-1 md:hidden">
        {stations.map((bead) => (
          <span
            key={bead.id}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              states.get(bead.id) === "current" ? "w-4 bg-gold" : "w-1.5",
              states.get(bead.id) === "completed" && "bg-primary dark:bg-primary/55",
              states.get(bead.id) === "upcoming" && "bg-muted-foreground/30",
            )}
          />
        ))}
      </span>

      {/* Desktop: tap a number to jump to that station. */}
      <ol className="hidden grid-cols-7 gap-1.5 md:grid">
        {stations.map((bead) => {
          const state = states.get(bead.id) ?? "upcoming";
          const n = stationNumber(bead.id);
          return (
            <li key={bead.id}>
              <button
                type="button"
                aria-label={`${bead.label}, ${state}`}
                aria-current={state === "current" ? "step" : undefined}
                onClick={() => onSelectBead(bead.id)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  STATE_CLASS[state],
                )}
              >
                {n}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
