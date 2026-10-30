import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrayerForm } from "@/components/prayers/prayer-form";
import { updatePrayer } from "@/lib/prayers/actions";
import { getPrayer } from "@/lib/prayers/queries";

export const metadata: Metadata = { title: "Edit prayer" };

export default async function EditPrayerPage({ params }: PageProps<"/prayers/[id]/edit">) {
  const { id } = await params;
  const prayer = await getPrayer(id);
  // Starter prayers (no owner) are read-only.
  if (!prayer || prayer.user_id === null) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PrayerForm
        title="Edit prayer"
        backHref={`/prayers/${id}`}
        backLabel="Back to prayer"
        action={updatePrayer}
        submitLabel="Save changes"
        prayer={prayer}
      />
    </div>
  );
}
