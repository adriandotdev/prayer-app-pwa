"use client";

import { AppButton } from "@/components/app-button";
import { ANGELUS_ID, buildAngelus } from "@/data/angelus/sequence";
import { DIVINE_MERCY_ID, buildDivineMercy } from "@/data/divine-mercy/sequence";
import { buildRosary } from "@/data/rosary/sequence";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { setFromSequenceId } from "@/lib/rosary/resume";
import type { SavedProgress } from "@/lib/sequence/progress";
import type { PracticeId } from "@/components/practice/practice-switch";

/** The practice an unfinished saved prayer belongs to, with how to name and reach it. */
export function savedPractice(saved: SavedProgress | null | undefined) {
  if (!saved || saved.completed) return null;
  const step = saved.index + 1;
  if (saved.sequenceId === DIVINE_MERCY_ID) {
    return {
      id: "divine-mercy" as const,
      name: "the Divine Mercy Chaplet",
      href: "/divine-mercy",
      detail: `Step ${step} of ${buildDivineMercy().steps.length}`,
    };
  }
  if (saved.sequenceId === ANGELUS_ID) {
    return { id: "angelus" as const, name: "the Angelus", href: "/angelus", detail: `Step ${step} of ${buildAngelus().steps.length}` };
  }
  const setId = setFromSequenceId(saved.sequenceId);
  if (setId) {
    return {
      id: "rosary" as const,
      name: "your Rosary",
      href: "/rosary",
      detail: `${MYSTERY_SETS[setId].name}, step ${step} of ${buildRosary(setId).steps.length}`,
    };
  }
  return null;
}

/** An unfinished prayer belongs to one practice at a time; name the other one's so it is never lost silently. */
export function otherPracticeProgress(saved: SavedProgress | null | undefined, here: PracticeId) {
  const practice = savedPractice(saved);
  return practice && practice.id !== here ? practice : null;
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
