"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { PageHeader } from "@/components/layout/page-header";
import { OtherPracticeProgress, otherPracticeProgress } from "@/components/practice/other-practice-progress";
import { PracticeSwitch } from "@/components/practice/practice-switch";
import { SequencePlayer } from "@/components/sequence/sequence-player";
import { buildAngelus, ANGELUS_ID } from "@/data/angelus/sequence";
import { clearProgress, saveProgress, useSavedProgress, type PrayerMode } from "@/lib/sequence/progress";

type View = { kind: "home" } | { kind: "play"; index: number; mode: PrayerMode } | { kind: "done" };

export function AngelusExperience() {
  const saved = useSavedProgress();
  const [view, setView] = useState<View>({ kind: "home" });
  const sequence = useMemo(() => buildAngelus(), []);
  const doneHeading = useRef<HTMLHeadingElement>(null);
  const isDone = view.kind === "done";
  const resume = saved && !saved.completed && saved.sequenceId === ANGELUS_ID ? saved : null;
  const otherProgress = otherPracticeProgress(saved, "angelus");

  // The player is replaced by the completion view; without this, focus is lost to <body>.
  useEffect(() => {
    if (isDone) doneHeading.current?.focus();
  }, [isDone]);

  if (view.kind === "play") {
    return (
      <SequencePlayer
        key={sequence.id}
        sequence={sequence}
        initialIndex={view.index}
        initialMode={view.mode}
        onExit={() => setView({ kind: "home" })}
        onFinish={() => {
          saveProgress({ sequenceId: sequence.id, index: 0, mode: view.mode, completed: true });
          setView({ kind: "done" });
        }}
      />
    );
  }

  if (view.kind === "done") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-6 text-center md:py-10">
        <span className="ora-arch ora-enter ora-glow flex h-28 w-24 items-end justify-center rounded-b-xl bg-primary pb-6 text-gold dark:bg-card">
          <Check className="size-8" strokeWidth={1.8} />
        </span>
        <h2 ref={doneHeading} tabIndex={-1} className="ora-enter font-heading text-6xl outline-none [animation-delay:150ms] [animation-duration:400ms]">
          Amen.
        </h2>
        <p className="prayer-text ora-enter text-muted-foreground [animation-delay:350ms] [animation-duration:400ms]">
          You have finished the Angelus. The Word was made flesh and dwelt among us.
        </p>
        <AppButton size="lg" className="mt-2 min-w-40" onClick={() => { clearProgress(); setView({ kind: "home" }); }}>
          Return
        </AppButton>
        <AppButton href="/rosary" variant="outline" size="lg" className="min-w-40">
          Pray the Rosary
        </AppButton>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 lg:max-w-none">
      {/* PageHeader already has a bottom margin; cancel it so the gap-10 above is the only spacing. */}
      <div className="-mb-7 md:-mb-10">
        <PageHeader title="The Angelus" description="Remember the Incarnation, morning, noon and evening." />
      </div>
      <div className="-mt-4 md:-mt-6">
        <PracticeSwitch current="angelus" />
      </div>
      {otherProgress && <OtherPracticeProgress other={otherProgress} />}
      {resume && (
        <section className="ora-enter rounded-3xl bg-card p-6">
          <h2 className="font-heading text-3xl">Continue where you left off</h2>
          <p className="mt-1 text-base text-muted-foreground">
            Step {resume.index + 1} of {sequence.steps.length}.
          </p>
          <div className="mt-5 flex gap-3">
            <AppButton className="flex-1 sm:flex-none" onClick={() => setView({ kind: "play", index: resume.index, mode: resume.mode })}>
              Resume
            </AppButton>
            <AppButton variant="outline" onClick={() => clearProgress()}>
              Start over
            </AppButton>
          </div>
        </section>
      )}
      <section aria-labelledby="about-heading" className="rounded-3xl bg-card p-6">
        <h2 id="about-heading" className="font-heading text-3xl">
          About this prayer
        </h2>
        <p className="prayer-text mt-3">
          A short prayer on the Incarnation: three verses, each followed by a Hail Mary, and a closing prayer. It is
          traditionally prayed at 6am, noon and 6pm, and takes about two minutes.
        </p>
      </section>
      <div className="sticky bottom-(--bottom-nav-height) z-20 -mx-4 grid grid-cols-2 gap-3 bg-background px-4 py-3 shadow-[0_-10px_20px_-12px_oklch(0_0_0/0.12)] md:static md:mx-0 md:bg-transparent md:p-0 md:shadow-none">
        <AppButton size="lg" className="flex-1" onClick={() => setView({ kind: "play", index: 0, mode: "learn" })}>
          <span className="sm:hidden">Learn</span>
          <span className="hidden sm:inline">Begin in Learn mode</span>
        </AppButton>
        <AppButton size="lg" variant="outline" className="flex-1" onClick={() => setView({ kind: "play", index: 0, mode: "pray" })}>
          <span className="sm:hidden">Pray</span>
          <span className="hidden sm:inline">Begin in Pray mode</span>
        </AppButton>
      </div>
    </div>
  );
}
