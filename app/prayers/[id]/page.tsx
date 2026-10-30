import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, FolderPlus, Pencil } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { DeleteButton } from "@/components/prayers/delete-button";
import { FavoriteButton } from "@/components/prayers/favorite-button";
import { PrayerBody } from "@/components/prayers/prayer-body";
import { SubmitButton } from "@/components/submit-button";
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
    <article className="mx-auto max-w-3xl">
      <div className="mb-2 flex items-center justify-between">
        <AppButton href="/prayers" variant="ghost" className="-ml-3">
          <ArrowLeft aria-hidden /> Prayers
        </AppButton>
        <FavoriteButton id={prayer.id} isFavorite={favoriteIds.has(prayer.id)} className="-mr-3" />
      </div>

      <header className="mb-6 md:mb-8">
        <h1 className="text-[2.5rem] leading-[1.02] font-medium tracking-[-0.02em] text-balance break-words md:text-6xl">{prayer.title}</h1>
        <p className="mt-3 text-base font-medium text-gold-foreground dark:text-gold">
          {[isOwn ? "My prayer" : "Starter prayer", prayer.source].filter(Boolean).join(" · ")}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <AppButton href={`/prayers/${prayer.id}/collections`} variant="outline" className="flex-1 sm:flex-none">
            <FolderPlus aria-hidden /> Add to collection
          </AppButton>
          {isOwn ? null : (
            <form action={copyPrayer} className="flex-1 sm:flex-none">
              <input type="hidden" name="id" value={prayer.id} />
              <SubmitButton variant="outline" pendingLabel="Copying…" className="w-full sm:w-auto">
                <Copy aria-hidden /> Make my copy
              </SubmitButton>
            </form>
          )}
        </div>
      </header>

      <div className="ora-enter rounded-3xl bg-card p-6 md:p-12">
        <PrayerBody body={prayer.body} />
      </div>

      {isOwn ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <AppButton href={`/prayers/${prayer.id}/edit`} variant="outline" className="flex-1 sm:flex-none">
            <Pencil aria-hidden /> Edit
          </AppButton>
          <DeleteButton id={prayer.id} />
        </div>
      ) : (
        <p className="mt-6 text-base text-muted-foreground">
          Starter prayers can’t be edited. Make your copy to change the words or add your own.
        </p>
      )}
    </article>
  );
}
