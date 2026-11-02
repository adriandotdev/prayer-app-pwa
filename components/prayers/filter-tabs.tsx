"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { EASE_ORA } from "@/lib/motion";
import { FILTERS, type PrayerFilter } from "@/lib/prayers/schema";
import { cn } from "@/lib/utils";

const LABELS: Record<PrayerFilter, string> = {
  all: "All",
  mine: "Mine",
  starter: "Starter",
  favorites: "Favorites",
};

const PILL =
  "relative inline-flex min-h-11 items-center rounded-full px-5 text-[0.95rem] font-medium whitespace-nowrap transition-colors duration-200";

function hrefFor(filter: PrayerFilter, query: string) {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/prayers?${qs}` : "/prayers";
}

export function FilterTabs({ active: confirmed, query }: { active: PrayerFilter; query: string }) {
  const reduceMotion = useReducedMotion();
  // The server only reports the new filter once its list has loaded. Track the tapped tab locally
  // so the pill moves on the tap, then hand back to the server value when it arrives.
  const [tapped, setTapped] = useState<PrayerFilter | null>(null);
  const [seen, setSeen] = useState(confirmed);
  if (seen !== confirmed) {
    setSeen(confirmed);
    setTapped(null);
  }
  const active = tapped ?? confirmed;

  return (
    // The outer box clips the strip under the row where the scroll indicator draws: iOS Safari shows
    // its overlay indicator while dragging even with scrollbar-width: none.
    <div className="-mx-4 mb-5 overflow-hidden md:mx-0">
      <nav aria-label="Filter prayers" className="-mb-4 flex gap-2 overflow-x-auto px-4 pt-0.5 pb-4.5 scrollbar-none md:px-0 [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={hrefFor(f, query)}
            aria-current={f === active ? "page" : undefined}
            onClick={() => setTapped(f)}
            className={cn(
              PILL,
              f === active ? "text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent",
            )}
          >
            {/* The filled pill slides to the chosen tab instead of jumping. */}
            {f === active && (
              <motion.span
                layoutId="filter-pill"
                aria-hidden
                transition={{ duration: reduceMotion ? 0 : 0.26, ease: EASE_ORA }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
            <span className="relative">{LABELS[f]}</span>
          </Link>
        ))}
        <Link href="/collections" className={cn(PILL, "bg-accent text-accent-foreground hover:bg-accent/70")}>
          Collections
        </Link>
      </nav>
    </div>
  );
}
