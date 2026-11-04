/** The public origin used for canonical URLs, the sitemap and social cards. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://prayer-app-pwa.vercel.app").replace(
  /\/+$/,
  "",
);

/**
 * Search engines may index this deployment only when `ALLOW_INDEXING=true`. Set it on the production
 * project alone, so staging and previews stay out of the index (robots.txt and a noindex tag).
 */
export const ALLOW_INDEXING = process.env.ALLOW_INDEXING === "true";

export const SITE_NAME = "Ora";
export const SITE_DESCRIPTION =
  "Ora is a Catholic prayer app for a deeper faith: pray the Rosary, keep your own prayers, and come back to God each day.";

/** Public, signed-out pages that belong in the sitemap. */
export const PUBLIC_PATHS = ["/", "/rosary", "/angelus", "/divine-mercy"] as const;
