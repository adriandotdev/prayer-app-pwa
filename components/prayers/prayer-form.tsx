"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { ChevronLeft } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { FIELD } from "@/components/field";
import { FormSaveBar } from "@/components/form-save-bar";
import type { PrayerField, PrayerFormState } from "@/lib/prayers/actions";
import { cn } from "@/lib/utils";

// Tiptap is heavy and only needed on this form, so keep it out of the shared bundle.
const MarkdownEditor = dynamic(() => import("@/components/prayers/markdown-editor").then((m) => m.MarkdownEditor), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" aria-hidden />,
});

const initial: PrayerFormState = { status: "idle" };

export const PRAYER_DRAFT_KEY = "ora:prayer-draft";
const MAX_BODY = 20000;
const SHOW_COUNT_FROM = 18000;

type Draft = { title: string; body: string; source: string };

type Props = {
  title: string;
  backHref: string;
  backLabel: string;
  action: (prev: PrayerFormState, formData: FormData) => Promise<PrayerFormState>;
  submitLabel: string;
  prayer?: { id: string; title: string; body: string; source: string | null };
};

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(PRAYER_DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<Draft>;
    const draft = { title: String(d.title ?? ""), body: String(d.body ?? ""), source: String(d.source ?? "") };
    return draft.title.trim() || draft.body.trim() ? draft : null;
  } catch {
    // Storage can be blocked or hold something unreadable; the draft is a convenience.
    return null;
  }
}

