"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, HandHeart } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { BeadTracker } from "@/components/sequence/bead-tracker";
import { clampIndex, firstStepForBead, isLastStep, sectionProgress } from "@/lib/sequence/engine";
import { saveProgress, type PrayerMode } from "@/lib/sequence/progress";
import type { SequenceDefinition } from "@/lib/sequence/types";
import { cn } from "@/lib/utils";

type Props = {
  sequence: SequenceDefinition;
  initialIndex: number;
  initialMode: PrayerMode;
  onFinish: () => void;
  onExit: () => void;
};

const SWIPE_THRESHOLD = 50;

export function SequencePlayer({ sequence, initialIndex, initialMode, onFinish, onExit }: Props) {
  const [index, setIndex] = useState(() => clampIndex(sequence, initialIndex));
  const [mode, setMode] = useState<PrayerMode>(initialMode);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const step = sequence.steps[index];
  const prayer = step.prayerId ? sequence.prayers[step.prayerId] : undefined;
  const { position, total } = sectionProgress(sequence, index);
  const last = isLastStep(sequence, index);

  useEffect(() => {
    saveProgress({ sequenceId: sequence.id, index, mode, completed: false });
  }, [sequence.id, index, mode]);

  const next = () => {
    if (last) onFinish();
    else setIndex((i) => clampIndex(sequence, i + 1));
  };
  const back = () => setIndex((i) => clampIndex(sequence, i - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 md:flex-row md:items-start md:gap-10">
      <div className="md:sticky md:top-6 md:w-72 md:shrink-0">
        <BeadTracker
          sequence={sequence}
          index={index}
          className="h-40 w-auto sm:h-48 md:h-[30rem]"
          onSelectBead={(beadId) => {
            const target = firstStepForBead(sequence, beadId);
            if (target >= 0) setIndex(target);
          }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="-ml-2 min-h-11 px-2 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Leave
          </button>
          <div role="group" aria-label="Mode" className="inline-flex rounded-full border border-border p-0.5">
            <ModeButton active={mode === "learn"} onClick={() => setMode("learn")} icon={<BookOpen className="size-3.5" />}>
              Learn
            </ModeButton>
            <ModeButton active={mode === "pray"} onClick={() => setMode("pray")} icon={<HandHeart className="size-3.5" />}>
              Pray
            </ModeButton>
          </div>
        </div>

        <article
          aria-live="polite"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
              if (dx < 0) next();
              else back();
            }
          }}
          className="flex min-h-60 flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {step.section} · {position} of {total}
          </p>
          <div>
            <h2 className="font-heading text-3xl">{step.title}</h2>
            {step.subtitle && <p className="mt-1 text-sm text-muted-foreground">{step.subtitle}</p>}
          </div>

          {mode === "learn" && step.reflection && (
            <div className="rounded-lg bg-secondary/60 p-4 text-sm leading-relaxed">
              <p className="font-medium">
                {step.reflection.heading}
                {step.reflection.reference && (
                  <span className="font-normal text-muted-foreground"> · {step.reflection.reference}</span>
                )}
              </p>
              {step.reflection.meditation && <p className="mt-1">{step.reflection.meditation}</p>}
              {step.reflection.fruit && (
                <p className="mt-2 text-muted-foreground">
                  Fruit of the mystery: <span className="text-foreground">{step.reflection.fruit}</span>
                </p>
              )}
            </div>
          )}
          {mode === "pray" && step.reflection && !prayer && (
            <p className="text-sm text-muted-foreground">{step.reflection.reference}</p>
          )}

          {prayer && (
            <div className="space-y-3">
              {prayer.text.map((line) => (
                <p key={line} className="prayer-text">
                  {line}
                </p>
              ))}
            </div>
          )}
          {!prayer && mode === "pray" && step.reflection && (
            <p className="prayer-text text-muted-foreground">{step.reflection.fruit}</p>
          )}
          {!prayer && mode === "learn" && (
            <p className="text-sm text-muted-foreground">Take a moment, then say the Our Father on the next bead.</p>
          )}

          {mode === "learn" && prayer?.learn && (
            <p className="mt-auto border-t border-border pt-3 text-sm text-muted-foreground">{prayer.learn}</p>
          )}
        </article>

        <div className="sticky bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-20 -mx-4 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <AppButton variant="outline" size="lg" onClick={back} disabled={index === 0} aria-label="Previous">
            <ArrowLeft />
            Back
          </AppButton>
          <AppButton size="lg" className="flex-1" onClick={next}>
            {last ? "Finish" : "Next"}
            <ArrowRight />
          </AppButton>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Step {index + 1} of {sequence.steps.length} · swipe or tap a bead
        </p>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center min-h-10 gap-1.5 rounded-full px-4 text-sm transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
