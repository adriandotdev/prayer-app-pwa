"use client";

import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { clearDeviceData } from "@/lib/device-data";
import { toast } from "@/lib/toast";
import type { ActionResult } from "@/lib/action-result";

const ROW =
  "flex min-h-14 w-full items-center gap-3 rounded-3xl bg-card px-5 py-3 text-left transition-colors duration-200 hover:bg-secondary active:bg-accent";

/** Download a copy of the account's data, or delete the account for good. */
export function YourData({ deleteAction }: { deleteAction: () => Promise<ActionResult> }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteAction();
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      // Only forget device data once the account is really gone, so a failed delete keeps
      // any Rosary sessions still waiting to sync.
      clearDeviceData();
      setOpen(false);
      toast.success("Your account and data were deleted.");
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <a href="/api/export" download className={ROW}>
        <Download className="size-5 text-gold" aria-hidden />
        <span className="flex-1">
          <span className="block font-medium">Download your data</span>
          <span className="block text-sm text-muted-foreground">
            Prayers, collections, intentions and Rosary history as a JSON file
          </span>
        </span>
      </a>
      <button type="button" className={ROW} onClick={() => setOpen(true)}>
        <Trash2 className="size-5 text-destructive" aria-hidden />
        <span className="flex-1">
          <span className="block font-medium text-destructive">Delete account</span>
          <span className="block text-sm text-muted-foreground">Permanently erase your account and everything in it</span>
        </span>
      </button>
      <ConfirmationSheet
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title="Delete your account?"
        description="This permanently erases your account, saved prayers, collections, favorites, intentions and Rosary history. It cannot be undone. You can download your data first."
        cancelLabel="Keep my account"
        confirmLabel="Delete everything"
        pendingLabel="Deleting…"
        isPending={pending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
