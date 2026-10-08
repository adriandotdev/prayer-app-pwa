import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { MembershipToggle } from "@/components/collections/membership-toggle";
import { PageHeader } from "@/components/layout/page-header";
import { previewLine } from "@/components/prayers/prayer-body";
import { getCollection, getPrayerIdsInCollection } from "@/lib/collections/queries";
import { listPrayers } from "@/lib/prayers/queries";

export const metadata: Metadata = { title: "Add prayers" };

export default async function AddToCollectionPage({ params }: PageProps<"/collections/[id]/add">) {
  const { id } = await params;
  const collection = await getCollection(id);
  if (!collection) notFound();
  const [prayers, memberIds] = await Promise.all([listPrayers("all", new Set()), getPrayerIdsInCollection(id)]);

  return (
    <div className="mx-auto max-w-2xl">
      <AppButton href={`/collections/${id}`} variant="ghost" className="-ml-3 mb-2">
        <ArrowLeft aria-hidden /> {collection.name}
      </AppButton>
      <PageHeader title="Add prayers" description="Tap a prayer to add it or remove it." />
      <ul className="flex flex-col gap-2">
        {prayers.map((p) => (
          <MembershipToggle
            key={p.id}
            collectionId={id}
            prayerId={p.id}
            isMember={memberIds.has(p.id)}
            label={p.title}
            hint={previewLine(p.body)}
          />
        ))}
      </ul>
    </div>
  );
}
