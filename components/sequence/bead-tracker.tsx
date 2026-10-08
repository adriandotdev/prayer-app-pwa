"use client";

import { beadStates } from "@/lib/sequence/engine";
import type { Bead, SequenceDefinition } from "@/lib/sequence/types";
import { cn } from "@/lib/utils";

const RADIUS: Record<Bead["kind"], number> = { small: 5.5, large: 8.5, anchor: 11 };

type Props = {
  sequence: SequenceDefinition;
  index: number;
  onSelectBead: (beadId: string) => void;
  className?: string;
};

export function BeadTracker({ sequence, index, onSelectBead, className }: Props) {
  const states = beadStates(sequence, index);
  const step = sequence.steps[index];
  const { width, height } = sequence.viewBox;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="group"
      aria-label={`Bead tracker. Currently on ${step.title}, step ${index + 1} of ${sequence.steps.length}.`}
      className={cn("mx-auto h-auto w-full select-none touch-manipulation", className)}
    >
      {sequence.beads.map((bead) => {
        const state = states.get(bead.id) ?? "upcoming";
        const r = RADIUS[bead.kind];
        const label = `${bead.label}, ${state === "current" ? "current" : state}`;
        return (
          <g
            key={bead.id}
            role="button"
            tabIndex={0}
            aria-label={label}
            aria-current={state === "current" ? "step" : undefined}
            onClick={() => onSelectBead(bead.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectBead(bead.id);
              }
            }}
            className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-ring"
          >
            {/* larger invisible hit area for touch */}
            <circle cx={bead.x} cy={bead.y} r={Math.max(r + 4, 11)} fill="transparent" strokeWidth={2} className="stroke-transparent" />
            {state === "current" && (
              <circle cx={bead.x} cy={bead.y} r={r + 5} className="ora-halo fill-gold/25 stroke-gold" strokeWidth={1.5} />
            )}
            {bead.kind === "anchor" ? (
              <Anchor bead={bead} state={state} />
            ) : (
              <circle
                cx={bead.x}
                cy={bead.y}
                r={r}
                strokeWidth={1.25}
                className={cn(
                  "transition-colors duration-300",
                  state === "completed" && "fill-primary stroke-primary",
                  state === "current" && "fill-gold stroke-gold",
                  state === "upcoming" && "fill-background stroke-muted-foreground/60",
                )}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Anchor({ bead, state }: { bead: Bead; state: "completed" | "current" | "upcoming" }) {
  const cls = cn(
    "transition-colors duration-300",
    state === "completed" && "fill-primary stroke-primary",
    state === "current" && "fill-gold stroke-gold",
    state === "upcoming" && "fill-background stroke-muted-foreground/60",
  );
  if (bead.id === "crucifix") {
    // A small cross: vertical and horizontal bars.
    return (
      <g className={cls} strokeWidth={1.25}>
        <rect x={bead.x - 3} y={bead.y - 13} width={6} height={26} rx={1.5} />
        <rect x={bead.x - 9} y={bead.y - 7} width={18} height={6} rx={1.5} />
      </g>
    );
  }
  return <circle cx={bead.x} cy={bead.y} r={11} strokeWidth={1.25} className={cls} />;
}
