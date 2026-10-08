import type { SequenceDefinition, SequenceStep } from "./types";

export type BeadState = "completed" | "current" | "upcoming";

export function clampIndex(sequence: SequenceDefinition, index: number) {
  return Math.min(Math.max(index, 0), sequence.steps.length - 1);
}

export function isLastStep(sequence: SequenceDefinition, index: number) {
  return index >= sequence.steps.length - 1;
}

/** Index of the first step that sits on the given bead, or -1. */
export function firstStepForBead(sequence: SequenceDefinition, beadId: string) {
  return sequence.steps.findIndex((s) => s.beadId === beadId);
}

/**
 * A bead is "completed" once every step on it is behind the current step,
 * "current" while the current step sits on it, otherwise "upcoming".
 */
export function beadStates(sequence: SequenceDefinition, index: number) {
  const current = sequence.steps[index]?.beadId;
  const lastStepOnBead = new Map<string, number>();
  sequence.steps.forEach((step, i) => lastStepOnBead.set(step.beadId, i));

  const states = new Map<string, BeadState>();
  for (const bead of sequence.beads) {
    const last = lastStepOnBead.get(bead.id);
    if (bead.id === current) states.set(bead.id, "current");
    else if (last !== undefined && last < index) states.set(bead.id, "completed");
    else states.set(bead.id, "upcoming");
  }
  return states;
}

/** Steps in the same section as the given index, for "3 of 10" style captions. */
export function sectionProgress(sequence: SequenceDefinition, index: number) {
  const step: SequenceStep | undefined = sequence.steps[index];
  if (!step) return { position: 0, total: 0 };
  const inSection = sequence.steps.filter((s) => s.section === step.section);
  return { position: inSection.indexOf(step) + 1, total: inSection.length };
}
