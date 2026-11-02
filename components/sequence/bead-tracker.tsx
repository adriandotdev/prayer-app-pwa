"use client";

import { useRef } from "react";

import { beadStates } from "@/lib/sequence/engine";
import type { Bead, SequenceDefinition } from "@/lib/sequence/types";
import { cn } from "@/lib/utils";

const RADIUS: Record<Bead["kind"], number> = { small: 6.5, large: 9.5, anchor: 11 };

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
  const svgRef = useRef<SVGSVGElement>(null);
  // Roving tabindex: one tab stop (the current bead) instead of 61; arrow keys move between beads.
  const tabbableId = sequence.beads.find((b) => states.get(b.id) === "current")?.id ?? sequence.beads[0]?.id;

  const focusBead = (from: number, delta: number) => {
    const beads = svgRef.current?.querySelectorAll<SVGGElement>("[data-bead]");
    if (!beads?.length) return;
    const target = Math.min(Math.max(from + delta, 0), beads.length - 1);
    beads[target].focus();
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="group"
      aria-label={`Bead tracker. Currently on ${step.title}, step ${index + 1} of ${sequence.steps.length}.`}
      className={cn("mx-auto h-auto w-full select-none touch-manipulation", className)}
    >
      {sequence.beads.map((bead, beadIndex) => {
        const state = states.get(bead.id) ?? "upcoming";
        const r = RADIUS[bead.kind] + (state === "current" && bead.kind !== "anchor" ? 1.5 : 0);
        const label = `${bead.label}, ${state === "current" ? "current" : state}`;
        return (
          <g
            key={bead.id}
            role="button"
            data-bead=""
            tabIndex={bead.id === tabbableId ? 0 : -1}
            aria-label={label}
            aria-current={state === "current" ? "step" : undefined}
            onClick={() => onSelectBead(bead.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectBead(bead.id);
              } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                e.stopPropagation();
                focusBead(beadIndex, 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                e.stopPropagation();
                focusBead(beadIndex, -1);
              } else if (e.key === "Home") {
                e.preventDefault();
                focusBead(0, 0);
              } else if (e.key === "End") {
                e.preventDefault();
                focusBead(sequence.beads.length - 1, 0);
              }
            }}
            className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-ring"
          >
            {/* larger invisible hit area for touch */}
            <circle cx={bead.x} cy={bead.y} r={Math.max(r + 4, 11)} fill="transparent" strokeWidth={2} className="stroke-transparent" />
            {state === "current" && (
              <circle cx={bead.x} cy={bead.y} r={r + 6} className="ora-halo fill-gold/25 stroke-gold" strokeWidth={2} />
            )}
            {bead.kind === "anchor" ? (
              <Anchor bead={bead} state={state} />
            ) : (
              <circle
                cx={bead.x}
                cy={bead.y}
                r={r}
                strokeWidth={1.75}
                className={cn(
                  "transition-colors duration-300",
                  state === "completed" && "fill-primary stroke-primary dark:fill-primary/55 dark:stroke-primary/55",
                  state === "current" && "fill-gold stroke-gold",
                  state === "upcoming" && "fill-muted stroke-muted-foreground",
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
    state === "completed" && "fill-primary stroke-primary dark:fill-primary/55 dark:stroke-primary/55",
    state === "current" && "fill-gold stroke-gold",
    state === "upcoming" && "fill-muted stroke-muted-foreground",
  );
  if (bead.id === "crucifix") {
    // A small cross: vertical and horizontal bars.
    return (
      <g className={cls} strokeWidth={1.75}>
        <rect x={bead.x - 3} y={bead.y - 13} width={6} height={26} rx={1.5} />
        <rect x={bead.x - 9} y={bead.y - 7} width={18} height={6} rx={1.5} />
      </g>
    );
  }
  return <circle cx={bead.x} cy={bead.y} r={11} strokeWidth={1.75} className={cls} />;
}
