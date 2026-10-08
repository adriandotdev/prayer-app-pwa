"use client";

import { useActionState } from "react";

import { AppButton } from "@/components/app-button";
import { updateProfile, type ProfileState } from "@/app/profile/actions";

const initial: ProfileState = { status: "idle" };

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="displayName" className="text-sm font-medium">
        Display name
      </label>
      <input
        id="displayName"
        name="displayName"
        defaultValue={displayName}
        maxLength={60}
        autoComplete="name"
        className="min-h-14 rounded-xl border border-border bg-background px-4 text-base outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      {state.status === "saved" && (
        <p role="status" className="text-sm text-muted-foreground">
          Saved.
        </p>
      )}
      <AppButton type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </AppButton>
    </form>
  );
}
