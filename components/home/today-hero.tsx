"use client";

import { AppButton } from "@/components/app-button";
import { ChristFigure } from "@/components/home/christ-figure";
import { buildDivineMercy, DIVINE_MERCY_ID } from "@/data/divine-mercy/sequence";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { buildRosary } from "@/data/rosary/sequence";
import { mysterySetForDay } from "@/data/rosary/schedule";
import { setFromSequenceId } from "@/lib/rosary/resume";
import { useSavedProgress } from "@/lib/sequence/progress";
import { useToday } from "@/lib/use-today";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** The home hero: a chapel window with a halo-lit Christ, today's mysteries and one way in. */
export function TodayHero() {
  const today = useToday();
  const set = today === null ? null : MYSTERY_SETS[mysterySetForDay(today)];
  const saved = useSavedProgress();
  const resumeSetId = saved && !saved.completed ? setFromSequenceId(saved.sequenceId) : null;
  const resumeMercy = saved && !saved.completed && saved.sequenceId === DIVINE_MERCY_ID;
  const resumeLine = saved && resumeSetId
    ? `${MYSTERY_SETS[resumeSetId].name} · step ${saved.index + 1} of ${buildRosary(resumeSetId).steps.length}`
    : saved && resumeMercy
      ? `Divine Mercy Chaplet · step ${saved.index + 1} of ${buildDivineMercy().steps.length}`
      : null;
  const dayLine = today !== null && set ? `${DAY_NAMES[today]} · ${set.name}` : null;

  return (
    <section
      aria-labelledby="home-title"
      className="ora-arch relative isolate flex h-full flex-col items-center lg:justify-center overflow-hidden rounded-b-[1.75rem] bg-primary px-6 pt-10 pb-8 text-center text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
    >
      <ChristFigure className="size-40 text-primary-foreground dark:text-secondary-foreground" />

      <svg aria-hidden viewBox="0 0 100 8" className="mt-4 h-2 w-24 text-primary-foreground dark:text-gold">
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={5 + i * 10} cy={4} r={2.4} fill="currentColor" className="opacity-40" />
        ))}
      </svg>

      <p className="mt-5 min-h-5 text-sm font-medium text-primary-foreground/85 dark:text-gold">{resumeLine ?? dayLine}</p>
      <h1 id="home-title" className="mt-3 text-[2.5rem] leading-[1] font-medium tracking-[-0.02em]">
        Peace be with you
      </h1>
      <p className="mt-3 max-w-[18rem] text-base opacity-80">
        {resumeLine ? (resumeMercy ? "Your chaplet is where you left it." : "Your Rosary is where you left it.") : "Take a moment. What would you like to pray?"}
      </p>

      <AppButton
        href={resumeMercy ? "/divine-mercy" : "/rosary"}
        size="lg"
        className="mt-7 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
      >
        {resumeLine ? (resumeMercy ? "Continue the chaplet" : "Continue your Rosary") : "Pray the Rosary"}
      </AppButton>
    </section>
  );
}
