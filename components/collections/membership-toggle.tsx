import { Check, Plus } from "lucide-react";

import { setCollectionMembership } from "@/lib/collections/actions";
import { cn } from "@/lib/utils";

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
  return (
    <li>
      <form action={setCollectionMembership}>
        <input type="hidden" name="collectionId" value={collectionId} />
        <input type="hidden" name="prayerId" value={prayerId} />
        <input type="hidden" name="member" value={String(!isMember)} />
        <button
          type="submit"
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
          {isMember ? <Check className="size-5 shrink-0" aria-hidden /> : <Plus className="size-5 shrink-0 text-muted-foreground" aria-hidden />}
          <span className="sr-only">{isMember ? "In collection. Tap to remove." : "Not in collection. Tap to add."}</span>
        </button>
      </form>
    </li>
  );
}
