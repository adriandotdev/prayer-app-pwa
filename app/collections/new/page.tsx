import type { Metadata } from "next";

import { CollectionForm } from "@/components/collections/collection-form";
import { PageHeader } from "@/components/layout/page-header";
import { createCollection } from "@/lib/collections/actions";

export const metadata: Metadata = { title: "New collection" };

export default function NewCollectionPage() {
  return (
    <div className="mx-auto max-w-md">
      <PageHeader title="New collection" />
      <CollectionForm action={createCollection} cancelHref="/collections" submitLabel="Create collection" />
    </div>
  );
}
