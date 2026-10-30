import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, FolderPlus } from "lucide-react";

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
      <AppButton href="/prayers" variant="ghost" className="-ml-3 mb-2">
        <ArrowLeft aria-hidden /> Prayers
      </AppButton>

      <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="min-w-0">
          <h1 className="text-[2.5rem] leading-[1.02] font-medium tracking-[-0.02em] break-words md:text-6xl">{prayer.title}</h1>
          {prayer.source ? <p className="mt-3 text-base font-medium text-gold-foreground dark:text-gold">{prayer.source}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1 self-start rounded-full bg-card p-1 md:self-auto">
          <AppButton
            href={`/prayers/${prayer.id}/collections`}
            variant="ghost"
            size="icon"
            aria-label="Add to collection"
            title="Add to collection"
          >
            <FolderPlus aria-hidden />
          </AppButton>
          {isOwn ? null : (
            <form action={copyPrayer}>
              <input type="hidden" name="id" value={prayer.id} />
              <SubmitButton
                variant="ghost"
                size="icon"
                aria-label="Copy to my prayers"
                title="Copy to my prayers"
                pendingLabel={<span className="sr-only">Copying…</span>}
              >
                <Copy aria-hidden />
              </SubmitButton>
            </form>
          )}
          <FavoriteButton id={prayer.id} isFavorite={favoriteIds.has(prayer.id)} />
        </div>
      </div>

      <div className="ora-enter rounded-3xl bg-card p-6 [animation-delay:120ms] md:p-12">
        <PrayerBody body={prayer.body} />
      </div>

      {isOwn ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <AppButton href={`/prayers/${prayer.id}/edit`} variant="outline" className="flex-1 sm:flex-none">
            Edit
          </AppButton>
          <DeleteButton id={prayer.id} />
        </div>
      ) : null}
    </article>
  );
}
