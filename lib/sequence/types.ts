/**
 * Generic "sequence of steps" model. A devotion (the Rosary, a chaplet, a
 * novena) is just a SequenceDefinition: ordered steps, the beads they sit on,
 * and the prayer texts they reference. Adding a chaplet needs data only.
 */

export type Prayer = {
  id: string;
  name: string;
  /** Lines of the prayer, rendered one paragraph each. */
  text: string[];
  /** Short explanation shown in Learn mode. */
  learn?: string;
};

export type Reflection = {
  heading: string;
  reference?: string;
  meditation?: string;
  fruit?: string;
};

export type Bead = {
  id: string;
  /** Accessible name, e.g. "Decade 2, Hail Mary bead 4 of 10". */
  label: string;
  x: number;
  y: number;
  /** Visual weight: "large" beads mark Our Fathers, "anchor" the crucifix/medal. */
  kind: "small" | "large" | "anchor";
};

export type SequenceStep = {
  id: string;
  /** Shown as the step title, e.g. "Hail Mary". */
  title: string;
  /** e.g. "3 of 10" or "The First Joyful Mystery". */
  subtitle?: string;
  /** Group label used for the progress caption, e.g. "First decade". */
  section: string;
  prayerId?: string;
  beadId: string;
  reflection?: Reflection;
};

export type SequenceDefinition = {
  /** Unique per variant, e.g. "rosary:joyful". Used as the storage key. */
  id: string;
  title: string;
  description?: string;
  prayers: Record<string, Prayer>;
  beads: Bead[];
  viewBox: { width: number; height: number };
  steps: SequenceStep[];
};
