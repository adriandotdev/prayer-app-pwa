"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const PRACTICES = [
  { id: "rosary", label: "Rosary", href: "/rosary" },
  { id: "divine-mercy", label: "Divine Mercy", href: "/divine-mercy" },
  { id: "angelus", label: "Angelus", href: "/angelus" },
  { id: "seven-sorrows", label: "Seven Sorrows", href: "/seven-sorrows" },
  { id: "stations-of-the-cross", label: "Stations", href: "/stations-of-the-cross" },
] as const;

export type PracticeId = (typeof PRACTICES)[number]["id"];

/** The practices a person can switch between. Plain links, so each practice keeps its own URL and works offline. */
export function PracticeSwitch({ current }: { current: PracticeId }) {
  const nav = useRef<HTMLElement>(null);

  // Five pills do not fit a phone: the row scrolls, so bring the current one into view (without scrolling the page).
  useEffect(() => {
    const el = nav.current;
    const active = el?.querySelector<HTMLElement>("[aria-current=page]");
    if (!el || !active) return;
    el.scrollLeft = Math.max(0, active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2);
  }, [current]);

  return (
    <nav ref={nav} aria-label="Prayer" className="flex w-full gap-1 overflow-x-auto rounded-full bg-secondary p-1 [scrollbar-width:none] sm:w-fit">
      {PRACTICES.map((p) => {
        const on = p.id === current;
        return (
          <Link
            key={p.id}
            href={p.href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex min-h-11 shrink-0 flex-1 items-center justify-center whitespace-nowrap rounded-full px-4 text-[0.95rem] font-medium transition-colors duration-200 ease-ora sm:flex-none sm:px-5",
              on ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-card",
            )}
          >
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
