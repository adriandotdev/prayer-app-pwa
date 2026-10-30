"use client";

import dynamic from "next/dynamic";
import { useActionState } from "react";

import { AppButton } from "@/components/app-button";
import { FIELD } from "@/components/field";
import type { PrayerFormState } from "@/lib/prayers/actions";

// Tiptap is heavy and only needed on this form, so keep it out of the shared bundle.
const MarkdownEditor = dynamic(() => import("@/components/prayers/markdown-editor").then((m) => m.MarkdownEditor), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-2xl bg-muted" aria-hidden />,
});

const initial: PrayerFormState = { status: "idle" };

type Props = {
  action: (prev: PrayerFormState, formData: FormData) => Promise<PrayerFormState>;
  cancelHref: string;
  submitLabel: string;
  prayer?: { id: string; title: string; body: string; source: string | null };
};

export function PrayerForm({ action, cancelHref, submitLabel, prayer }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-3xl bg-card p-5 md:p-8">
      {prayer ? <input type="hidden" name="id" value={prayer.id} /> : null}

      <label htmlFor="title" className="text-base font-medium">
        Title
      </label>
      <input id="title" name="title" defaultValue={prayer?.title} maxLength={200} required enterKeyHint="next" autoComplete="off" className={`${FIELD} min-h-14`} />

      <label htmlFor="body" className="mt-2 text-base font-medium">
        Prayer
      </label>
      <MarkdownEditor defaultValue={prayer?.body} />
      <p className="text-sm text-muted-foreground">Line breaks are kept. Supports **bold**, *italic*, ## headings, - lists, 1. numbered lists and &gt; quotes.</p>

      <label htmlFor="source" className="mt-2 text-base font-medium">
        Source <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <input id="source" name="source" defaultValue={prayer?.source ?? ""} maxLength={200} enterKeyHint="done" autoComplete="off" className={`${FIELD} min-h-14`} />

      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      <div className="mt-2 flex gap-3">
        <AppButton type="submit" pending={pending} pendingLabel="Saving…" className="flex-1">
          {submitLabel}
        </AppButton>
        <AppButton href={cancelHref} variant="outline">
          Cancel
        </AppButton>
      </div>
    </form>
  );
}
