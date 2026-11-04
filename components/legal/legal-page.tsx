import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/site";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl">
      <PageHeader title={title} description={intro} />
      <p className="-mt-3 mb-8 text-sm text-muted-foreground">Last updated {LEGAL_UPDATED}</p>
      <div className="space-y-8 text-base leading-relaxed">{children}</div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-medium tracking-[-0.01em]">{title}</h2>
      {children}
    </section>
  );
}

export function ContactLine() {
  return CONTACT_EMAIL ? (
    <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
      {CONTACT_EMAIL}
    </a>
  ) : (
    <span>the contact address shown in the app</span>
  );
}
