"use client";

import { ExternalLink } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { Skeleton } from "@/components/ui/skeleton";
import { parseIsoDate } from "@/lib/liturgy/dates";
import { usccbReadingsUrl } from "@/lib/liturgy/readings-link";
import { useLiturgicalDay } from "@/lib/liturgy/use-liturgical-day";
import { SEASON_INFO } from "@/lib/theme/season";
import { useOnline } from "@/lib/use-online";

const LONG_DATE = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" });

/** Today's place in the liturgical year. Client-only: the cached home HTML must never carry a date. */
export function LiturgicalDayCard() {
  const day = useLiturgicalDay();
  const online = useOnline();

  if (day === null) {
    return (
      <section aria-label="Today in the liturgical year" aria-busy="true" className="min-h-56 rounded-3xl bg-card p-6 lg:p-8">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-9 w-4/5" />
        <Skeleton className="mt-3 h-9 w-1/2" />
        <Skeleton className="mt-6 h-6 w-32" />
      </section>
    );
  }

  const color = SEASON_INFO[day.color];
  const eyebrow = [day.timeName, day.week !== null && day.time !== "triduum" ? `week ${day.week}` : null].filter(Boolean).join(", ");

  return (
    <section aria-labelledby="liturgical-day-title" className="min-h-56 rounded-3xl bg-card p-6 lg:p-8">
      <p className="text-sm font-medium text-muted-foreground">
        <time dateTime={day.date}>{LONG_DATE.format(parseIsoDate(day.date))}</time>
        <span aria-hidden> · </span>
        <span className="sr-only">, </span>
        {eyebrow}
      </p>
      <h2 id="liturgical-day-title" className="mt-3 font-heading text-3xl leading-tight lg:text-4xl">
        {day.title}
      </h2>
      <p className="mt-4 inline-flex items-center gap-2 text-base">
        <span aria-hidden className="size-4 rounded-full ring-1 ring-foreground/30" style={{ backgroundColor: color.swatch }} />
        {color.name}
      </p>
      <div className="mt-6">
        {online ? (
          <AppButton href={usccbReadingsUrl(day.date)} variant="outline" target="_blank" rel="noopener noreferrer">
            Today’s readings on usccb.org
            <ExternalLink aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </AppButton>
        ) : (
          <p className="text-sm text-muted-foreground">Today’s readings link needs a connection.</p>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Universal Roman calendar. Local saints and optional memorials are not shown.
      </p>
    </section>
  );
}
