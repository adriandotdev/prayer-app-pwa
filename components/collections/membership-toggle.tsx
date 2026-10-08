"use client";

import { Check, Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

import { setCollectionMembership } from "@/lib/collections/actions";
import { cn } from "@/lib/utils";
import { withToast } from "@/lib/with-toast";

function Row({ isMember, label, hint }: { isMember: boolean; label: string; hint?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      aria-pressed={isMember}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-2 text-left transition-colors active:bg-secondary",
        isMember ? "border-gold bg-gold/10" : "border-border bg-card hover:bg-secondary/50",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{label}</span>
        {hint ? <span className="block truncate text-sm text-muted-foreground">{hint}</span> : null}
      </span>
      {pending ? (
        <span aria-hidden className="mx-1.5 size-2 shrink-0 animate-pulse rounded-full bg-current" />
      ) : isMember ? (
        <Check className="size-5 shrink-0" aria-hidden />
      ) : (
        <Plus className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      )}
      <span className="sr-only">{isMember ? "In collection. Tap to remove." : "Not in collection. Tap to add."}</span>
    </button>
  );
}

/** A full-width row that adds or removes a prayer from a collection. Works without client JS. */
export function MembershipToggle({
  collectionId,
  prayerId,
  isMember,
  label,
  hint,
}: {
  collectionId: string;
  prayerId: string;
  isMember: boolean;
  label: string;
  hint?: string;
}) {
  const toggle = withToast(setCollectionMembership, (fd) => `${fd.get("member") === "true" ? "Added to" : "Removed from"} ${label}`);

  return (
    <li>
      <form action={toggle}>
        <input type="hidden" name="collectionId" value={collectionId} />
        <input type="hidden" name="prayerId" value={prayerId} />
        <input type="hidden" name="member" value={String(!isMember)} />
        <Row isMember={isMember} label={label} hint={hint} />
      </form>
    </li>
  );
}
