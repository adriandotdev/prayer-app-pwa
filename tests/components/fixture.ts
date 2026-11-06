import type { SequenceDefinition } from "@/lib/sequence/types";

/** Tiny 3-bead, 4-step sequence so component tests don't depend on the 80-step Rosary. */
export const fixtureSequence: SequenceDefinition = {
  id: "test:tiny",
  title: "Tiny",
  prayers: {
    ourFather: { id: "ourFather", name: "Our Father", text: ["Our Father line"], learn: "Learn about the Our Father." },
    hailMary: { id: "hailMary", name: "Hail Mary", text: ["Hail Mary line"] },
  },
  viewBox: { width: 100, height: 100 },
  beads: [
    { id: "crucifix", label: "Crucifix", x: 50, y: 10, kind: "anchor" },
    { id: "b1", label: "Large bead", x: 50, y: 40, kind: "large" },
    { id: "b2", label: "Small bead", x: 50, y: 70, kind: "small" },
  ],
  steps: [
    { id: "s1", title: "Sign of the Cross", section: "Opening", beadId: "crucifix" },
    { id: "s2", title: "Our Father", section: "Opening", beadId: "b1", prayerId: "ourFather" },
    { id: "s3", title: "Hail Mary", subtitle: "1 of 2", section: "Decade", beadId: "b2", prayerId: "hailMary" },
    { id: "s4", title: "Hail Mary", subtitle: "2 of 2", section: "Decade", beadId: "b2", prayerId: "hailMary" },
  ],
};
