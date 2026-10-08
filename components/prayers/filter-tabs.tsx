import Link from "next/link";

import { FILTERS, type PrayerFilter } from "@/lib/prayers/schema";
import { cn } from "@/lib/utils";

const LABELS: Record<PrayerFilter, string> = {
  all: "All",
  mine: "Mine",
  starter: "Starter",
  favorites: "Favorites",
};

const PILL = "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors";

function hrefFor(filter: PrayerFilter, query: string) {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  if (query) params.set("q", query);
  const qs = params.toString();
  return qs ? `/prayers?${qs}` : "/prayers";
}

export function FilterTabs({ active, query }: { active: PrayerFilter; query: string }) {
  return (
    <nav aria-label="Filter prayers" className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      {FILTERS.map((f) => (
        <Link
          key={f}
          href={hrefFor(f, query)}
          aria-current={f === active ? "page" : undefined}
          className={cn(PILL, f === active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary")}
        >
          {LABELS[f]}
        </Link>
      ))}
      <Link href="/collections" className={cn(PILL, "border-gold/50 hover:bg-secondary")}>
        Collections
      </Link>
    </nav>
  );
}
