"use client";

import { useActionState } from "react";

import { AppButton } from "@/components/app-button";
import { FIELD } from "@/components/field";
import type { CollectionFormState } from "@/lib/collections/actions";

const initial: CollectionFormState = { status: "idle" };

type Props = {
  action: (prev: CollectionFormState, formData: FormData) => Promise<CollectionFormState>;
  cancelHref: string;
  submitLabel: string;
  collection?: { id: string; name: string };
};

export function CollectionForm({ action, cancelHref, submitLabel, collection }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {collection ? <input type="hidden" name="id" value={collection.id} /> : null}

      <label htmlFor="name" className="text-sm font-medium">
        Name
      </label>
      <input
        id="name"
        name="name"
        defaultValue={collection?.name}
        maxLength={100}
        required
        autoFocus={!collection}
        enterKeyHint="done"
        autoComplete="off"
        className={`${FIELD} min-h-14`}
      />

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
