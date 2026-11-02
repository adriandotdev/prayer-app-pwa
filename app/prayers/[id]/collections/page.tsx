import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderHeart } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { MembershipToggle } from "@/components/collections/membership-toggle";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { getCollectionIdsForPrayer, listCollections } from "@/lib/collections/queries";
import { getPrayer } from "@/lib/prayers/queries";

export const metadata: Metadata = { title: "Add to collection" };

export default async function PrayerCollectionsPage({ params }: PageProps<"/prayers/[id]/collections">) {
  const { id } = await params;
  const prayer = await getPrayer(id);
  if (!prayer) notFound();
  const [collections, memberOf] = await Promise.all([listCollections(), getCollectionIdsForPrayer(id)]);

  return (
    <div className="mx-auto max-w-2xl">
      <AppButton href={`/prayers/${id}`} variant="ghost" className="-ml-3 mb-2">
        <ArrowLeft aria-hidden /> {prayer.title}
      </AppButton>
      <PageHeader title="Add to collection" description="Tap a collection to add this prayer or remove it." />

      {collections.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="No collections yet"
          description="Create a collection first, then come back to add this prayer."
          action={<AppButton href="/collections/new">Create a collection</AppButton>}
        />
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {collections.map((c) => (
              <MembershipToggle
                key={c.id}
                collectionId={c.id}
                prayerId={id}
                isMember={memberOf.has(c.id)}
                label={c.name}
                hint={`${c.count} ${c.count === 1 ? "prayer" : "prayers"}`}
              />
            ))}
          </ul>
          <AppButton href="/collections/new" variant="outline" className="mt-4 w-full sm:w-auto">
            New collection
          </AppButton>
        </>
      )}
    </div>
  );
}
