import type { Bead, SequenceDefinition, SequenceStep } from "@/lib/sequence/types";
import { ROSARY_PRAYERS } from "./prayers";
import { MYSTERY_SETS, type MysterySetId } from "./mysteries";

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth"];
// Same shape as the landing page's Rosary walk: a teardrop loop hanging from the medal, with the
// first mystery's Our Father bead on the tail directly below the medal. Coordinates are the
// landing page's (300 × 480) scaled up so the tracker's bead radii read the same.
const SCALE = 1.4;
const WIDTH = 300 * SCALE;
const HEIGHT = 480 * SCALE;
const MEDAL = { x: 150, y: 288 };
const s = (n: number) => Math.round(n * SCALE * 100) / 100;

/**
 * 61 beads: crucifix, the tail (Our Father, 3 Hail Marys), the medal and 5 × (1 + 10). Decade 1's
 * large bead is the first one below the medal; the rest of the loop climbs and returns to the medal.
 * The crucifix and medal are anchors for the Creed and the Hail, Holy Queen.
 */
function buildBeads(): Bead[] {
  const samples: { x: number; y: number }[] = [];
  for (let i = 0; i <= 1200; i++) {
    const t = (i / 1200) * 2 * Math.PI;
    samples.push({
      x: MEDAL.x + 146 * Math.sin(t) * Math.pow(Math.sin(t / 2), 0.8),
      y: MEDAL.y - 129 * (1 - Math.cos(t)),
    });
  }
  const lengths = [0];
  samples.slice(1).forEach((p, i) => lengths.push(lengths[i] + Math.hypot(p.x - samples[i].x, p.y - samples[i].y)));

  // Longer runs of chain either side of each Our Father; decade 1's first bead is on the tail.
  const slots: { d: number; b: number; gap: number }[] = [];
  for (let d = 0; d < 5; d++) {
    for (let b = d === 0 ? 1 : 0; b <= 10; b++) slots.push({ d, b, gap: b === 0 ? 2.1 : b === 1 ? 1.9 : 1 });
  }
  const total = slots.reduce((sum, slot) => sum + slot.gap, 0) + 2.1;

  const beads: Bead[] = [
    { id: "crucifix", label: "Crucifix", x: s(150), y: s(428), kind: "anchor" },
    { id: "tail-0", label: "Our Father bead", x: s(150), y: s(380), kind: "large" },
    { id: "tail-1", label: "Hail Mary bead 1 of 3", x: s(150), y: s(358), kind: "small" },
    { id: "tail-2", label: "Hail Mary bead 2 of 3", x: s(150), y: s(347), kind: "small" },
    { id: "tail-3", label: "Hail Mary bead 3 of 3", x: s(150), y: s(336), kind: "small" },
    { id: "medal", label: "Centre medal", x: s(MEDAL.x), y: s(MEDAL.y), kind: "anchor" },
    { id: "d0-0", label: "Decade 1, Our Father bead", x: s(150), y: s(314), kind: "large" },
  ];
  let walked = 0;
  let cursor = 0;
  for (const { d, b, gap } of slots) {
    walked += gap;
    const target = (walked / total) * lengths[lengths.length - 1];
    while (lengths[cursor] < target) cursor++;
    const p = samples[cursor];
    beads.push({
      id: `d${d}-${b}`,
      label: b === 0 ? `Decade ${d + 1}, Our Father bead` : `Decade ${d + 1}, Hail Mary bead ${b} of 10`,
      x: s(p.x),
      y: s(p.y),
      kind: b === 0 ? "large" : "small",
    });
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
