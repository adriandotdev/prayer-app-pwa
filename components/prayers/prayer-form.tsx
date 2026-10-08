"use client";

import { useActionState } from "react";

import { AppButton } from "@/components/app-button";
import type { PrayerFormState } from "@/lib/prayers/actions";

const initial: PrayerFormState = { status: "idle" };
const FIELD =
  "rounded-xl border border-border bg-background px-4 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type Props = {
  action: (prev: PrayerFormState, formData: FormData) => Promise<PrayerFormState>;
  cancelHref: string;
  submitLabel: string;
  prayer?: { id: string; title: string; body: string; source: string | null };
};

export function PrayerForm({ action, cancelHref, submitLabel, prayer }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {prayer ? <input type="hidden" name="id" value={prayer.id} /> : null}

      <label htmlFor="title" className="text-sm font-medium">
        Title
      </label>
      <input id="title" name="title" defaultValue={prayer?.title} maxLength={200} required enterKeyHint="next" autoComplete="off" className={`${FIELD} min-h-14`} />

      <label htmlFor="body" className="mt-2 text-sm font-medium">
        Prayer
      </label>
      <textarea id="body" name="body" defaultValue={prayer?.body} rows={12} required className={`${FIELD} prayer-text py-3`} />
      <p className="text-xs text-muted-foreground">Line breaks are kept. Use *italic* and **bold** if you need them.</p>

      <label htmlFor="source" className="mt-2 text-sm font-medium">
        Source <span className="font-normal text-muted-foreground">(optional)</span>
      </label>
      <input id="source" name="source" defaultValue={prayer?.source ?? ""} maxLength={200} enterKeyHint="done" autoComplete="off" className={`${FIELD} min-h-14`} />

      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      <div className="mt-2 flex gap-3">
        <AppButton type="submit" disabled={pending} className="flex-1">
          {pending ? "Saving…" : submitLabel}
        </AppButton>
        <AppButton href={cancelHref} variant="outline">
          Cancel
        </AppButton>
      </div>
    </form>
  );
}
