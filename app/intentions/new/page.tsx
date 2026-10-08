import type { Metadata } from "next";

import { IntentionForm } from "@/components/intentions/intention-form";
import { PageHeader } from "@/components/layout/page-header";
import { createIntention } from "@/lib/intentions/actions";

export const metadata: Metadata = { title: "New intention" };

export default function NewIntentionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New intention" />
      <IntentionForm action={createIntention} submitLabel="Save intention" />
    </div>
  );
}
