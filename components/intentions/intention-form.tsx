"use client";

import { useActionState } from "react";

import { AppButton } from "@/components/app-button";
import { FIELD } from "@/components/field";
import type { IntentionFormState } from "@/lib/intentions/actions";

const initial: IntentionFormState = { status: "idle" };

type Props = {
  action: (prev: IntentionFormState, formData: FormData) => Promise<IntentionFormState>;
  submitLabel: string;
  intention?: { id: string; text: string };
};

export function IntentionForm({ action, submitLabel, intention }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {intention ? <input type="hidden" name="id" value={intention.id} /> : null}

      <label htmlFor="text" className="text-sm font-medium">
        Who or what are you praying for?
      </label>
      <textarea id="text" name="text" defaultValue={intention?.text} rows={6} maxLength={2000} required autoFocus={!intention} className={`${FIELD} prayer-text py-3`} />

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