function writeDraft(draft: Draft) {
  try {
    if (draft.title.trim() || draft.body.trim() || draft.source.trim()) localStorage.setItem(PRAYER_DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(PRAYER_DRAFT_KEY);
  } catch {
    // Storage can be blocked; the draft is a convenience.
  }
}

export function PrayerForm({ title: heading, backHref, backLabel, action, submitLabel, prayer }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initial);
  const isNew = !prayer;

  const [titleValue, setTitleValue] = useState(prayer?.title ?? "");
  const [body, setBody] = useState(prayer?.body ?? "");
  const [source, setSource] = useState(prayer?.source ?? "");
  const [clientError, setClientError] = useState<{ field: PrayerField; message: string } | null>(null);
  // A server error stays until the person changes something, then it has done its job.
  const [dismissed, setDismissed] = useState<PrayerFormState | null>(null);
  const [restored, setRestored] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  // The editor takes its starting text once, so it waits for the saved draft to be looked up first.
  const [draftChecked, setDraftChecked] = useState(!isNew);
  const [startBody, setStartBody] = useState(prayer?.body ?? "");

  const formId = useId();
  const hintId = useId();
  const titleErrorId = useId();
  const bodyErrorId = useId();
  const sourceErrorId = useId();

  // A new prayer is kept as a draft on this device, so leaving never costs anything. Edits are to
  // something already saved, so those still ask before they are dropped.
  const dirty =
    !isNew &&
    (titleValue.trim() !== prayer.title.trim() || body.trim() !== prayer.body.trim() || source.trim() !== (prayer.source ?? "").trim());

  // Read after hydration (the server has no draft), outside the effect body so it is not a cascading render.
  useEffect(() => {
    if (!isNew) return;
    let live = true;
    queueMicrotask(() => {
      const draft = readDraft();
      if (live && draft) {
        setTitleValue(draft.title);
        setBody(draft.body);
        setStartBody(draft.body);
        setSource(draft.source);
        setRestored(true);
      }
      if (live) setDraftChecked(true);
    });
    return () => {
      live = false;
    };
  }, [isNew]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const serverError = state.status === "error" && state !== dismissed ? state : null;
  const error: { field?: PrayerField; message: string } | null = clientError ?? (serverError?.message ? { field: serverError.field, message: serverError.message } : null);

  // Send focus to the field that needs attention after a failed save.
  useEffect(() => {
    if (state.status === "error" && state.field) document.getElementById(state.field)?.focus();
  }, [state]);

  function edited(next: Draft) {
    setClientError(null);
    setDismissed(state);
    setRestored(false);
    if (isNew) writeDraft(next);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    const missing: { field: PrayerField; message: string } | null = !titleValue.trim()
      ? { field: "title", message: "Give your prayer a title." }
      : !body.trim()
        ? { field: "body", message: "Write the prayer text." }
        : null;
    if (!missing) return;
    e.preventDefault();
    setClientError(missing);
    document.getElementById(missing.field)?.focus();
  }

  // Captured so the editor's own Mod-Enter (a hard break) never sees it.
  function keyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.requestSubmit();
    }
  }

  const leave = () => (dirty ? setLeaveOpen(true) : router.push(backHref));
  const errorFor = (field: PrayerField) => (error?.field === field ? error.message : undefined);
  // Errors with no field (a failed save) sit above Save, where the eye already is.
  const generalError = error && !error.field ? error.message : undefined;
  const showCount = body.length >= SHOW_COUNT_FROM;

  return (
    <>
      <AppButton variant="ghost" onClick={leave} className="-ml-3 mb-4 text-muted-foreground">
        <ChevronLeft aria-hidden /> {backLabel}
      </AppButton>

      <div className="mb-6 md:mb-8">
        <h1 className="text-balance text-4xl leading-[1.05] font-medium tracking-[-0.02em] wrap-break-word md:text-5xl">{heading}</h1>
        {/* One point of gold, drawn once: the room lights up before the words begin. */}
        <div aria-hidden className="ora-rule mt-4 h-px w-16 bg-gold" />
      </div>

      <form
        id={formId}
        action={formAction}
        onSubmit={submit}
        onKeyDownCapture={keyDown}
        noValidate
        className="flex flex-col gap-3 pb-24 md:pb-0"
      >
        {prayer ? <input type="hidden" name="id" value={prayer.id} /> : null}

        <label htmlFor="title" className="text-base font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={titleValue}
          onChange={(e) => {
            setTitleValue(e.target.value);
            edited({ title: e.target.value, body, source });
          }}
          maxLength={200}
          required
          autoFocus={isNew}
          enterKeyHint="next"
          autoComplete="off"
          aria-invalid={errorFor("title") ? true : undefined}
          aria-describedby={errorFor("title") ? titleErrorId : undefined}
          className={`${FIELD} min-h-14`}
        />
        {errorFor("title") ? (
          <p id={titleErrorId} role="alert" className="text-base text-destructive">
            {errorFor("title")}
          </p>
        ) : null}

        {/* A label only focuses form controls, and the editor is a contenteditable surface. */}
        <label htmlFor="body" onClick={() => document.getElementById("body")?.focus()} className="mt-2 text-base font-medium">
          Prayer
        </label>
        {draftChecked ? (
          <MarkdownEditor
            defaultValue={startBody}
            onMarkdownChange={(next) => {
              setBody(next);
              edited({ title: titleValue, body: next, source });
            }}
            describedBy={cn(hintId, errorFor("body") && bodyErrorId)}
            invalid={Boolean(errorFor("body"))}
            className="min-h-56 md:min-h-80"
          />
        ) : (
          <div className="h-72 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" aria-hidden />
        )}
        <div className="flex items-start justify-between gap-4">
          <p id={hintId} className="text-sm text-muted-foreground">
            Line breaks are kept. Select text to format it.
          </p>
          {showCount ? (
            <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {body.length} / {MAX_BODY}
            </p>
          ) : null}
        </div>
        {errorFor("body") ? (
          <p id={bodyErrorId} role="alert" className="text-base text-destructive">
            {errorFor("body")}
          </p>
        ) : null}

        <label htmlFor="source" className="mt-2 text-base font-medium">
          Source <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="source"
          name="source"
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            edited({ title: titleValue, body, source: e.target.value });
          }}
          maxLength={200}
          enterKeyHint="done"
          autoComplete="off"
          aria-invalid={errorFor("source") ? true : undefined}
          aria-describedby={errorFor("source") ? sourceErrorId : undefined}
          className={`${FIELD} min-h-14`}
        />
        {errorFor("source") ? (
          <p id={sourceErrorId} role="alert" className="text-base text-destructive">
            {errorFor("source")}
          </p>
        ) : null}

        <div aria-live="polite" className="min-h-6">
          {generalError ? (
            <p role="alert" className="text-base text-destructive">
              {generalError}
            </p>
          ) : restored ? (
            <p className="text-base text-muted-foreground">Picked up where you left off.</p>
          ) : null}
        </div>
      </form>

      <FormSaveBar formId={formId} label={submitLabel} pending={pending} />

      <ConfirmationSheet
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Keep your changes?"
        description="You haven't saved them yet. Going back now will set them aside."
        cancelLabel="Keep editing"
        confirmLabel="Go back"
        onConfirm={() => router.push(backHref)}
      />
    </>
  );
}
