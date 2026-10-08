import type { Metadata } from "next";
import { BookOpen, Plus } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { FilterTabs } from "@/components/prayers/filter-tabs";
import { PrayerCard } from "@/components/prayers/prayer-card";
import { getFavoriteIds, listPrayers } from "@/lib/prayers/queries";
import { parseFilter } from "@/lib/prayers/schema";

export const metadata: Metadata = { title: "Prayers" };

const EMPTY: Record<string, { title: string; description: string }> = {
  all: { title: "No prayers yet", description: "Write your first prayer, or browse the starter library." },
  mine: { title: "You haven't written any prayers", description: "Write one, or copy a starter prayer to make it your own." },
  starter: { title: "No starter prayers", description: "The starter library hasn't been set up yet." },
  favorites: { title: "No favorites yet", description: "Tap the heart on a prayer to keep it close." },
};

export default async function PrayersPage({ searchParams }: PageProps<"/prayers">) {
  const filter = parseFilter((await searchParams).filter);
  const favoriteIds = await getFavoriteIds();
  const prayers = await listPrayers(filter, favoriteIds);

  return (
    <>
      <PageHeader
        title="Prayers"
        description="Your personal prayer library."
        actions={
          <AppButton href="/prayers/new">
            <Plus aria-hidden /> New
          </AppButton>
        }
      />
      <FilterTabs active={filter} />
      {prayers.length === 0 ? (
        <EmptyState icon={BookOpen} {...EMPTY[filter]} />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {prayers.map((p) => (
            <PrayerCard key={p.id} prayer={p} isFavorite={favoriteIds.has(p.id)} />
          ))}
        </ul>
      )}
    </>
  );
}
