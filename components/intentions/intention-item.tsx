"use client";

import { useEffect, useId, useOptimistic, useRef, useState } from "react";
import { Check, ChevronDown, HandHeart, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { StaggerItem } from "@/components/motion/stagger-item";
import { LocalDate } from "@/components/local-date";
import { PrayerBody } from "@/components/prayers/prayer-body";
import { SubmitButton } from "@/components/submit-button";
import { deleteIntention, setIntentionAnswered } from "@/lib/intentions/actions";
import type { Intention } from "@/lib/intentions/queries";
import { withToast } from "@/lib/with-toast";

const setAnswered = withToast(setIntentionAnswered, (fd) =>
  fd.get("answered") === "true" ? "Moved to Answered" : "Moved back to Praying for",
);
const remove = withToast(deleteIntention, "Intention removed");

/** A short plain-text name for the intention, so repeated buttons are told apart by assistive tech. */
function plainSnippet(markdown: string) {
  const text = markdown
    .replace(/^\s*(?:[-+*]|\d+\.|>|#{1,6})\s+/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 40 ? `${text.slice(0, 40).trimEnd()}…` : text;
}

/** Tall enough for a short petition to show whole; longer ones fold behind "Read more". */
const COLLAPSED_MAX = "max-h-56";

export function IntentionItem({ intention, index = 0 }: { intention: Intention; index?: number }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Flips the card the instant the button is pressed, until the server confirms and the card moves lists.
  const [answered, setOptimisticAnswered] = useOptimistic(intention.is_answered);
  const settling = answered !== intention.is_answered;
  const Marker = answered ? Check : HandHeart;
  const name = plainSnippet(intention.text);

  // Long petitions fold to a fixed height so one card never towers over its neighbours. The full
  // text stays in the DOM; only overflow is hidden, and the toggle appears only when something is.
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => {
      // While expanded the clamp is off, so keep the last answer rather than re-measuring.
      if (!expanded) setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, intention.text]);
  const folded = overflowing && !expanded;

  // The pressed button leaves the page with the card, so hand focus to the list heading it came from.
  async function toggleAnswered(formData: FormData) {
    setOptimisticAnswered(!answered);
    await setAnswered(formData);
    document.getElementById("praying-heading")?.focus({ preventScroll: true });
  }

  return (
    <StaggerItem index={index} className="flex min-w-0 flex-col rounded-3xl bg-card p-5">
      {/* The same small arch as the prayer cards; it carries the state, and the line beside it says when. */}
      <div className="flex min-h-12 items-center gap-3">
        <span
          aria-hidden
          className={`ora-arch flex h-12 w-10 shrink-0 items-end justify-center rounded-b-lg bg-accent pb-2 text-gold-foreground dark:text-gold ${settling ? "ora-glow" : ""}`}
        >
          <Marker className="size-5" />
        </span>
        <p className="min-h-5 text-sm text-muted-foreground">
          {answered && intention.answered_at ? (
            <LocalDate iso={intention.answered_at} prefix="Answered " />
          ) : answered ? (
            "Answered"
          ) : (
            <LocalDate iso={intention.created_at} prefix="Added " />
          )}
        </p>
      </div>

      <div className="relative mt-4 flex-1">
        <div
          id={bodyId}
          ref={bodyRef}
          className={`break-words ${expanded ? "" : `${COLLAPSED_MAX} overflow-hidden`}`}
        >
          <PrayerBody body={intention.text} />
        </div>
        {folded ? (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
        ) : null}
        {overflowing ? (
          <AppButton
            variant="ghost"
            className="-ml-3 mt-1"
            aria-expanded={expanded}
            aria-controls={bodyId}
            aria-label={`${expanded ? "Show less" : "Read more"}: ${name}`}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronDown aria-hidden className={expanded ? "rotate-180" : ""} />
          </AppButton>
        ) : null}
      </div>

      {/* Quiet actions: the petition leads, and Delete sits alone at the far edge, away from Edit. */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="-ml-3 flex items-center gap-1">
          <form action={toggleAnswered}>
            <input type="hidden" name="id" value={intention.id} />
            <input type="hidden" name="answered" value={String(!answered)} />
            <SubmitButton variant="ghost" aria-label={`${answered ? "Reopen" : "Mark answered"}: ${name}`}>
              {answered ? <RotateCcw aria-hidden /> : <Check aria-hidden />}
              {answered ? "Reopen" : "Mark answered"}
            </SubmitButton>
          </form>
          {answered ? null : (
            <AppButton href={`/intentions/${intention.id}/edit`} variant="ghost" size="icon" aria-label={`Edit intention: ${name}`}>
              <Pencil aria-hidden />
            </AppButton>
          )}
        </div>
        <AppButton
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          aria-label={`Remove intention: ${name}`}
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 aria-hidden />
        </AppButton>
      </div>

      <ConfirmationSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        variant="destructive"
        title="Remove this intention?"
        description="It will be taken out of your prayers for good."
        cancelLabel="Keep it"
        confirmLabel="Remove"
        pendingLabel="Removing…"
        action={remove}
        fields={{ id: intention.id }}
      />
    </StaggerItem>
  );
}
