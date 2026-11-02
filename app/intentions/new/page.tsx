import type { Metadata } from "next";

import { IntentionForm } from "@/components/intentions/intention-form";
import { createIntention } from "@/lib/intentions/actions";

export const metadata: Metadata = { title: "New intention" };

export default function NewIntentionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <IntentionForm title="Who or what are you praying for?" action={createIntention} submitLabel="Save intention" />
    </div>
  );
}
