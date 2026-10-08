import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionForm } from "@/components/collections/collection-form";
import { PageHeader } from "@/components/layout/page-header";
import { updateCollection } from "@/lib/collections/actions";
import { getCollection } from "@/lib/collections/queries";

export const metadata: Metadata = { title: "Rename collection" };

export default async function EditCollectionPage({ params }: PageProps<"/collections/[id]/edit">) {
  const { id } = await params;
  const collection = await getCollection(id);
  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="Rename collection" />
      <CollectionForm action={updateCollection} cancelHref={`/collections/${id}`} submitLabel="Save changes" collection={collection} />
    </div>
  );
}
