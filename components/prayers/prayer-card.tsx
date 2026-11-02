import Link from "next/link";
import type { ReactNode } from "react";

import { StaggerItem } from "@/components/motion/stagger-item";
import { FavoriteButton } from "@/components/prayers/favorite-button";
import { previewLine } from "@/components/prayers/prayer-body";
import { PrayerArt } from "@/components/prayers/prayer-art";
import type { Prayer } from "@/lib/prayers/queries";

export function PrayerCard({
  prayer,
  isFavorite,
  actions,
  index = 0,
}: {
  prayer: Prayer;
  isFavorite: boolean;
  actions?: ReactNode;
  index?: number;
}) {
  return (
    <StaggerItem
      index={index}
      className="ora-press flex min-w-0 items-center gap-1 rounded-3xl bg-card pr-2 transition-colors duration-200 hover:bg-secondary active:bg-secondary"
    >
      <Link
        href={`/prayers/${prayer.id}`}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-ring"
      >
        {/* A small arch, like a chapel window, holds the line art. */}
        <span className="ora-arch flex h-[4.5rem] w-14 shrink-0 items-end justify-center rounded-b-xl bg-accent pb-3 text-gold-foreground dark:text-gold">
          <PrayerArt id={prayer.id} title={prayer.title} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-2xl leading-tight">{prayer.title}</span>
          <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{previewLine(prayer.body)}</span>
          <span className="mt-2 block text-sm text-gold-foreground dark:text-gold">{prayer.user_id ? "Mine" : "Starter"}</span>
        </span>
      </Link>
      <FavoriteButton id={prayer.id} isFavorite={isFavorite} />
      {actions}
    </StaggerItem>
  );
}
