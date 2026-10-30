"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { MysteryArt } from "@/components/rosary/mystery-art";
import { PageHeader } from "@/components/layout/page-header";
import { SequencePlayer } from "@/components/sequence/sequence-player";
import { MYSTERY_SETS, MYSTERY_SET_ORDER, type MysterySetId } from "@/data/rosary/mysteries";
import { mysterySetForDay } from "@/data/rosary/schedule";
import { buildRosary } from "@/data/rosary/sequence";
import { setFromSequenceId } from "@/lib/rosary/resume";
import { recordOrQueueRosary } from "@/lib/rosary/pending";
import { clearProgress, saveProgress, useSavedProgress, type PrayerMode } from "@/lib/sequence/progress";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";

type View = { kind: "home" } | { kind: "play"; setId: MysterySetId; index: number; mode: PrayerMode } | { kind: "done"; setId: MysterySetId };

// A representative drawing and the traditional days for each set's card.
const SET_CARD: Record<MysterySetId, { art: string; days: string }> = {
  joyful: { art: "The Nativity", days: "Mon · Sat" },
  sorrowful: { art: "The Crucifixion", days: "Tue · Fri" },
  glorious: { art: "The Resurrection", days: "Wed · Sun" },
  luminous: { art: "The Transfiguration", days: "Thu" },
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function RosaryExperience() {
  const today = useToday();
  const saved = useSavedProgress();
  const [view, setView] = useState<View>({ kind: "home" });
  const [picked, setPicked] = useState<MysterySetId | null>(null);

  const todaysSet = today === null ? null : mysterySetForDay(today);
  const selected = picked ?? todaysSet ?? "joyful";
  const resumeSet = saved && !saved.completed ? setFromSequenceId(saved.sequenceId) : null;

  const playing = view.kind === "play" ? view : null;
  const sequence = useMemo(() => (playing ? buildRosary(playing.setId) : null), [playing]);

  if (view.kind === "play" && sequence) {
    return (
      <SequencePlayer
        key={sequence.id}
        sequence={sequence}
        initialIndex={view.index}
        initialMode={view.mode}
        onExit={() => setView({ kind: "home" })}
        onFinish={() => {
          saveProgress({ sequenceId: sequence.id, index: 0, mode: view.mode, completed: true });
          // Best-effort history for signed-in users; offline it is queued and synced later.
          void recordOrQueueRosary(view.setId);
          setView({ kind: "done", setId: view.setId });
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
        <h2 className="ora-enter font-heading text-6xl [animation-delay:150ms] [animation-duration:400ms]">Amen.</h2>
        <svg aria-hidden viewBox="0 0 100 8" className="h-2 w-24 text-gold">
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx={10 + i * 20} cy={4} r={3} fill="currentColor" className="ora-enter" style={{ animationDelay: `${350 + i * 120}ms` }} />
          ))}
        </svg>
        <p className="prayer-text ora-enter text-muted-foreground [animation-delay:350ms] [animation-duration:400ms]">
          You have finished the {MYSTERY_SETS[view.setId].name}. May the peace of Christ keep your heart.
        </p>
        <AppButton size="lg" className="mt-2 min-w-40" onClick={() => { clearProgress(); setView({ kind: "home" }); }}>
          Return
        </AppButton>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 lg:max-w-none">
      {/* PageHeader already has a bottom margin; cancel it so the gap-10 above is the only spacing. */}
      <div className="-mb-7 md:-mb-10">
        <PageHeader title="The Rosary" description="Pray with the mysteries of today." />
      </div>
      {resumeSet && saved && (
        <section className="ora-enter rounded-3xl bg-card p-6">
          <h2 className="font-heading text-3xl">Continue where you left off</h2>
          <p className="mt-1 text-base text-muted-foreground">
            {MYSTERY_SETS[resumeSet].name}, step {saved.index + 1} of 80.
          </p>
          <div className="mt-5 flex gap-3">
            <AppButton className="flex-1 sm:flex-none" onClick={() => setView({ kind: "play", setId: resumeSet, index: saved.index, mode: saved.mode })}>
              Resume
            </AppButton>
            <AppButton variant="outline" onClick={() => clearProgress()}>
              Start over
            </AppButton>
          </div>
        </section>
      )}

      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-x-14 lg:gap-y-5">
      <section aria-labelledby="mysteries-heading" className="flex flex-col gap-5 lg:contents">
        <div className="lg:col-start-1">
          <h2 id="mysteries-heading" className="font-heading text-3xl">
            Choose the mysteries
          </h2>
          {today !== null && todaysSet && (
            <p className="mt-1 text-base text-muted-foreground">
              {DAY_NAMES[today]} is traditionally the {MYSTERY_SETS[todaysSet].name}.
            </p>
          )}
        </div>
        <div role="radiogroup" aria-labelledby="mysteries-heading" className="ora-stagger grid grid-cols-2 gap-3 lg:col-start-1 lg:gap-5">
          {MYSTERY_SET_ORDER.map((id, i) => {
            const on = selected === id;
            const [word, ...rest] = MYSTERY_SETS[id].name.split(" ");
            const card = SET_CARD[id];
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPicked(id)}
                style={{ ["--i" as string]: i }}
                className={cn(
                  "ora-press relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl p-5 text-left transition-colors duration-300 lg:min-h-52 lg:p-7",
                  on ? "bg-primary text-primary-foreground dark:[--gold:var(--primary-foreground)]" : "bg-card hover:bg-secondary",
                )}
              >
                <span className="flex items-start justify-between">
                  <MysteryArt
                    name={card.art}
                    className={cn("size-14 transition-colors duration-300 lg:size-16", on ? "text-primary-foreground" : "text-primary dark:text-gold")}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full transition-[background-color,transform] duration-300 ease-ora",
                      on ? "scale-100 bg-primary-foreground text-primary" : "scale-90 bg-secondary text-transparent",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={2.6} />
                  </span>
                </span>
                <span className="block">
                  <span className="block font-display text-3xl leading-none">{word}</span>
                  <span className={cn("mt-1.5 flex flex-wrap items-center gap-x-2 text-sm", on ? "opacity-85" : "text-muted-foreground")}>
                    <span>{rest.join(" ")}</span>
                    <span aria-hidden>·</span>
                    <span>{card.days}</span>
                    {todaysSet === id && (
                      <span className={cn("font-medium", on ? "" : "text-gold-foreground dark:text-gold")}>Today</span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <ol key={selected} className="ora-stagger flex flex-col gap-1 rounded-3xl bg-card/60 px-4 py-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-start lg:bg-card lg:p-6">
          {MYSTERY_SETS[selected].mysteries.map((m, i) => (
            <li key={m.name} style={{ ["--i" as string]: i }} className="flex items-center gap-4 rounded-2xl p-2">
              <span className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary dark:text-gold">
                <MysteryArt name={m.name} className="size-14" />
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-xl leading-snug">{m.name}</span>
                <span className="block text-sm text-muted-foreground">{m.scripture}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="sticky bottom-(--bottom-nav-height) z-20 -mx-4 grid grid-cols-2 gap-3 bg-background px-4 py-3 lg:z-10 lg:col-start-2 lg:row-start-3 lg:mt-4 lg:grid-cols-1 lg:self-start lg:px-0 shadow-[0_-10px_20px_-12px_oklch(0_0_0/0.12)] md:static md:mx-0 md:bg-transparent md:p-0 md:shadow-none">
        <AppButton size="lg" className="flex-1" onClick={() => setView({ kind: "play", setId: selected, index: 0, mode: "learn" })}>
          <span className="sm:hidden">Learn</span>
          <span className="hidden sm:inline">Begin in Learn mode</span>
        </AppButton>
        <AppButton size="lg" variant="outline" className="flex-1" onClick={() => setView({ kind: "play", setId: selected, index: 0, mode: "pray" })}>
          <span className="sm:hidden">Pray</span>
          <span className="hidden sm:inline">Begin in Pray mode</span>
        </AppButton>
      </div>
      </div>
    </div>
  );
}
