import type { Bead, SequenceDefinition, SequenceStep } from "@/lib/sequence/types";
import { ROSARY_PRAYERS } from "./prayers";
import { MYSTERY_SETS, type MysterySetId } from "./mysteries";

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth"];
const WIDTH = 320;
const HEIGHT = 470;
const CENTER = { x: 160, y: 150 };
const RADIUS = 120;

/**
 * Layout: crucifix at the bottom, the tail rising to the medal, then the
 * loop of five decades. 59 beads in all: 1 + 3 on the tail and 5 × (1 + 10)
 * on the loop. The crucifix and medal are anchors for the Creed and the
 * Hail, Holy Queen.
 */
function buildBeads(): Bead[] {
  const medal = { x: CENTER.x, y: CENTER.y + RADIUS };
  const beads: Bead[] = [
    { id: "crucifix", x: CENTER.x, y: 430, kind: "anchor" },
    { id: "tail-0", x: CENTER.x, y: 392, kind: "large" },
    { id: "tail-1", x: CENTER.x, y: 360, kind: "small" },
    { id: "tail-2", x: CENTER.x, y: 334, kind: "small" },
    { id: "tail-3", x: CENTER.x, y: 308, kind: "small" },
    { id: "medal", ...medal, kind: "anchor" },
  ];
  const slots = 55 + 1; // loop beads + the medal's slot
  for (let d = 0; d < 5; d++) {
    for (let b = 0; b < 11; b++) {
      const slot = d * 11 + b + 1;
      const angle = Math.PI / 2 - (slot * 2 * Math.PI) / slots;
      beads.push({
        id: `d${d}-${b}`,
        x: CENTER.x + RADIUS * Math.cos(angle),
        y: CENTER.y + RADIUS * Math.sin(angle),
        kind: b === 0 ? "large" : "small",
      });
    }
  }
  return beads;
}

export function buildRosary(setId: MysterySetId): SequenceDefinition {
  const set = MYSTERY_SETS[setId];
  const steps: SequenceStep[] = [];
  const add = (step: Omit<SequenceStep, "id">) =>
    steps.push({ ...step, id: `s${steps.length}` });

  add({ title: "Sign of the Cross", section: "Opening", prayerId: "sign-of-the-cross", beadId: "crucifix" });
  add({ title: "The Apostles’ Creed", section: "Opening", prayerId: "creed", beadId: "crucifix" });
  add({ title: "Our Father", section: "Opening", prayerId: "our-father", beadId: "tail-0" });
  for (let i = 1; i <= 3; i++) {
    add({
      title: "Hail Mary",
      subtitle: `${i} of 3 · for faith, hope and charity`,
      section: "Opening",
      prayerId: "hail-mary",
      beadId: `tail-${i}`,
    });
  }
  add({ title: "Glory Be", section: "Opening", prayerId: "glory-be", beadId: "tail-3" });

  set.mysteries.forEach((mystery, d) => {
    const section = `${ORDINALS[d]} decade`;
    const reflection = {
      heading: mystery.name,
      reference: mystery.scripture,
      meditation: mystery.meditation,
      fruit: mystery.fruit,
    };
    add({
      title: mystery.name,
      subtitle: `The ${ORDINALS[d]} ${set.name.replace(" Mysteries", "")} Mystery`,
      section,
      beadId: `d${d}-0`,
      reflection,
    });
    add({ title: "Our Father", section, prayerId: "our-father", beadId: `d${d}-0`, reflection });
    for (let h = 1; h <= 10; h++) {
      add({
        title: "Hail Mary",
        subtitle: `${h} of 10`,
        section,
        prayerId: "hail-mary",
        beadId: `d${d}-${h}`,
        reflection,
      });
    }
    add({ title: "Glory Be", section, prayerId: "glory-be", beadId: `d${d}-10`, reflection });
    add({ title: "Fatima Prayer", section, prayerId: "fatima", beadId: `d${d}-10`, reflection });
  });

  add({ title: "Hail, Holy Queen", section: "Closing", prayerId: "hail-holy-queen", beadId: "medal" });
  add({ title: "Closing Prayer", section: "Closing", prayerId: "closing-prayer", beadId: "medal" });
  add({ title: "Sign of the Cross", section: "Closing", prayerId: "sign-of-the-cross", beadId: "crucifix" });

  return {
    id: `rosary:${setId}`,
    title: `The Rosary · ${set.name}`,
    prayers: ROSARY_PRAYERS,
    beads: buildBeads(),
    viewBox: { width: WIDTH, height: HEIGHT },
    steps,
  };
}
