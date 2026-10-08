import { Heart } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { toggleFavorite } from "@/lib/prayers/actions";
import { cn } from "@/lib/utils";

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
        <Heart className={cn(isFavorite && "fill-current text-gold-foreground dark:text-gold")} aria-hidden />
      </AppButton>
    </form>
  );
}
