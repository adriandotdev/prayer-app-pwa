import Link from "next/link";
import type { ReactNode } from "react";

import { AppButton } from "@/components/app-button";
import { PageHeader } from "@/components/layout/page-header";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd } from "@/lib/seo-jsonld";
import { CONTENT_REVIEWED, SITE_AUTHOR } from "@/lib/site";

export const LEARN_GUIDES = [
  { path: "/learn/how-to-pray-the-rosary", title: "How to pray the Rosary" },
  { path: "/learn/rosary-mysteries-by-day", title: "Rosary mysteries by day of the week" },
  { path: "/learn/rosary-prayers", title: "Rosary prayers: full text" },
  { path: "/learn/how-to-pray-the-divine-mercy-chaplet", title: "How to pray the Divine Mercy Chaplet" },
  { path: "/learn/how-to-pray-the-angelus", title: "How to pray the Angelus" },
  { path: "/learn/how-to-pray-the-stations-of-the-cross", title: "How to pray the Stations of the Cross" },
] as const;

export function LearnPage({
  title,
  intro,
  path,
  cta = { href: "/rosary", label: "Open the guided Rosary", text: "Ora guides you through the Rosary bead by bead." },
  children,
}: {
  title: string;
  intro: string;
  path: string;
  /** The "Pray it now" call to action. Defaults to the guided Rosary. */
  cta?: { href: string; label: string; text: string };
  children: ReactNode;
}) {
  const others = LEARN_GUIDES.filter((g) => g.path !== path);
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={articleJsonLd({ title, description: intro, path, reviewed: CONTENT_REVIEWED })} />
      <PageHeader title={title} description={intro} />
      <div className="space-y-10 text-base leading-relaxed">{children}</div>

      <aside className="mt-12 rounded-3xl bg-card px-5 py-7 sm:px-8">
        <h2 className="font-heading text-2xl leading-snug">Pray it now</h2>
        <p className="mt-2 text-muted-foreground">
          {cta.text} It is free, needs no account and works offline.
        </p>
        <AppButton href={cta.href} size="lg" className="mt-5 w-full sm:w-auto">
          {cta.label}
        </AppButton>
      </aside>

      <nav aria-label="More guides" className="mt-10">
        <h2 className="text-sm font-medium text-muted-foreground">More guides</h2>
        <ul className="mt-2">
          {others.map((g) => (
            <li key={g.path}>
              <Link href={g.path} className="inline-block py-2.5 underline underline-offset-4">
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-10 border-t border-border pt-4 text-sm text-muted-foreground">
        Written by <a href={SITE_AUTHOR.url} rel="author" className="underline underline-offset-4">{SITE_AUTHOR.name}</a>, creator of Ora. Last reviewed <time dateTime={CONTENT_REVIEWED}>7 November 2026</time>.
      </p>
    </article>
  );
}

export function LearnSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-balance text-2xl leading-snug sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}
