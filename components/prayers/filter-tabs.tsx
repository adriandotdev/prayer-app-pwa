import Link from "next/link";

import { FILTERS, type PrayerFilter } from "@/lib/prayers/schema";
import { cn } from "@/lib/utils";

const LABELS: Record<PrayerFilter, string> = {
  all: "All",
  mine: "Mine",
  starter: "Starter",
  favorites: "Favorites",
};

export function FilterTabs({ active }: { active: PrayerFilter }) {
  return (
    <nav aria-label="Filter prayers" className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
      {FILTERS.map((f) => (
        <Link
          key={f}
          href={f === "all" ? "/prayers" : `/prayers?filter=${f}`}
          aria-current={f === active ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
            f === active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary",
          )}
        >
          {LABELS[f]}
        </Link>
      ))}
    </nav>
  );
}
