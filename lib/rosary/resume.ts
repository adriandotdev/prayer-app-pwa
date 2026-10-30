import { MYSTERY_SETS, type MysterySetId } from "@/data/rosary/mysteries";

/** The mystery set a saved Rosary sequence belongs to, or null if the id is unknown. */
export function setFromSequenceId(id: string): MysterySetId | null {
  const value = id.replace("rosary:", "") as MysterySetId;
  return value in MYSTERY_SETS ? value : null;
}
