import type { MysterySetId } from "./mysteries";

/** Day of week (0 = Sunday) → traditional mystery set. */
const SCHEDULE: Record<number, MysterySetId> = {
  0: "glorious",
  1: "joyful",
  2: "sorrowful",
  3: "glorious",
  4: "luminous",
  5: "sorrowful",
  6: "joyful",
};

export function mysterySetForDay(day: number): MysterySetId {
  return SCHEDULE[day] ?? "joyful";
}
