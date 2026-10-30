import type { Metadata } from "next";
import { ChevronDown, HandHeart, Plus } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { IntentionItem } from "@/components/intentions/intention-item";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { listIntentions } from "@/lib/intentions/queries";

export const metadata: Metadata = { title: "Intentions" };

const LIST = "grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4 lg:items-start";
const SECTION_HEADING = "font-display text-2xl md:text-3xl";

export default async function IntentionsPage() {
  const { active, answered } = await listIntentions();
  const empty = active.length === 0 && answered.length === 0;

  const description = empty
    ? "The people and needs you are praying for."
    : `${active.length} ${active.length === 1 ? "intention" : "intentions"} you are praying for${
        answered.length > 0 ? `, ${answered.length} answered` : ""
      }.`;

  return (
    <>
      <PageHeader
        title="Intentions"
        description={description}
        actions={
          <AppButton href="/intentions/new">
            <Plus aria-hidden /> New
          </AppButton>
        }
      />

      {empty ? (
        <EmptyState
          icon={HandHeart}
          title="No intentions yet"
          description="Write down the people and needs you are praying for, and mark them answered when God answers. Only you can see them."
          action={<AppButton href="/intentions/new">Add an intention</AppButton>}
        />
      ) : (
        <div className="flex flex-col gap-8 md:gap-10">
          <section aria-labelledby="praying-heading">
            {/* Focusable by script only: it receives focus when a card leaves this list. */}
            <h2 id="praying-heading" tabIndex={-1} className={`mb-4 outline-none ${SECTION_HEADING}`}>
              Praying for
            </h2>
            {active.length > 0 ? (
              <ul className={LIST}>
                {active.map((i, n) => (
                  <IntentionItem key={i.id} intention={i} index={n} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-4 rounded-3xl bg-card p-6">
                <p className="text-base text-muted-foreground">Nothing open right now. Add a new intention when you are ready.</p>
                <AppButton href="/intentions/new" variant="outline">
                  <Plus aria-hidden /> New intention
                </AppButton>
              </div>
            )}
          </section>

          {answered.length > 0 && (
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
                <h2 className={SECTION_HEADING}>
                  Answered <span className="text-muted-foreground">({answered.length})</span>
                </h2>
                <ChevronDown aria-hidden className="size-6 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <ul className={`mt-4 ${LIST}`}>
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
