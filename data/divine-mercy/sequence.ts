import type { Bead, SequenceDefinition, SequenceStep } from "@/lib/sequence/types";
import { DIVINE_MERCY_PRAYERS } from "./prayers";

export const DIVINE_MERCY_ID = "divine-mercy";

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth"];
const WIDTH = 320;
const HEIGHT = 470;
const CENTER = { x: 160, y: 150 };
const RADIUS = 120;

/**
 * Same Rosary beads, used differently: crucifix, the tail (Our Father, Hail Mary, Creed), the
 * centre medal, then five decades of one large bead and ten small. 60 beads in all.
 */
function buildBeads(): Bead[] {
  const beads: Bead[] = [
    { id: "crucifix", label: "Crucifix", x: CENTER.x, y: 430, kind: "anchor" },
    { id: "tail-0", label: "Our Father bead", x: CENTER.x, y: 392, kind: "large" },
    { id: "tail-1", label: "Hail Mary bead", x: CENTER.x, y: 356, kind: "small" },
    { id: "tail-2", label: "Creed bead", x: CENTER.x, y: 320, kind: "small" },
    { id: "medal", label: "Centre medal", x: CENTER.x, y: CENTER.y + RADIUS, kind: "anchor" },
  ];
  const slots = 55 + 1; // loop beads + the medal's slot
  for (let d = 0; d < 5; d++) {
    for (let b = 0; b < 11; b++) {
      const slot = d * 11 + b + 1;
      const angle = Math.PI / 2 - (slot * 2 * Math.PI) / slots;
      beads.push({
        id: `d${d}-${b}`,
        label: b === 0 ? `Decade ${d + 1}, Eternal Father bead` : `Decade ${d + 1}, bead ${b} of 10`,
        x: CENTER.x + RADIUS * Math.cos(angle),
        y: CENTER.y + RADIUS * Math.sin(angle),
        kind: b === 0 ? "large" : "small",
      });
    }
  }
  return beads;
}

export function buildDivineMercy(): SequenceDefinition {
  const steps: SequenceStep[] = [];
  const add = (step: Omit<SequenceStep, "id">) =>
    steps.push({ ...step, id: `s${steps.length}` });

  add({ title: "Sign of the Cross", section: "Opening", prayerId: "sign-of-the-cross", beadId: "crucifix" });
  add({ title: "Our Father", section: "Opening", prayerId: "our-father", beadId: "tail-0" });
  add({ title: "Hail Mary", section: "Opening", prayerId: "hail-mary", beadId: "tail-1" });
  add({ title: "The Apostles’ Creed", section: "Opening", prayerId: "creed", beadId: "tail-2" });
  add({ title: "Opening Prayer", subtitle: "Optional", section: "Opening", prayerId: "opening-prayer", beadId: "medal" });
  add({ title: "O Blood and Water", subtitle: "Say three times", section: "Opening", prayerId: "blood-and-water", beadId: "medal" });

  for (let d = 0; d < 5; d++) {
    const section = `${ORDINALS[d]} decade`;
    add({ title: "Eternal Father", subtitle: "Large bead", section, prayerId: "eternal-father", beadId: `d${d}-0` });
    for (let b = 1; b <= 10; b++) {
      add({
        title: "For the Sake of His Sorrowful Passion",
        subtitle: `${b} of 10`,
        section,
        prayerId: "sorrowful-passion",
        beadId: `d${d}-${b}`,
      });
    }
  }

  for (let i = 1; i <= 3; i++) {
    add({ title: "Holy God", subtitle: `${i} of 3`, section: "Closing", prayerId: "holy-god", beadId: "medal" });
  }
  add({ title: "Closing Prayer", subtitle: "Optional", section: "Closing", prayerId: "closing-prayer", beadId: "medal" });
  add({ title: "Sign of the Cross", section: "Closing", prayerId: "sign-of-the-cross", beadId: "crucifix" });

  return {
    id: DIVINE_MERCY_ID,
    title: "Divine Mercy Chaplet",
    prayers: DIVINE_MERCY_PRAYERS,
    beads: buildBeads(),
    viewBox: { width: WIDTH, height: HEIGHT },
    steps,
  };
}
