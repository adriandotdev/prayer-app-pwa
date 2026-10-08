import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight, FolderHeart, Plus } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { listCollections } from "@/lib/collections/queries";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await listCollections();

  return (
    <>
      <AppButton href="/prayers" variant="ghost" className="-ml-3 mb-2">
        <ArrowLeft aria-hidden /> Prayers
      </AppButton>
      <PageHeader
        title="Collections"
        description="Group prayers for a season, a devotion, or a time of day."
        actions={
          <AppButton href="/collections/new">
            <Plus aria-hidden /> New
          </AppButton>
        }
      />
      {collections.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="No collections yet"
          description="Make a collection, like “Morning prayers”, then add prayers to it."
          action={<AppButton href="/collections/new">Create a collection</AppButton>}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {collections.map((c) => (
            <li key={c.id}>
              <Link
                href={`/collections/${c.id}`}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50 active:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-xl">{c.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {c.count} {c.count === 1 ? "prayer" : "prayers"}
                  </span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
