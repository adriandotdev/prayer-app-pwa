"use client";

import { useState } from "react";

import { AppButton } from "@/components/app-button";
import { deletePrayer } from "@/lib/prayers/actions";

export function DeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <AppButton variant="outline" className="flex-1 sm:flex-none" onClick={() => setConfirming(true)}>
        Delete
      </AppButton>
    );
  }
  return (
    <form action={deletePrayer} className="flex w-full items-center gap-2 sm:w-auto">
      <input type="hidden" name="id" value={id} />
      <AppButton type="submit" className="flex-1 bg-destructive text-white hover:bg-destructive/90">
        Confirm delete
      </AppButton>
      <AppButton variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </AppButton>
    </form>
  );
}
