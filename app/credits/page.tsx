import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ART_CREDITS } from "@/data/credits/art";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Artwork credits",
  description: "The public-domain artwork used in Ora, with sources.",
  path: "/credits",
});

const BY_ARTIST = Object.entries(
  ART_CREDITS.reduce<Record<string, typeof ART_CREDITS>>((groups, credit) => {
    (groups[credit.artist] ??= []).push(credit);
    return groups;
  }, {}),
);

export default function CreditsPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <PageHeader
        title="Artwork credits"
        description="The images in Ora are cropped details of public-domain works. Thank you to the museums and Wikimedia Commons contributors who photographed and shared them."
      />
      <div className="space-y-8 text-base leading-relaxed">
        {BY_ARTIST.map(([artist, works]) => (
          <section key={artist} className="space-y-3">
            <h2 className="text-2xl font-medium tracking-[-0.01em]">{artist}</h2>
            <ul className="list-disc space-y-1 pl-5">
              {works.map((work) => (
                <li key={work.file}>
                  <a href={work.source} rel="noopener noreferrer" className="underline underline-offset-4">
                    {work.work}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
