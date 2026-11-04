import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

// A page that sets its own openGraph drops the root opengraph-image, so repeat it here.
const OG_IMAGE = "/opengraph-image";

/** Title, description, canonical and social tags for one public page. `title` gets the " · Ora" suffix. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: {
  title: string;
  description: string;
  path: string;
  /** Use instead of the template suffix, for the home page. */
  absoluteTitle?: string;
}): Metadata {
  const shown = absoluteTitle ?? `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", title: shown, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: shown, description, images: [OG_IMAGE] },
  };
}
