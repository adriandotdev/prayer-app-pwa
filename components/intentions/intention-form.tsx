"use client";

import dynamic from "next/dynamic";
import { useActionState } from "react";

import { AppButton } from "@/components/app-button";
import type { IntentionFormState } from "@/lib/intentions/actions";

// Tiptap is heavy and only needed on this form, so keep it out of the shared bundle.
const MarkdownEditor = dynamic(() => import("@/components/prayers/markdown-editor").then((m) => m.MarkdownEditor), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-2xl bg-muted" aria-hidden />,
});

const initial: IntentionFormState = { status: "idle" };

type Props = {
  action: (prev: IntentionFormState, formData: FormData) => Promise<IntentionFormState>;
  submitLabel: string;
  intention?: { id: string; text: string };
};

export function IntentionForm({ action, submitLabel, intention }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-3xl bg-card p-5 md:p-8">
      {intention ? <input type="hidden" name="id" value={intention.id} /> : null}

      <label htmlFor="text" className="text-base font-medium">
        Who or what are you praying for?
      </label>
      <MarkdownEditor name="text" id="text" label="Intention" defaultValue={intention?.text} autoFocus={!intention} className="min-h-40" />
      <p className="text-sm text-muted-foreground">Line breaks are kept. Supports **bold**, *italic*, - lists, 1. numbered lists and &gt; quotes.</p>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      <div className="mt-2 flex gap-3">
        <AppButton type="submit" pending={pending} pendingLabel="Saving…" className="flex-1">
          {submitLabel}
        </AppButton>
        <AppButton href="/intentions" variant="outline">
          Cancel
        </AppButton>
      </div>
    </form>
  );
}
