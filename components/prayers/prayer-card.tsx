import Link from "next/link";

import { FavoriteButton } from "@/components/prayers/favorite-button";
import { previewLine } from "@/components/prayers/prayer-body";
import type { Prayer } from "@/lib/prayers/queries";

export function PrayerCard({ prayer, isFavorite }: { prayer: Prayer; isFavorite: boolean }) {
  return (
    <li className="flex items-center gap-1 rounded-2xl border border-border bg-card pr-2 transition-colors hover:bg-secondary/50">
      <Link href={`/prayers/${prayer.id}`} className="min-w-0 flex-1 rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-ring">
        <span className="block truncate font-display text-xl">{prayer.title}</span>
        <span className="mt-1 block truncate text-sm text-muted-foreground">{previewLine(prayer.body)}</span>
        <span className="mt-2 block text-xs text-muted-foreground">{prayer.user_id ? "Mine" : "Starter"}</span>
      </Link>
      <FavoriteButton id={prayer.id} isFavorite={isFavorite} />
    </li>
  );
}
