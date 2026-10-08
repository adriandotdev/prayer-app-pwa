"use client";

import { X } from "lucide-react";

import { SubmitButton } from "@/components/submit-button";
import { setCollectionMembership } from "@/lib/collections/actions";
import { withToast } from "@/lib/with-toast";

const remove = withToast(setCollectionMembership, "Removed from collection");

export function RemoveFromCollectionButton({ collectionId, prayerId }: { collectionId: string; prayerId: string }) {
  return (
    <form action={remove}>
      <input type="hidden" name="collectionId" value={collectionId} />
      <input type="hidden" name="prayerId" value={prayerId} />
      <input type="hidden" name="member" value="false" />
      <SubmitButton variant="ghost" size="icon" pendingLabel={null} aria-label="Remove from collection">
        <X aria-hidden />
      </SubmitButton>
    </form>
  );
}
