"use client";

import { useOptimistic } from "react";

import { AppButton } from "@/components/app-button";
import { FavoriteHeart } from "@/components/prayers/favorite-heart";
import { toggleFavorite } from "@/lib/prayers/actions";
import { withToast } from "@/lib/with-toast";

const toggle = withToast(toggleFavorite, (fd) => (fd.get("favorite") === "true" ? "Added to favorites" : "Removed from favorites"));

export function FavoriteButton({ id, isFavorite, className }: { id: string; isFavorite: boolean; className?: string }) {
  // Flips instantly; React reverts to the server value if the action fails.
  const [optimistic, setOptimistic] = useOptimistic(isFavorite, (_, next: boolean) => next);

  async function action(formData: FormData) {
    setOptimistic(formData.get("favorite") === "true");
    await toggle(formData);
  }

  return (
    <form action={action} className={className}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="favorite" value={String(!optimistic)} />
      <AppButton
        type="submit"
        variant="ghost"
        size="icon"
        aria-label={optimistic ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={optimistic}
      >
        <FavoriteHeart isFavorite={optimistic} />
      </AppButton>
    </form>
  );
}
