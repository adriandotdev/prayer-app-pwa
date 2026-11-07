"use client";

import { AppButton } from "@/components/app-button";
import { ChristFigure } from "@/components/home/christ-figure";
import { savedPractice } from "@/components/practice/other-practice-progress";
import type { PracticeId } from "@/components/practice/practice-switch";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { mysterySetForDay } from "@/data/rosary/schedule";
import { useSavedProgress } from "@/lib/sequence/progress";
import { useToday } from "@/lib/use-today";

const RESUME_COPY: Record<PracticeId, { line: string; message: string; button: string }> = {
  rosary: { line: "", message: "Your Rosary is where you left it.", button: "Continue your Rosary" },
  "divine-mercy": { line: "Divine Mercy Chaplet", message: "Your chaplet is where you left it.", button: "Continue the chaplet" },
  angelus: { line: "The Angelus", message: "Your Angelus is where you left it.", button: "Continue the Angelus" },
  "seven-sorrows": { line: "Seven Sorrows", message: "Your chaplet is where you left it.", button: "Continue the chaplet" },
  "stations-of-the-cross": { line: "Stations of the Cross", message: "Your Stations are where you left them.", button: "Continue the Stations" },
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** The home hero: a chapel window with a halo-lit Christ, today's mysteries and one way in. */
export function TodayHero() {
  const today = useToday();
  const set = today === null ? null : MYSTERY_SETS[mysterySetForDay(today)];
  const saved = useSavedProgress();
  const resume = savedPractice(saved);
  const copy = resume ? RESUME_COPY[resume.id] : null;
  const resumeLine = resume && copy ? (copy.line ? `${copy.line} · ${resume.detail.charAt(0).toLowerCase()}${resume.detail.slice(1)}` : resume.detail) : null;
  const dayLine = today !== null && set ? `${DAY_NAMES[today]} · ${set.name}` : null;

  return (
    <section
      aria-labelledby="home-title"
      className="ora-arch relative isolate flex flex-col items-center overflow-hidden rounded-b-[1.75rem] bg-primary px-6 pt-10 pb-8 text-center lg:pt-24 lg:pb-10 text-primary-foreground dark:bg-secondary dark:text-secondary-foreground"
    >
      <ChristFigure className="size-40 text-primary-foreground lg:size-44 dark:text-secondary-foreground" />

      <svg aria-hidden viewBox="0 0 100 8" className="mt-4 h-2 w-24 text-primary-foreground dark:text-gold">
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={5 + i * 10} cy={4} r={2.4} fill="currentColor" className="opacity-40" />
        ))}
      </svg>

      <p key={resumeLine ?? dayLine ?? ""} className="ora-fade mt-5 min-h-5 text-sm font-medium text-primary-foreground/85 dark:text-gold">
        {resumeLine ?? dayLine}
      </p>
      <h1 id="home-title" className="mt-3 text-[2.5rem] leading-[1] font-medium tracking-[-0.02em]">
        Peace be with you
      </h1>
      <p key={copy ? "resume" : "idle"} className="ora-fade mt-3 max-w-[18rem] text-base opacity-80">
        {copy ? copy.message : "Take a moment. What would you like to pray?"}
      </p>

      <AppButton
        href={resume ? resume.href : "/rosary"}
        size="lg"
        className="mt-7 w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
      >
        <span key={copy ? "resume" : "idle"} className="ora-fade">
          {copy ? copy.button : "Pray the Rosary"}
        </span>
      </AppButton>
    </section>
  );
}
