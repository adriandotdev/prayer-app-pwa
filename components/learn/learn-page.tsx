import Link from "next/link";
import type { ReactNode } from "react";

import { AppButton } from "@/components/app-button";
import { PageHeader } from "@/components/layout/page-header";
import { CONTENT_REVIEWED, SITE_NAME, SITE_URL } from "@/lib/site";

export const LEARN_GUIDES = [
  { path: "/learn/how-to-pray-the-rosary", title: "How to pray the Rosary" },
  { path: "/learn/rosary-mysteries-by-day", title: "Rosary mysteries by day of the week" },
  { path: "/learn/rosary-prayers", title: "Rosary prayers: full text" },
] as const;

/** Article structured data for a guide. Escaped with the same `<` rule as the landing page. */
function articleJsonLd(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    dateModified: CONTENT_REVIEWED,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function LearnPage({
  title,
  intro,
  path,
  children,
}: {
  title: string;
  intro: string;
  path: string;
  children: ReactNode;
}) {
  const others = LEARN_GUIDES.filter((g) => g.path !== path);
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(title, intro, path)).replace(/</g, "\\u003c") }}
      />
      <PageHeader title={title} description={intro} />
      <div className="space-y-10 text-base leading-relaxed">{children}</div>

      <aside className="mt-12 rounded-3xl bg-card px-5 py-7 sm:px-8">
        <h2 className="font-heading text-2xl leading-snug">Pray it now</h2>
        <p className="mt-2 text-muted-foreground">
          Ora guides you through the Rosary bead by bead. It is free, needs no account and works offline.
        </p>
        <AppButton href="/rosary" size="lg" className="mt-5 w-full sm:w-auto">
          Open the guided Rosary
        </AppButton>
      </aside>

      <nav aria-label="More Rosary guides" className="mt-10">
        <h2 className="text-sm font-medium text-muted-foreground">More Rosary guides</h2>
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
        Written by the Ora team. Last reviewed <time dateTime={CONTENT_REVIEWED}>7 November 2026</time>.
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
