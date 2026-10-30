"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { ChevronLeft } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { PageHeader } from "@/components/layout/page-header";
import type { IntentionFormState } from "@/lib/intentions/actions";

// Tiptap is heavy and only needed on this form, so keep it out of the shared bundle.
const MarkdownEditor = dynamic(() => import("@/components/prayers/markdown-editor").then((m) => m.MarkdownEditor), {
  ssr: false,
  loading: () => <div className="h-56 animate-pulse rounded-2xl bg-muted" aria-hidden />,
});

const initial: IntentionFormState = { status: "idle" };

// An intention is mostly a name and a sentence, so the toolbar keeps only the basics.
const TOOLS = ["Bold", "Italic", "Bullet list"];
const QUESTION = "Who or what are you praying for?";

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
  const [leaveOpen, setLeaveOpen] = useState(false);

  const dirty = text.trim() !== (intention?.text ?? "").trim();
  const leave = () => (dirty ? setLeaveOpen(true) : router.push("/intentions"));

  return (
    <>
      <AppButton variant="ghost" onClick={leave} className="-ml-3 mb-2 text-muted-foreground">
        <ChevronLeft aria-hidden /> Intentions
      </AppButton>
      <PageHeader title={title} />

      <form action={formAction} className="flex flex-col gap-3 rounded-3xl bg-card p-5 md:p-8">
        {intention ? <input type="hidden" name="id" value={intention.id} /> : null}

        <label htmlFor="text" className="text-base font-medium">
          {QUESTION}
        </label>
        <MarkdownEditor
          name="text"
          id="text"
          label={QUESTION}
          defaultValue={intention?.text}
          autoFocus={!intention}
          tools={TOOLS}
          onMarkdownChange={setText}
          className="min-h-40"
        />
        <p className="text-sm text-muted-foreground">A name, a need, a few words. Only you can see it.</p>

        {state.status === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
        <div className="mt-2 flex gap-3">
          <AppButton type="submit" pending={pending} pendingLabel="Saving…" className="flex-1">
            {submitLabel}
          </AppButton>
          <AppButton variant="outline" onClick={leave}>
            Cancel
          </AppButton>
        </div>
      </form>

      <ConfirmationSheet
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        variant="destructive"
        title="Leave without saving?"
        description="What you have written will be lost."
        cancelLabel="Keep writing"
        confirmLabel="Leave"
        onConfirm={() => router.push("/intentions")}
      />
    </>
  );
}
