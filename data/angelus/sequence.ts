import type { Bead, SequenceDefinition, SequenceStep } from "@/lib/sequence/types";
import { ANGELUS_PRAYERS } from "./prayers";

export const ANGELUS_ID = "angelus";

const WIDTH = 320;
const HEIGHT = 470;

/** Same 320×470 frame as the Rosary: the tracker is sized by height, so a squatter box overflows its column onto the Leave button.
 * The Angelus has no beads of its own; four stand in for the three verses and the closing prayer. */
const BEADS: Bead[] = [
  { id: "verse-1", label: "First verse", x: 160, y: 380, kind: "small" },
  { id: "verse-2", label: "Second verse", x: 160, y: 290, kind: "small" },
  { id: "verse-3", label: "Third verse", x: 160, y: 200, kind: "small" },
  { id: "closing", label: "Closing prayer", x: 160, y: 100, kind: "large" },
];

export function buildAngelus(): SequenceDefinition {
  const steps: SequenceStep[] = [];
  const add = (step: Omit<SequenceStep, "id">) => steps.push({ ...step, id: `s${steps.length}` });

  const verses = ["angelus-annunciation", "angelus-fiat", "angelus-incarnation"];
  verses.forEach((prayerId, i) => {
    const section = `Verse ${i + 1} of 3`;
    const beadId = `verse-${i + 1}`;
    add({ title: ANGELUS_PRAYERS[prayerId].name, section, prayerId, beadId });
    add({ title: "Hail Mary", section, prayerId: "hail-mary", beadId });
  });
  add({ title: "Pray for Us", section: "Closing", prayerId: "angelus-intercession", beadId: "closing" });
  add({ title: "Let Us Pray", section: "Closing", prayerId: "angelus-closing", beadId: "closing" });

  return {
    id: ANGELUS_ID,
    title: "The Angelus",
    prayers: ANGELUS_PRAYERS,
    beads: BEADS,
    viewBox: { width: WIDTH, height: HEIGHT },
    steps,
  };
}
