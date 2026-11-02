"use client";

import { AppButton } from "@/components/app-button";
import { DIVINE_MERCY_ID, buildDivineMercy } from "@/data/divine-mercy/sequence";
import { buildRosary } from "@/data/rosary/sequence";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { setFromSequenceId } from "@/lib/rosary/resume";
import type { SavedProgress } from "@/lib/sequence/progress";
import type { PracticeId } from "@/components/practice/practice-switch";

/** An unfinished prayer belongs to one practice at a time; name the other one's so it is never lost silently. */
export function otherPracticeProgress(saved: SavedProgress | null | undefined, here: PracticeId) {
  if (!saved || saved.completed) return null;
  if (here === "rosary" && saved.sequenceId === DIVINE_MERCY_ID) {
    return {
      name: "the Divine Mercy Chaplet",
      href: "/divine-mercy",
      detail: `Step ${saved.index + 1} of ${buildDivineMercy().steps.length}`,
    };
  }
  if (here === "divine-mercy") {
    const setId = setFromSequenceId(saved.sequenceId);
    if (setId) {
      return {
        name: "your Rosary",
        href: "/rosary",
        detail: `${MYSTERY_SETS[setId].name}, step ${saved.index + 1} of ${buildRosary(setId).steps.length}`,
      };
    }
  }
  return null;
}

export function OtherPracticeProgress({ other }: { other: NonNullable<ReturnType<typeof otherPracticeProgress>> }) {
  return (
    <section aria-labelledby="other-progress-heading" className="ora-enter rounded-3xl bg-card p-6">
      <h2 id="other-progress-heading" className="font-heading text-3xl">
        Continue where you left off
      </h2>
      <p className="mt-1 text-base text-muted-foreground">
        You are partway through {other.name}. {other.detail}. Beginning here will replace it.
      </p>
      <div className="mt-5">
        <AppButton href={other.href}>Go back to {other.name}</AppButton>
      </div>
    </section>
  );
}
