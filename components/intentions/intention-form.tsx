"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { ChevronLeft } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { FormSaveBar } from "@/components/form-save-bar";
import type { IntentionFormState } from "@/lib/intentions/actions";
import { cn } from "@/lib/utils";

// Tiptap is heavy and only needed on this form, so keep it out of the shared bundle.
const MarkdownEditor = dynamic(() => import("@/components/prayers/markdown-editor").then((m) => m.MarkdownEditor), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-2xl bg-muted" aria-hidden />,
});

const initial: IntentionFormState = { status: "idle" };

// An intention is mostly a name and a sentence, so the toolbar keeps only the basics.
const TOOLS = ["Bold", "Italic", "Bullet list"];

export const INTENTION_DRAFT_KEY = "ora:intention-draft";
const MAX_LENGTH = 2000;
const EDITOR_ID = "text";
const SHOW_COUNT_FROM = 1800;

type Props = {
  title: string;
  action: (prev: IntentionFormState, formData: FormData) => Promise<IntentionFormState>;
  submitLabel: string;
  intention?: { id: string; text: string };
};

export function IntentionForm({ title, action, submitLabel, intention }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initial);
  const [text, setText] = useState(intention?.text ?? "");
  const [emptyError, setEmptyError] = useState(false);
  const [restored, setRestored] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  // The editor takes its starting text once, so it waits for the saved draft to be looked up first.
  const [draftChecked, setDraftChecked] = useState(Boolean(intention));
  const [startText, setStartText] = useState(intention?.text ?? "");
  const formId = useId();

  const headingId = useId();
  const hintId = useId();
  const errorId = useId();

  const isNew = !intention;
  // A new intention is kept as a draft on this device, so leaving never costs anything. Edits are
  // to something already saved, so those still ask before they are dropped.
  const dirty = !isNew && text.trim() !== intention.text.trim();

  // Read after hydration (the server has no draft), outside the effect body so it is not a cascading render.
  useEffect(() => {
    if (!isNew) return;
    let live = true;
    queueMicrotask(() => {
      try {
        const draft = localStorage.getItem(INTENTION_DRAFT_KEY);
        if (live && draft?.trim()) {
          setText(draft);
          setStartText(draft);
          setRestored(true);
        }
      } catch {
        // Storage can be blocked; the draft is a convenience.
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

  function change(value: string) {
    setText(value);
    setEmptyError(false);
    setRestored(false);
    if (!isNew) return;
    try {
      if (value.trim()) localStorage.setItem(INTENTION_DRAFT_KEY, value);
      else localStorage.removeItem(INTENTION_DRAFT_KEY);
    } catch {
      // Storage can be blocked; the draft is a convenience.
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    if (text.trim()) return;
    e.preventDefault();
    setEmptyError(true);
    document.getElementById(EDITOR_ID)?.focus();
  }

  // Captured so the editor's own Mod-Enter (a hard break) never sees it.
  function keyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.closest("form")?.requestSubmit();
    }
  }

  const leave = () => (dirty ? setLeaveOpen(true) : router.push("/intentions"));

  const message = emptyError ? "Write your intention first." : state.status === "error" ? state.message : undefined;
  const showCount = text.length >= SHOW_COUNT_FROM;

  return (
    <>
      <AppButton variant="ghost" onClick={leave} className="-ml-3 mb-4 text-muted-foreground">
        <ChevronLeft aria-hidden /> Intentions
      </AppButton>

      <div className="mb-6 md:mb-8">
        <h1 id={headingId} className="text-balance text-[2.5rem] leading-[1.05] font-medium tracking-[-0.02em] md:text-5xl">
          {title}
        </h1>
        {/* One point of gold, drawn once: the room lights up before the words begin. */}
        <div aria-hidden className="ora-rule mt-4 h-px w-16 bg-gold" />
        <p id={hintId} className="mt-4 max-w-prose text-base text-muted-foreground md:text-lg">
          A name, a need, a few words. Only you can see it.
        </p>
      </div>

      <form id={formId} action={formAction} onSubmit={submit} noValidate className="flex flex-col gap-3 pb-24 md:pb-0">
        {intention ? <input type="hidden" name="id" value={intention.id} /> : null}

        <div onKeyDownCapture={keyDown}>
          {draftChecked ? (
            <MarkdownEditor
              name="text"
              id={EDITOR_ID}
              label={title}
              defaultValue={startText}
              autoFocus={isNew}
              tools={TOOLS}
              onMarkdownChange={change}
              describedBy={cn(hintId, message && errorId)}
              invalid={Boolean(message)}
              className="min-h-40"
            />
          ) : (
            <div className="h-56 animate-pulse rounded-2xl bg-muted" aria-hidden />
          )}
        </div>

        <div className="flex min-h-6 items-start justify-between gap-4 text-sm">
          <div aria-live="polite" className="min-w-0">
            {message ? (
              <p id={errorId} role="alert" className="text-base text-destructive">
                {message}
              </p>
            ) : restored ? (
              <p className="text-base text-muted-foreground">Picked up where you left off.</p>
            ) : null}
          </div>
          {showCount ? (
            <p className="shrink-0 tabular-nums text-muted-foreground">
              {text.length} / {MAX_LENGTH}
            </p>
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
        onConfirm={() => router.push("/intentions")}
      />
    </>
  );
}
