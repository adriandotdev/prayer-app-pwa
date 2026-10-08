import { AppButton } from "@/components/app-button";
import { FavoriteHeart } from "@/components/prayers/favorite-heart";
import { toggleFavorite } from "@/lib/prayers/actions";

export function FavoriteButton({ id, isFavorite, className }: { id: string; isFavorite: boolean; className?: string }) {
  return (
    <form action={toggleFavorite} className={className}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="favorite" value={String(!isFavorite)} />
      <AppButton
        type="submit"
        variant="ghost"
        size="icon"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
      >
        <FavoriteHeart isFavorite={isFavorite} />
      </AppButton>
    </form>
  );
}
