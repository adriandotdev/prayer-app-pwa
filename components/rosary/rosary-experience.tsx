"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { SequencePlayer } from "@/components/sequence/sequence-player";
import { MYSTERY_SETS, MYSTERY_SET_ORDER, type MysterySetId } from "@/data/rosary/mysteries";
import { mysterySetForDay } from "@/data/rosary/schedule";
import { buildRosary } from "@/data/rosary/sequence";
import { recordRosarySession } from "@/lib/rosary/actions";
import { clearProgress, saveProgress, useSavedProgress, type PrayerMode } from "@/lib/sequence/progress";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";

type View = { kind: "home" } | { kind: "play"; setId: MysterySetId; index: number; mode: PrayerMode } | { kind: "done"; setId: MysterySetId };

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function setFromSequenceId(id: string): MysterySetId | null {
  const value = id.replace("rosary:", "") as MysterySetId;
  return value in MYSTERY_SETS ? value : null;
}

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
          // Best-effort history for signed-in users; offline or signed out simply does nothing.
          recordRosarySession(view.setId).catch(() => {});
          setView({ kind: "done", setId: view.setId });
        }}
      />
    );
  }

  if (view.kind === "done") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-gold/20 text-gold">
          <Check className="size-7" />
        </span>
        <h2 className="font-heading text-4xl">Amen.</h2>
        <p className="prayer-text text-muted-foreground">
          You have finished the {MYSTERY_SETS[view.setId].name}. May the peace of Christ keep your heart.
        </p>
        <AppButton size="lg" onClick={() => { clearProgress(); setView({ kind: "home" }); }}>
          Return
        </AppButton>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      {resumeSet && saved && (
        <section className="rounded-2xl border border-gold/40 bg-card p-5">
          <h2 className="font-heading text-2xl">Continue where you left off</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {MYSTERY_SETS[resumeSet].name}, step {saved.index + 1} of 80.
          </p>
          <div className="mt-4 flex gap-3">
            <AppButton className="flex-1 sm:flex-none" onClick={() => setView({ kind: "play", setId: resumeSet, index: saved.index, mode: saved.mode })}>
              Resume
            </AppButton>
            <AppButton variant="outline" onClick={() => clearProgress()}>
              Start over
            </AppButton>
          </div>
        </section>
      )}

      <section aria-labelledby="mysteries-heading" className="flex flex-col gap-3">
        <div>
          <h2 id="mysteries-heading" className="font-heading text-2xl">
            Choose the mysteries
          </h2>
          {today !== null && todaysSet && (
            <p className="text-sm text-muted-foreground">
              {DAY_NAMES[today]} is traditionally the {MYSTERY_SETS[todaysSet].name}.
            </p>
          )}
        </div>
        <div role="radiogroup" aria-labelledby="mysteries-heading" className="grid gap-2 sm:grid-cols-2">
          {MYSTERY_SET_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected === id}
              onClick={() => setPicked(id)}
              className={cn(
                "min-h-14 rounded-xl border p-4 text-left transition-colors active:bg-secondary",
                selected === id ? "border-gold bg-gold/10" : "border-border hover:bg-secondary/50",
              )}
            >
              <span className="block font-medium">{MYSTERY_SETS[id].name}</span>
              {todaysSet === id && <span className="text-xs text-gold">Today</span>}
            </button>
          ))}
        </div>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {MYSTERY_SETS[selected].mysteries.map((m) => (
            <li key={m.name}>{m.name}</li>
          ))}
        </ol>
      </section>

      <div className="sticky bottom-(--bottom-nav-height) z-20 -mx-4 grid grid-cols-2 gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
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
  );
}
