"use client";

import { useState } from "react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { deletePrayer } from "@/lib/prayers/actions";

export function DeleteButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppButton variant="outline" className="flex-1 sm:flex-none" onClick={() => setOpen(true)}>
        Delete
      </AppButton>
      <ConfirmationSheet
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title="Delete this prayer?"
        description="This prayer will be permanently removed from your collection. This action cannot be undone."
        cancelLabel="Keep prayer"
        confirmLabel="Delete prayer"
        pendingLabel="Deleting…"
        action={deletePrayer}
        fields={{ id }}
      />
    </>
  );
}
