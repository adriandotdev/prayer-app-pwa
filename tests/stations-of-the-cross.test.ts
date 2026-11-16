import { describe, expect, it } from "vitest";
import { buildStationsOfTheCross } from "@/data/stations-of-the-cross/sequence";

const stations = buildStationsOfTheCross();

describe("stations of the cross definition", () => {
  it("has 16 beads and 2 + 14×5 + 2 steps", () => {
    expect(stations.beads).toHaveLength(16);
    expect(stations.steps).toHaveLength(2 + 14 * 5 + 2);
  });

  it("only puts steps on beads and prayers that exist", () => {
    const beads = new Set(stations.beads.map((b) => b.id));
    expect(beads.size).toBe(stations.beads.length);
    for (const step of stations.steps) {
      expect(beads.has(step.beadId)).toBe(true);
      if (step.prayerId) expect(stations.prayers[step.prayerId]).toBeDefined();
    }
  });

  it("gives each of the 14 stations a versicle, its own prayer and the three common prayers", () => {
    for (let n = 1; n <= 14; n++) {
      const ids = stations.steps.filter((s) => s.beadId === `station-${n}`).map((s) => s.prayerId);
      expect(ids).toEqual(["stations-versicle", `station-${n}`, "our-father", "hail-mary", "glory-be"]);
    }
  });

  it("keeps every bead inside the frame", () => {
    const { width, height } = stations.viewBox;
    for (const b of stations.beads) {
      expect(b.x).toBeGreaterThan(20);
      expect(b.x).toBeLessThan(width - 20);
      expect(b.y).toBeGreaterThan(20);
      expect(b.y).toBeLessThan(height - 10);
    }
  });
});
