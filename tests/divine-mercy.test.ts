import { describe, expect, it } from "vitest";
import { buildDivineMercy } from "@/data/divine-mercy/sequence";

const chaplet = buildDivineMercy();

describe("divine mercy definition", () => {
  it("has 60 beads and 66 steps", () => {
    expect(chaplet.beads).toHaveLength(60);
    expect(chaplet.steps).toHaveLength(66);
  });

  it("only puts steps on beads and prayers that exist", () => {
    const beads = new Set(chaplet.beads.map((b) => b.id));
    for (const step of chaplet.steps) {
      expect(beads.has(step.beadId)).toBe(true);
      if (step.prayerId) expect(chaplet.prayers[step.prayerId]).toBeDefined();
    }
  });

  it("says the Eternal Father five times and the decade prayer fifty times", () => {
    const count = (id: string) => chaplet.steps.filter((s) => s.prayerId === id).length;
    expect(count("eternal-father")).toBe(5);
    expect(count("sorrowful-passion")).toBe(50);
    expect(count("holy-god")).toBe(3);
  });
});
