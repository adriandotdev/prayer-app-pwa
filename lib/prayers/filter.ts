import type { PrayerFilter } from "./schema";
import { searchTerms } from "./search";

type Filterable = { id: string; user_id: string | null; title: string; body: string };

/**
 * The offline twin of `listPrayers`: same filters, same "every typed word appears as part of a
 * word in the title or body" search (case-insensitive substring, like the SQL `ilike`), same
 * title order. Keep the two in step.
 */
export function filterPrayers<T extends Filterable>(
  prayers: readonly T[],
  favoriteIds: ReadonlySet<string>,
  filter: PrayerFilter,
  search = "",
): T[] {
  const terms = searchTerms(search).map((t) => t.toLowerCase());
  return prayers
    .filter((p) => {
      if (filter === "mine" && p.user_id === null) return false;
      if (filter === "starter" && p.user_id !== null) return false;
      if (filter === "favorites" && !favoriteIds.has(p.id)) return false;
      if (!terms.length) return true;
      const haystack = `${p.title}\n${p.body}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}
