import type { Metadata } from "next";
import { HandHeart, Plus } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { IntentionItem } from "@/components/intentions/intention-item";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { listIntentions } from "@/lib/intentions/queries";

export const metadata: Metadata = { title: "Intentions" };

export default async function IntentionsPage() {
  const { active, answered } = await listIntentions();
  const newButton = (
    <AppButton href="/intentions/new">
      <Plus aria-hidden /> New
    </AppButton>
  );

  return (
    <>
      <PageHeader title="Intentions" description="The people and needs you are praying for." actions={newButton} />

      {active.length === 0 && answered.length === 0 ? (
        <EmptyState
          icon={HandHeart}
          title="No intentions yet"
          description="Write down the people and needs you are praying for, and mark them answered when God answers."
          action={<AppButton href="/intentions/new">Add an intention</AppButton>}
        />
      ) : (
        <div className="flex flex-col gap-8">
          {active.length > 0 ? (
            <ul className="grid grid-cols-1 gap-3">
              {active.map((i, n) => (
                <IntentionItem key={i.id} intention={i} index={n} />
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
              Nothing open right now. Add a new intention when you are ready.
            </p>
          )}

          {answered.length > 0 && (
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl px-1 font-heading text-2xl [&::-webkit-details-marker]:hidden">
                Answered ({answered.length})
                <span aria-hidden className="text-base text-muted-foreground transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <ul className="mt-3 grid grid-cols-1 gap-3">
                {answered.map((i, n) => (
                  <IntentionItem key={i.id} intention={i} index={n} />
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </>
  );
}
