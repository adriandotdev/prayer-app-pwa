"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Pops once when a prayer becomes a favorite; stays still on first render and when unfavoriting. */
export function FavoriteHeart({ isFavorite }: { isFavorite: boolean }) {
  const [prev, setPrev] = useState(isFavorite);
  const [pop, setPop] = useState(false);
  if (prev !== isFavorite) {
    setPrev(isFavorite);
    setPop(isFavorite);
  }

  return (
    <Heart
      key={pop ? "pop" : "still"}
      className={cn(isFavorite && "fill-current text-gold-foreground dark:text-gold", pop && "ora-pop")}
      aria-hidden
    />
  );
}
