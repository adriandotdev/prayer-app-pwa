import { describe, expect, it } from "vitest";
import { buildSevenSorrows } from "@/data/seven-sorrows/sequence";

const chaplet = buildSevenSorrows();

describe("seven sorrows definition", () => {
  it("has 51 beads and 2 + 7×8 + 6 steps", () => {
    // opening + 7 × (1 sorrow + 7 Hail Marys) + closing
    expect(chaplet.beads).toHaveLength(1 + 7 * 8 + 1);
    expect(chaplet.steps).toHaveLength(2 + 7 * 8 + 6);
  });

  it("only puts steps on beads and prayers that exist", () => {
    const beads = new Set(chaplet.beads.map((b) => b.id));
    expect(beads.size).toBe(chaplet.beads.length);
    for (const step of chaplet.steps) {
      expect(beads.has(step.beadId)).toBe(true);
      if (step.prayerId) expect(chaplet.prayers[step.prayerId]).toBeDefined();
    }
  });

  it("says seven Hail Marys for each sorrow and three at the end", () => {
    const sorrows = chaplet.steps.filter((s) => s.section.endsWith("sorrow"));
    expect(sorrows.filter((s) => s.prayerId === "hail-mary")).toHaveLength(49);
    expect(chaplet.steps.filter((s) => s.prayerId === "sorrows-tears")).toHaveLength(3);
  });

  it("keeps every bead inside the frame", () => {
    const { width, height } = chaplet.viewBox;
    for (const b of chaplet.beads) {
      expect(b.x).toBeGreaterThan(20);
      expect(b.x).toBeLessThan(width - 20);
      expect(b.y).toBeGreaterThan(20);
      expect(b.y).toBeLessThan(height - 10);
    }
  });
});
