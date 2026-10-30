"use client";

import { useState } from "react";
import { Check, HandHeart, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { StaggerItem } from "@/components/motion/stagger-item";
import { LocalDate } from "@/components/local-date";
import { PrayerBody } from "@/components/prayers/prayer-body";
import { SubmitButton } from "@/components/submit-button";
import { deleteIntention, setIntentionAnswered } from "@/lib/intentions/actions";
import type { Intention } from "@/lib/intentions/queries";
import { withToast } from "@/lib/with-toast";

const setAnswered = withToast(setIntentionAnswered, (fd) => (fd.get("answered") === "true" ? "Marked as answered" : "Reopened"));
const remove = withToast(deleteIntention, "Intention deleted");

export function IntentionItem({ intention, index = 0 }: { intention: Intention; index?: number }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const answered = intention.is_answered;
  const Marker = answered ? Check : HandHeart;

  return (
    <StaggerItem index={index} className="flex min-w-0 flex-col rounded-3xl bg-card p-5">
      {/* The same small arch as the prayer cards; it carries the state so the card reads at a glance. */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="ora-arch flex h-12 w-10 shrink-0 items-end justify-center rounded-b-lg bg-accent pb-2 text-gold-foreground dark:text-gold"
        >
          <Marker className="size-5" />
        </span>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-gold-foreground dark:text-gold">{answered ? "Answered" : "Praying"}</span>
          <span aria-hidden> · </span>
          {answered && intention.answered_at ? (
            <LocalDate iso={intention.answered_at} />
          ) : (
            <LocalDate iso={intention.created_at} prefix="Added " />
          )}
        </p>
      </div>

      <div className={`mt-4 flex-1 break-words ${answered ? "opacity-80" : ""}`}>
        <PrayerBody body={intention.text} />
      </div>

      <div className="mt-5 flex items-center gap-1">
        <form action={setAnswered} className="flex-1">
          <input type="hidden" name="id" value={intention.id} />
          <input type="hidden" name="answered" value={String(!answered)} />
          <SubmitButton variant={answered ? "outline" : "primary"} className="w-full">
            {answered ? <RotateCcw aria-hidden /> : <Check aria-hidden />}
            {answered ? "Reopen" : "Mark answered"}
          </SubmitButton>
        </form>
        {answered ? null : (
          <AppButton href={`/intentions/${intention.id}/edit`} variant="ghost" size="icon" aria-label="Edit intention">
            <Pencil aria-hidden />
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
