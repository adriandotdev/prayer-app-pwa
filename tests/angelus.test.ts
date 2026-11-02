import { describe, expect, it } from "vitest";
import { buildAngelus } from "@/data/angelus/sequence";

const angelus = buildAngelus();

describe("angelus definition", () => {
  it("has 4 beads and 8 steps", () => {
    expect(angelus.beads).toHaveLength(4);
    expect(angelus.steps).toHaveLength(8);
  });

  it("only puts steps on beads and prayers that exist", () => {
    const beads = new Set(angelus.beads.map((b) => b.id));
    for (const step of angelus.steps) {
      expect(beads.has(step.beadId)).toBe(true);
      if (step.prayerId) expect(angelus.prayers[step.prayerId]).toBeDefined();
    }
  });

  it("says three Hail Marys, one after each verse", () => {
    const ids = angelus.steps.map((s) => s.prayerId);
    expect(ids.filter((id) => id === "hail-mary")).toHaveLength(3);
    expect(ids.slice(0, 6)).toEqual([
      "angelus-annunciation", "hail-mary", "angelus-fiat", "hail-mary", "angelus-incarnation", "hail-mary",
    ]);
  });
});
