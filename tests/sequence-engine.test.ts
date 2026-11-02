import { describe, expect, it } from "vitest";
import { buildRosary } from "@/data/rosary/sequence";
import { beadStates, clampIndex, firstStepForBead, isLastStep, sectionProgress } from "@/lib/sequence/engine";

const rosary = buildRosary("joyful");

describe("rosary definition", () => {
  it("has 61 beads and 80 steps", () => {
    expect(rosary.beads).toHaveLength(61);
    expect(rosary.steps).toHaveLength(80);
  });

  it("only puts steps on beads that exist and prayers that exist", () => {
    const beads = new Set(rosary.beads.map((b) => b.id));
    for (const step of rosary.steps) {
      expect(beads.has(step.beadId)).toBe(true);
      if (step.prayerId) expect(rosary.prayers[step.prayerId]).toBeDefined();
    }
  });
});

describe("engine", () => {
  it("clamps the index into range", () => {
    expect(clampIndex(rosary, -3)).toBe(0);
    expect(clampIndex(rosary, 999)).toBe(rosary.steps.length - 1);
    expect(clampIndex(rosary, 5)).toBe(5);
  });

  it("knows the last step", () => {
    expect(isLastStep(rosary, rosary.steps.length - 2)).toBe(false);
    expect(isLastStep(rosary, rosary.steps.length - 1)).toBe(true);
  });

  it("finds the first step on a bead", () => {
    expect(firstStepForBead(rosary, "crucifix")).toBe(0);
    expect(firstStepForBead(rosary, "nope")).toBe(-1);
  });

  it("marks beads completed, current and upcoming", () => {
    // Step 3 is the first tail Hail Mary; the Our Father bead (step 2) is behind us.
    const states = beadStates(rosary, 3);
    expect(states.get("tail-0")).toBe("completed");
    expect(states.get("tail-1")).toBe("current");
    expect(states.get("tail-2")).toBe("upcoming");
  });

  it("does not complete a bead that still has steps ahead", () => {
    // The closing Sign of the Cross returns to the crucifix, so it is not done after the Creed.
    const states = beadStates(rosary, 2);
    expect(states.get("crucifix")).toBe("upcoming");
    expect(beadStates(rosary, 1).get("crucifix")).toBe("current");
  });

  it("counts position within a section", () => {
    expect(sectionProgress(rosary, 0)).toEqual({ position: 1, total: rosary.steps.filter((s) => s.section === "Opening").length });
    expect(sectionProgress(rosary, 999)).toEqual({ position: 0, total: 0 });
  });
});
