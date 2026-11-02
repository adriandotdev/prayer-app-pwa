import type { Metadata } from "next";

import { PrayerForm } from "@/components/prayers/prayer-form";
import { createPrayer } from "@/lib/prayers/actions";

export const metadata: Metadata = { title: "New prayer" };

export default function NewPrayerPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PrayerForm title="New prayer" backHref="/prayers" backLabel="Prayers" action={createPrayer} submitLabel="Save prayer" />
    </div>
  );
}
