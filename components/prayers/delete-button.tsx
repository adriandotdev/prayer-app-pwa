"use client";

import { useState } from "react";

import { AppButton } from "@/components/app-button";
import { deletePrayer } from "@/lib/prayers/actions";

export function DeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <AppButton variant="outline" onClick={() => setConfirming(true)}>
        Delete
      </AppButton>
    );
  }
  return (
    <form action={deletePrayer} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <AppButton type="submit" className="bg-destructive text-white hover:bg-destructive/90">
        Confirm delete
      </AppButton>
      <AppButton variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </AppButton>
    </form>
  );
}
