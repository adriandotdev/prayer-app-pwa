import { Search } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { FIELD } from "@/components/field";
import type { PrayerFilter } from "@/lib/prayers/schema";

/** A plain GET form, so search works without client JavaScript and the URL is shareable. */
export function SearchForm({ filter, query }: { filter: PrayerFilter; query: string }) {
  return (
    <form role="search" action="/prayers" className="mb-4 flex gap-2">
      {filter !== "all" ? <input type="hidden" name="filter" value={filter} /> : null}
      <input
        key={query}
        type="search"
        name="q"
        defaultValue={query}
        aria-label="Search prayers"
        placeholder="Search prayers"
        enterKeyHint="search"
        autoComplete="off"
        maxLength={100}
        className={`${FIELD} min-h-12 min-w-0 flex-1`}
      />
      <AppButton type="submit" size="icon" className="size-12" aria-label="Search">
        <Search aria-hidden />
      </AppButton>
    </form>
  );
}
