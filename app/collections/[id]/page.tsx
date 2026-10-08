import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { DeleteCollectionButton } from "@/components/collections/delete-collection-button";
import { RemoveFromCollectionButton } from "@/components/collections/remove-from-collection-button";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { PrayerCard } from "@/components/prayers/prayer-card";
import { getCollection, getCollectionPrayers } from "@/lib/collections/queries";
import { getFavoriteIds } from "@/lib/prayers/queries";

export async function generateMetadata({ params }: PageProps<"/collections/[id]">): Promise<Metadata> {
  const collection = await getCollection((await params).id);
  return { title: collection?.name ?? "Collection" };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[id]">) {
  const { id } = await params;
  const collection = await getCollection(id);
  if (!collection) notFound();
  const [prayers, favoriteIds] = await Promise.all([getCollectionPrayers(id), getFavoriteIds()]);

  return (
    <>
      <AppButton href="/collections" variant="ghost" className="-ml-3 mb-2">
        <ArrowLeft aria-hidden /> Collections
      </AppButton>
      <PageHeader
        title={collection.name}
        description={`${prayers.length} ${prayers.length === 1 ? "prayer" : "prayers"}`}
        actions={
          <AppButton href={`/collections/${id}/add`}>
            <Plus aria-hidden /> Add
          </AppButton>
        }
      />

      {prayers.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="This collection is empty"
          description="Add prayers from your library, or tap “Add to collection” on any prayer."
          action={<AppButton href={`/collections/${id}/add`}>Add prayers</AppButton>}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {prayers.map((p) => (
            <PrayerCard
              key={p.id}
              prayer={p}
              isFavorite={favoriteIds.has(p.id)}
              actions={<RemoveFromCollectionButton collectionId={id} prayerId={p.id} />}
            />
          ))}
        </ul>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <AppButton href={`/collections/${id}/edit`} variant="outline" className="flex-1 sm:flex-none">
          Rename
        </AppButton>
        <DeleteCollectionButton id={id} />
      </div>
    </>
  );
}
