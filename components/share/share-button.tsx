"use client";

import { Check, Copy, Link2, Share2 } from "lucide-react";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState, useTransition } from "react";

import { AppButton } from "@/components/app-button";
import { ConfirmationSheet } from "@/components/confirmation-sheet";
import { createShare, revokeShare } from "@/lib/shares/actions";
import type { ShareKind } from "@/lib/shares/queries";
import { toast } from "@/lib/toast";
import { useSeason } from "@/lib/theme/use-season";

type Props = {
  kind: ShareKind;
  id: string;
  title: string;
  /** The item's link token when it is already shared. */
  token: string | null;
  className?: string;
};

/** Opens a sheet with a read-only public link: share it with the device's share sheet, copy it, or stop sharing. */
export function ShareButton({ kind, id, title, token: initialToken, className }: Props) {
  const [token, setToken] = useState(initialToken);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const { choice: season } = useSeason();
  const noun = kind === "prayer" ? "prayer" : "collection";

  // Set when the sheet opens (never during render), so server rendering doesn't touch `window`.
  const [origin, setOrigin] = useState("");
  const url = token ? `${origin}/s/${token}` : "";
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  function formData() {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("kind", kind);
    // The link shows the page in the sharer's colours; reopening it brings those up to date.
    fd.set("season", season);
    return fd;
  }

  function openSheet() {
    setOrigin(window.location.origin);
    if (token) {
      setOpen(true);
      void createShare(formData()).catch(() => {});
      return;
    }
    startTransition(async () => {
      const result = await createShare(formData());
      if (!result.ok) return toast.error(result.message);
      setToken(result.token);
      setOpen(true);
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
    } catch {
      // Clipboard blocked (insecure context, denied permission): select it so the user can copy by hand.
      inputRef.current?.select();
      toast.error("Couldn't copy. Select the link and copy it.");
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch (error) {
      // Dismissing the share sheet rejects with AbortError; that is not a failure.
      if (!(error instanceof DOMException && error.name === "AbortError")) toast.error("Couldn't open sharing. Copy the link instead.");
    }
  }

  function stopSharing() {
    startTransition(async () => {
      const result = await revokeShare(formData());
      if (!result.ok) return toast.error(result.message);
      setToken(null);
      setOpen(false);
      toast.success("Sharing stopped");
    });
  }

  return (
    <>
      <AppButton
        variant="outline"
        onClick={openSheet}
        pending={pending && !open}
        pendingLabel="Preparing…"
        className={className}
      >
        <Share2 aria-hidden /> Share
      </AppButton>

      <ConfirmationSheet
        open={open}
        onOpenChange={setOpen}
        title={`Share this ${noun}`}
        description={`Anyone with this link can read it, without signing in. They can't change it${
          kind === "collection" ? "" : " or see your other prayers"
        }.`}
        confirmLabel="Stop sharing"
        isPending={pending}
        onConfirm={stopSharing}
        footer={
          <div className="mt-6 flex flex-col gap-3">
            {/* The main action here is sending the link, so it leads; stopping is a quiet last resort. */}
            {canNativeShare ? (
              <AppButton size="lg" onClick={nativeShare} className="w-full">
                <Share2 aria-hidden /> Share…
              </AppButton>
            ) : null}
            <AppButton
              size={canNativeShare ? "md" : "lg"}
              variant={canNativeShare ? "outline" : "primary"}
              onClick={copy}
              className="w-full"
            >
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />} {copied ? "Copied" : "Copy link"}
            </AppButton>
            <div className="mt-1 flex items-center justify-between gap-3">
              <AppButton
                variant="ghost"
                onClick={stopSharing}
                pending={pending}
                pendingLabel="Stopping…"
                className="text-destructive"
              >
                Stop sharing
              </AppButton>
              <Dialog.Close asChild>
                <AppButton variant="ghost" disabled={pending}>
                  Done
                </AppButton>
              </Dialog.Close>
            </div>
          </div>
        }
      >
        <p className="mb-3 truncate font-heading text-lg text-foreground">{title}</p>
        <label htmlFor={`share-link-${id}`} className="sr-only">
          Link to this {noun}
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4">
          <Link2 aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          <input
            id={`share-link-${id}`}
            ref={inputRef}
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="min-h-12 w-full min-w-0 bg-transparent text-base outline-none"
          />
        </div>
      </ConfirmationSheet>
    </>
  );
}
