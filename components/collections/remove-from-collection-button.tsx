import { X } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { setCollectionMembership } from "@/lib/collections/actions";

export function RemoveFromCollectionButton({ collectionId, prayerId }: { collectionId: string; prayerId: string }) {
  return (
    <form action={setCollectionMembership}>
      <input type="hidden" name="collectionId" value={collectionId} />
      <input type="hidden" name="prayerId" value={prayerId} />
      <input type="hidden" name="member" value="false" />
      <AppButton type="submit" variant="ghost" size="icon" aria-label="Remove from collection">
        <X aria-hidden />
      </AppButton>
    </form>
  );
}
