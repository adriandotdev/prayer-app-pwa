"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { AppButton } from "@/components/app-button";
import { MYSTERY_SETS } from "@/data/rosary/mysteries";
import { addMonths, buildMonthGrid, compareMonths, earliestMonth, sessionsOnDay, type CalendarDay, type MonthRef } from "@/lib/rosary/calendar";
import { dayIndex, type StatsRow } from "@/lib/rosary/stats";
import { cn } from "@/lib/utils";

const noop = () => () => {};

const WEEKDAYS = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 7 + i)); // Jan 7 2024 is a Sunday

function dayLabel({ date, count, sets }: CalendarDay): string {
  const when = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  if (count === 0) return `${when}, no Rosary`;
  const what = sets.map((id) => MYSTERY_SETS[id].name.replace(" Mysteries", "")).join(", ");
  return `${when}, ${count} ${count === 1 ? "Rosary" : "Rosaries"}: ${what}`;
}

/** Days are bucketed in the viewer's time zone, so the calendar is built on the client. */
export function RosaryCalendar({ rows }: { rows: StatsRow[] }) {
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  if (!mounted) {
    return <div className="mt-4 h-72 animate-pulse rounded-2xl bg-secondary/60" aria-hidden />;
  }
  return <Calendar rows={rows} />;
}

function Calendar({ rows }: { rows: StatsRow[] }) {
  const today = useMemo(() => new Date(), []);
  const thisMonth: MonthRef = { year: today.getFullYear(), month: today.getMonth() };
  const firstMonth = useMemo(() => earliestMonth(rows) ?? thisMonth, [rows]); // eslint-disable-line react-hooks/exhaustive-deps

  const [view, setView] = useState<MonthRef>(thisMonth);
  const [focus, setFocus] = useState<Date>(today);
  const [selected, setSelected] = useState<Date>(today);
  const gridRef = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);

  const weeks = useMemo(() => buildMonthGrid(view.year, view.month, rows), [view, rows]);
  const monthName = new Date(view.year, view.month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const prayedThisMonth = weeks.flat().filter((d) => d.inMonth && d.count > 0).length;

  const daySessions = useMemo(() => sessionsOnDay(rows, selected), [rows, selected]);
  const selectedKey = dayIndex(selected);
  const selectedLabel = selected.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const timeFormat = useMemo(() => new Intl.DateTimeFormat(undefined, { timeStyle: "short" }), []);

  const canGoBack = compareMonths(view, firstMonth) > 0;
  const canGoForward = compareMonths(view, thisMonth) < 0;

  // The focused day lives in the viewed month; fall back to its first day otherwise.
  const focusInView = focus.getFullYear() === view.year && focus.getMonth() === view.month;
  const focusKey = dayIndex(focusInView ? focus : new Date(view.year, view.month, 1));

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-day="${focusKey}"]`)?.focus();
  }, [focusKey, view]);

  function goTo(next: MonthRef) {
    setView(next);
    setFocus(new Date(next.year, next.month, 1));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(focusInView ? focus : new Date(view.year, view.month, 1));
      return;
    }
    const base = focusInView ? focus : new Date(view.year, view.month, 1);
    const step: Record<string, [number, number]> = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [0, -7],
      ArrowDown: [0, 7],
    };
    let target: Date | null = null;
    if (step[e.key]) {
      target = new Date(base.getFullYear(), base.getMonth(), base.getDate() + step[e.key][1]);
    } else if (e.key === "Home") {
      target = new Date(base.getFullYear(), base.getMonth(), base.getDate() - base.getDay());
    } else if (e.key === "End") {
      target = new Date(base.getFullYear(), base.getMonth(), base.getDate() + (6 - base.getDay()));
    } else if (e.key === "PageUp" || e.key === "PageDown") {
      const delta = e.key === "PageUp" ? -1 : 1;
      const last = new Date(base.getFullYear(), base.getMonth() + delta + 1, 0).getDate();
      target = new Date(base.getFullYear(), base.getMonth() + delta, Math.min(base.getDate(), last));
    }
    if (!target) return;
    e.preventDefault();

    // Stay within the first month with a session and the current month.
    const targetMonth: MonthRef = { year: target.getFullYear(), month: target.getMonth() };
    if (compareMonths(targetMonth, firstMonth) < 0 || compareMonths(targetMonth, thisMonth) > 0) return;

    moveFocus.current = true;
    setFocus(target);
    setView(targetMonth);
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-2">
        <AppButton variant="ghost" size="icon" aria-label="Previous month" disabled={!canGoBack} onClick={() => goTo(addMonths(view, -1))}>
          <ChevronLeft aria-hidden />
        </AppButton>
        <h3 aria-live="polite" className="font-heading text-xl">
          {monthName}
        </h3>
        <AppButton variant="ghost" size="icon" aria-label="Next month" disabled={!canGoForward} onClick={() => goTo(addMonths(view, 1))}>
          <ChevronRight aria-hidden />
        </AppButton>
      </div>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {prayedThisMonth === 0
          ? "No Rosary this month. Begin whenever you're ready."
          : `Prayed on ${prayedThisMonth} ${prayedThisMonth === 1 ? "day" : "days"} this month.`}
      </p>

      <div ref={gridRef} role="grid" aria-label={`Rosaries prayed in ${monthName}`} onKeyDown={onKeyDown} className="mt-3">
        <div role="row" className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div key={d.getDay()} role="columnheader" className="py-1 text-center text-xs text-muted-foreground">
              <span aria-hidden>{d.toLocaleDateString(undefined, { weekday: "narrow" })}</span>
              <span className="sr-only">{d.toLocaleDateString(undefined, { weekday: "long" })}</span>
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={dayIndex(week[0].date)} role="row" className="mt-1 grid grid-cols-7 gap-1">
            {week.map((day) => {
              if (!day.inMonth) return <div key={dayIndex(day.date)} role="gridcell" aria-hidden />;
              const key = dayIndex(day.date);
              const isToday = key === dayIndex(today);
              return (
                <div
                  key={key}
                  role="gridcell"
                  data-day={key}
                  tabIndex={key === focusKey ? 0 : -1}
                  aria-selected={key === selectedKey}
                  onClick={() => {
                    setFocus(day.date);
                    setSelected(day.date);
                  }}
                  aria-label={dayLabel(day)}
                  aria-current={isToday ? "date" : undefined}
                  className={cn(
                    "relative mx-auto flex aspect-square w-full max-w-11 cursor-pointer items-center justify-center rounded-full text-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring",
                    day.count > 0 ? "bg-primary font-medium text-primary-foreground" : "text-foreground hover:bg-secondary",
                    key === selectedKey && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
                  )}
                >
                  <span aria-hidden>{day.date.getDate()}</span>
                  {isToday && <span aria-hidden className="absolute bottom-1 size-1 rounded-full bg-gold" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div aria-live="polite" className="mt-4 rounded-2xl bg-secondary/60 px-4 py-3">
        <h3 className="font-medium">{selectedLabel}</h3>
        {daySessions.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {selected > today ? "Still to come." : "No Rosary this day."}
          </p>
        ) : (
          <ul className="mt-1 flex flex-col gap-1">
            {daySessions.map((s) => (
              <li key={s.completed_at} className="flex items-center justify-between gap-3 text-sm">
                <span>{MYSTERY_SETS[s.mystery_set].name}</span>
                <span className="text-muted-foreground">{timeFormat.format(new Date(s.completed_at))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Filled days are days you prayed. A gold dot marks today.</p>
    </div>
  );
}
