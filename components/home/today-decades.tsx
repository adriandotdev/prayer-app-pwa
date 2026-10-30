"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { mysterySetForDay } from "@/data/rosary/schedule";
import { useToday } from "@/lib/use-today";

/** Desktop only: the five decades of today's mysteries, so the wide home screen has something to read. */
export function TodayDecades() {
  const today = useToday();
  const set = today === null ? null : MYSTERY_SETS[mysterySetForDay(today)];

  return (
    <section aria-labelledby="decades-title" className="hidden min-h-72 flex-col rounded-3xl bg-card p-8 lg:flex">
      <div className="flex items-start justify-between gap-4">
        <h2 id="decades-title" className="font-heading text-4xl leading-none">
          {set ? `Today: the ${set.name}` : "Today’s mysteries"}
        </h2>
        <Link
          href="/rosary"
          className="ora-press group inline-flex min-h-11 items-center gap-1.5 rounded-full bg-secondary px-5 text-[0.95rem] font-medium hover:bg-accent"
        >
          Begin
          <ArrowUpRight className="size-4 text-primary transition-transform duration-200 ease-ora group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </Link>
      </div>
      {set ? (
        <ol key={set.id} className="ora-stagger mt-6 grid gap-x-10 gap-y-1 marker:text-gold sm:grid-cols-2">
          {set.mysteries.map((m, i) => (
            <li key={m.name} style={{ ["--i" as string]: i }} className="ml-5 list-decimal py-2 pl-1 font-serif text-xl">
              {m.name}
              <span className="block text-sm text-muted-foreground">{m.scripture}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
