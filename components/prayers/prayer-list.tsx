import { BookOpen } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { EmptyState } from "@/components/layout/empty-state";
import { PrayerCard } from "@/components/prayers/prayer-card";
import { getFavoriteIds, listPrayers } from "@/lib/prayers/queries";
import type { PrayerFilter } from "@/lib/prayers/schema";

const EMPTY: Record<string, { title: string; description: string }> = {
  all: { title: "No prayers yet", description: "Write your first prayer, or browse the starter library." },
  mine: { title: "You haven't written any prayers", description: "Write one, or copy a starter prayer to make it your own." },
  starter: { title: "No starter prayers", description: "The starter library hasn't been set up yet." },
  favorites: { title: "No favorites yet", description: "Tap the heart on a prayer to keep it close." },
};

/** Loads its own data so the page shell (and the loading state) can render before it resolves. */
export async function PrayerList({ filter, query }: { filter: PrayerFilter; query: string }) {
  const favoriteIds = await getFavoriteIds();
  const prayers = await listPrayers(filter, favoriteIds, query);

  return (
    <>
      {query ? (
        <p role="status" className="sr-only">
          {prayers.length === 0 ? "No matching prayers" : `${prayers.length} matching ${prayers.length === 1 ? "prayer" : "prayers"}`}
        </p>
      ) : null}
      {prayers.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          {...(query
            ? {
                title: "No matching prayers",
                description: `Nothing found for “${query}”. Try a different word, or clear the search.`,
                action: (
                  <AppButton href={filter === "all" ? "/prayers" : `/prayers?filter=${filter}`} variant="outline">
                    Clear search
                  </AppButton>
                ),
              }
            : EMPTY[filter])}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {prayers.map((p, i) => (
            <PrayerCard key={p.id} prayer={p} isFavorite={favoriteIds.has(p.id)} index={i} />
          ))}
        </ul>
      )}
    </>
  );
}
