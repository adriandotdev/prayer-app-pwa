import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { AppButton } from "@/components/app-button";
import { Loader } from "@/components/brand/loader";
import { PageHeader } from "@/components/layout/page-header";
import { FilterTabs } from "@/components/prayers/filter-tabs";
import { PrayerList } from "@/components/prayers/prayer-list";
import { SearchForm } from "@/components/prayers/search-form";
import { parseFilter, parseQuery } from "@/lib/prayers/schema";

export const metadata: Metadata = { title: "Prayers" };

export default async function PrayersPage({ searchParams }: PageProps<"/prayers">) {
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const query = parseQuery(params.q);

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
      <SearchForm filter={filter} query={query} />
      <FilterTabs active={filter} query={query} />
      {/* Keyed by filter only: switching tabs shows the loader at once, while typing a search keeps the current list until the new one is ready. */}
      <Suspense key={filter} fallback={<Loader label="Loading prayers" />}>
        <PrayerList filter={filter} query={query} />
      </Suspense>
    </>
  );
}
