import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppButton } from "@/components/app-button";
import { SharedSeason } from "@/components/theme/shared-season";
import { PrayerBody } from "@/components/prayers/prayer-body";
import { getShared } from "@/lib/shares/queries";

// The page reads no cookies, so without this Next may cache the first render and keep serving the
// sharer's old colours (or a revoked link) after they change.
export const dynamic = "force-dynamic";

// A share link is a private-by-obscurity URL: keep it out of search results (the layout default is
// "indexable" in production) and don't leak the token to other sites through the Referer header.
export async function generateMetadata({ params }: PageProps<"/s/[token]">): Promise<Metadata> {
  const shared = await getShared((await params).token);
  return {
    title: shared ? (shared.kind === "prayer" ? shared.title : shared.name) : "Shared prayer",
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

function Source({ source }: { source: string | null }) {
  return source ? <p className="mt-3 text-base font-medium text-gold-foreground dark:text-gold">{source}</p> : null;
}

export default async function SharedPage({ params }: PageProps<"/s/[token]">) {
  const shared = await getShared((await params).token);
  if (!shared) notFound();

  return (
    <div data-shared-view className="mx-auto max-w-3xl py-2 md:py-6">
      <SharedSeason choice={shared.season} />
      {shared.kind === "prayer" ? (
        <article>
          <header className="mb-8 md:mb-12">
            <h1 className="font-display text-[3rem] leading-[0.98] font-medium tracking-[-0.03em] text-balance break-words md:text-7xl">{shared.title}</h1>
            <Source source={shared.source} />
          </header>
          <div className="reader-surface rounded-3xl bg-card p-6 md:p-14">
            <PrayerBody body={shared.body} />
          </div>
        </article>
      ) : (
        <article>
          <header className="mb-8 md:mb-12">
            <h1 className="font-display text-[3rem] leading-[0.98] font-medium tracking-[-0.03em] text-balance break-words md:text-7xl">{shared.name}</h1>
            <p className="mt-3 text-base font-medium text-gold-foreground dark:text-gold">
              A collection of {shared.prayers.length} {shared.prayers.length === 1 ? "prayer" : "prayers"}
            </p>
            {shared.prayers.length > 2 ? (
              <nav aria-label="Prayers in this collection" className="mt-6">
                <ul className="flex flex-wrap gap-2">
                  {shared.prayers.map((p) => (
                    <li key={p.id}>
                      <a
                        href={`#p-${p.id}`}
                        className="inline-flex min-h-11 items-center rounded-full bg-secondary px-4 text-base text-secondary-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </header>
          {shared.prayers.length === 0 ? (
            <p className="text-base text-muted-foreground">There are no prayers in this collection yet.</p>
          ) : (
            <ol className="space-y-8">
              {shared.prayers.map((p) => (
                <li key={p.id}>
                  <section className="reader-surface scroll-mt-6 rounded-3xl bg-card p-6 md:p-12" aria-labelledby={`p-${p.id}`}>
                    <h2 id={`p-${p.id}`} className="mb-1 font-display text-4xl leading-[1.02] font-medium tracking-[-0.02em] text-balance break-words md:text-5xl">
                      {p.title}
                    </h2>
                    {p.source ? <p className="mb-5 text-base font-medium text-gold-foreground dark:text-gold">{p.source}</p> : <div className="mb-5" />}
                    <PrayerBody body={p.body} />
                  </section>
                </li>
              ))}
            </ol>
          )}
        </article>
      )}

      <aside aria-labelledby="shared-invite" className="mt-16 rounded-3xl bg-primary p-8 text-primary-foreground md:mt-24 md:p-14">
        <h2 id="shared-invite" className="max-w-xl font-display text-4xl leading-[1.02] font-medium tracking-[-0.02em] text-balance md:text-6xl">
          Pray the Rosary, wherever you are
        </h2>
        <p className="mt-4 max-w-xl text-lg text-primary-foreground">
          Ora guides you bead by bead, works offline and needs no account. Sign in to keep your own prayers and collections.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <AppButton href="/rosary" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Start the Rosary
          </AppButton>
          <AppButton href="/login" size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/15">
            Keep your own prayers
          </AppButton>
        </div>
      </aside>
    </div>
  );
}
