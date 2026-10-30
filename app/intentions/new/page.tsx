import type { Metadata } from "next";

import { IntentionForm } from "@/components/intentions/intention-form";
import { createIntention } from "@/lib/intentions/actions";

export const metadata: Metadata = { title: "New intention" };

export default function NewIntentionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <IntentionForm title="New intention" action={createIntention} submitLabel="Save intention" />
    </div>
  );
}
