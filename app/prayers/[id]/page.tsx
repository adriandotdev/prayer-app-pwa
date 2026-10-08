import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { DeleteButton } from "@/components/prayers/delete-button";
import { FavoriteButton } from "@/components/prayers/favorite-button";
import { PrayerBody } from "@/components/prayers/prayer-body";
import { copyPrayer } from "@/lib/prayers/actions";
import { getFavoriteIds, getPrayer } from "@/lib/prayers/queries";

export async function generateMetadata({ params }: PageProps<"/prayers/[id]">): Promise<Metadata> {
  const prayer = await getPrayer((await params).id);
  return { title: prayer?.title ?? "Prayer" };
}

export default async function PrayerPage({ params }: PageProps<"/prayers/[id]">) {
  const { id } = await params;
  const [prayer, favoriteIds] = await Promise.all([getPrayer(id), getFavoriteIds()]);
  if (!prayer) notFound();
  const isOwn = prayer.user_id !== null;

  return (
    <article className="mx-auto max-w-2xl">
      <AppButton href="/prayers" variant="ghost" className="-ml-3 mb-2">
        <ArrowLeft aria-hidden /> Prayers
      </AppButton>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium md:text-5xl">{prayer.title}</h1>
          {prayer.source ? <p className="mt-2 text-sm text-muted-foreground">{prayer.source}</p> : null}
        </div>
        <FavoriteButton id={prayer.id} isFavorite={favoriteIds.has(prayer.id)} />
      </div>

      <PrayerBody body={prayer.body} />

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {isOwn ? (
          <>
            <AppButton href={`/prayers/${prayer.id}/edit`} variant="outline">
              Edit
            </AppButton>
            <DeleteButton id={prayer.id} />
          </>
        ) : (
          <form action={copyPrayer}>
            <input type="hidden" name="id" value={prayer.id} />
            <AppButton type="submit" variant="outline">
              Copy to my prayers
            </AppButton>
          </form>
        )}
      </div>
    </article>
  );
}
