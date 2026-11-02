"use client";

import { useState } from "react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { deleteCollection } from "@/lib/collections/actions";

export function DeleteCollectionButton({ id }: { id: string }) {
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
        title="Delete this collection?"
        description="The collection will be removed. The prayers inside it are kept in your library."
        cancelLabel="Keep collection"
        confirmLabel="Delete collection"
        pendingLabel="Deleting…"
        action={deleteCollection}
        fields={{ id }}
      />
    </>
  );
}
