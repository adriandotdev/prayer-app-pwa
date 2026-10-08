import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { PrayerForm } from "@/components/prayers/prayer-form";
import { createPrayer } from "@/lib/prayers/actions";

export const metadata: Metadata = { title: "New prayer" };

export default function NewPrayerPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New prayer" />
      <PrayerForm action={createPrayer} cancelHref="/prayers" submitLabel="Save prayer" />
    </div>
  );
}
