import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IntentionForm } from "@/components/intentions/intention-form";
import { PageHeader } from "@/components/layout/page-header";
import { updateIntention } from "@/lib/intentions/actions";
import { getIntention } from "@/lib/intentions/queries";

export const metadata: Metadata = { title: "Edit intention" };

export default async function EditIntentionPage({ params }: PageProps<"/intentions/[id]/edit">) {
  const { id } = await params;
  const intention = await getIntention(id);
  if (!intention) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit intention" />
      <IntentionForm action={updateIntention} submitLabel="Save changes" intention={intention} />
    </div>
  );
}
