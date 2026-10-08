"use client";

import { FavoriteHeart } from "@/components/prayers/favorite-heart";
import { SubmitButton } from "@/components/submit-button";
import { toggleFavorite } from "@/lib/prayers/actions";
import { withToast } from "@/lib/with-toast";

const toggle = withToast(toggleFavorite, (fd) => (fd.get("favorite") === "true" ? "Added to favorites" : "Removed from favorites"));

export function FavoriteButton({ id, isFavorite, className }: { id: string; isFavorite: boolean; className?: string }) {
  return (
    <form action={toggle} className={className}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="favorite" value={String(!isFavorite)} />
      <SubmitButton
        variant="ghost"
        size="icon"
        pendingLabel={null}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
      >
        <FavoriteHeart isFavorite={isFavorite} />
      </SubmitButton>
    </form>
  );
}
