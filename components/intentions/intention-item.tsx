"use client";

import { useState } from "react";
import { Check, RotateCcw, Trash2 } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { StaggerItem } from "@/components/motion/stagger-item";
import { LocalDate } from "@/components/local-date";
import { SubmitButton } from "@/components/submit-button";
import { deleteIntention, setIntentionAnswered } from "@/lib/intentions/actions";
import type { Intention } from "@/lib/intentions/queries";
import { withToast } from "@/lib/with-toast";

const setAnswered = withToast(setIntentionAnswered, (fd) => (fd.get("answered") === "true" ? "Marked as answered" : "Reopened"));
const remove = withToast(deleteIntention, "Intention deleted");

export function IntentionItem({ intention, index = 0 }: { intention: Intention; index?: number }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const answered = intention.is_answered;

  return (
    <StaggerItem index={index} className="rounded-2xl border border-border bg-card p-4">
      <p className="prayer-text whitespace-pre-line break-words">{intention.text}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {answered && intention.answered_at ? (
          <LocalDate iso={intention.answered_at} prefix="Answered " />
        ) : (
          <LocalDate iso={intention.created_at} prefix="Added " />
        )}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <form action={setAnswered} className="flex-1">
          <input type="hidden" name="id" value={intention.id} />
          <input type="hidden" name="answered" value={String(!answered)} />
          <SubmitButton variant="outline" className="w-full">
            {answered ? <RotateCcw aria-hidden /> : <Check aria-hidden />}
            {answered ? "Reopen" : "Mark answered"}
          </SubmitButton>
        </form>
        {answered ? null : (
          <AppButton href={`/intentions/${intention.id}/edit`} variant="outline">
            Edit
          </AppButton>
        )}
        <AppButton variant="ghost" size="icon" aria-label="Delete intention" onClick={() => setConfirmOpen(true)}>
          <Trash2 aria-hidden />
        </AppButton>
      </div>

      <ConfirmationSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="destructive"
        title="Delete this intention?"
        description="This intention will be permanently removed. This action cannot be undone."
        cancelLabel="Keep intention"
        confirmLabel="Delete intention"
        pendingLabel="Deleting…"
        action={remove}
        fields={{ id: intention.id }}
      />
    </StaggerItem>
  );
}
