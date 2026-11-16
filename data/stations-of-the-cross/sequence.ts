import type { Bead, SequenceDefinition, SequenceStep } from "@/lib/sequence/types";
import { STATIONS, STATIONS_PRAYERS } from "./prayers";

export const STATIONS_OF_THE_CROSS_ID = "stations-of-the-cross";

const WIDTH = 320;
const HEIGHT = 470;

/** One bead per station, an anchor at each end. The Stations tracker draws artwork instead of beads, so x/y only satisfy the shared Bead type; the beads carry ids, labels and progress state. */
function buildBeads(): Bead[] {
  const beads: Bead[] = [{ id: "opening", label: "Opening prayer", x: 160, y: 28, kind: "anchor" }];
  STATIONS.forEach((station, i) => {
    beads.push({
      id: `station-${i + 1}`,
      label: `Station ${i + 1}, ${station.name}`,
      x: i % 2 === 0 ? 100 : 220,
      y: 82 + Math.floor(i / 2) * 52,
      kind: "large",
    });
  });
  beads.push({ id: "closing", label: "Closing prayer", x: 160, y: 448, kind: "anchor" });
  return beads;
}

export function buildStationsOfTheCross(): SequenceDefinition {
  const steps: SequenceStep[] = [];
  const add = (step: Omit<SequenceStep, "id">) => steps.push({ ...step, id: `s${steps.length}` });

  add({ title: "Sign of the Cross", section: "Opening", prayerId: "sign-of-the-cross", beadId: "opening" });
  add({ title: "Opening Prayer", section: "Opening", prayerId: "stations-opening", beadId: "opening" });

  STATIONS.forEach((station, i) => {
    const n = i + 1;
    const section = `Station ${n} of ${STATIONS.length}`;
    const beadId = `station-${n}`;
    const reflection = {
      heading: station.name,
      reference: station.reference === "Tradition" ? undefined : station.reference,
      meditation: station.scene,
      fruit: station.fruit,
    };
    add({ title: "We Adore You", subtitle: station.name, section, prayerId: "stations-versicle", beadId, reflection });
    add({ title: station.name, section, prayerId: `station-${n}`, beadId, reflection });
    add({ title: "Our Father", section, prayerId: "our-father", beadId, reflection });
    add({ title: "Hail Mary", section, prayerId: "hail-mary", beadId, reflection });
    add({ title: "Glory Be", section, prayerId: "glory-be", beadId, reflection });
  });

  add({ title: "Closing Prayer", section: "Closing", prayerId: "stations-closing", beadId: "closing" });
  add({ title: "Sign of the Cross", section: "Closing", prayerId: "sign-of-the-cross", beadId: "closing" });

  return {
    id: STATIONS_OF_THE_CROSS_ID,
    title: "The Stations of the Cross",
    prayers: STATIONS_PRAYERS,
    beads: buildBeads(),
    viewBox: { width: WIDTH, height: HEIGHT },
    steps,
  };
}
