import type { Bead, SequenceDefinition, SequenceStep } from "@/lib/sequence/types";
import { SEVEN_SORROWS_PRAYERS, SORROWS } from "./prayers";

export const SEVEN_SORROWS_ID = "seven-sorrows";

const WIDTH = 320;
const HEIGHT = 470;

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh"];
const HAIL_MARYS_PER_SORROW = 7;

/** Same 320×470 frame as the Rosary. One row per sorrow: a large bead for the sorrow, then seven small beads for its Hail Marys. */
function buildBeads(): Bead[] {
  const beads: Bead[] = [{ id: "opening", label: "Opening prayer", x: 160, y: 28, kind: "anchor" }];
  SORROWS.forEach((sorrow, s) => {
    const y = 85 + s * 54;
    beads.push({ id: `s${s}-0`, label: `${ORDINALS[s]} sorrow, ${sorrow.name}`, x: 28, y, kind: "large" });
    for (let h = 1; h <= HAIL_MARYS_PER_SORROW; h++) {
      beads.push({
        id: `s${s}-${h}`,
        label: `${ORDINALS[s]} sorrow, Hail Mary ${h} of ${HAIL_MARYS_PER_SORROW}`,
        x: 40 + h * 35,
        y,
        kind: "small",
      });
    }
  });
  beads.push({ id: "closing", label: "Closing prayers", x: 160, y: 448, kind: "anchor" });
  return beads;
}

export function buildSevenSorrows(): SequenceDefinition {
  const steps: SequenceStep[] = [];
  const add = (step: Omit<SequenceStep, "id">) => steps.push({ ...step, id: `s${steps.length}` });

  add({ title: "Sign of the Cross", section: "Opening", prayerId: "sign-of-the-cross", beadId: "opening" });
  add({ title: "Opening Prayer", section: "Opening", prayerId: "sorrows-opening", beadId: "opening" });

  SORROWS.forEach((sorrow, s) => {
    const section = `${ORDINALS[s]} sorrow`;
    const reflection = {
      heading: sorrow.name,
      reference: sorrow.reference,
      meditation: sorrow.meditation,
      fruit: sorrow.fruit,
    };
    add({ title: sorrow.name, subtitle: `The ${ORDINALS[s]} Sorrow`, section, beadId: `s${s}-0`, reflection });
    for (let h = 1; h <= HAIL_MARYS_PER_SORROW; h++) {
      add({
        title: "Hail Mary",
        subtitle: `${h} of ${HAIL_MARYS_PER_SORROW}`,
        section,
        prayerId: "hail-mary",
        beadId: `s${s}-${h}`,
        reflection,
      });
    }
  });

  for (let t = 1; t <= 3; t++) {
    add({ title: "Hail Mary", subtitle: `${t} of 3`, section: "Closing", prayerId: "sorrows-tears", beadId: "closing" });
  }
  add({ title: "Pray for Us", section: "Closing", prayerId: "sorrows-intercession", beadId: "closing" });
  add({ title: "Closing Prayer", section: "Closing", prayerId: "sorrows-closing", beadId: "closing" });
  add({ title: "Sign of the Cross", section: "Closing", prayerId: "sign-of-the-cross", beadId: "closing" });

  return {
    id: SEVEN_SORROWS_ID,
    title: "Chaplet of the Seven Sorrows",
    prayers: SEVEN_SORROWS_PRAYERS,
    beads: buildBeads(),
    viewBox: { width: WIDTH, height: HEIGHT },
    steps,
  };
}
