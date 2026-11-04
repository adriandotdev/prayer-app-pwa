const PRODUCTION_FALLBACK = "https://prayer-app-pwa.vercel.app";

/**
 * Origin used when NEXT_PUBLIC_SITE_URL is unset. On Vercel, non-production deployments use their own
 * host so staging and previews never advertise the production URL as canonical.
 */
function fallbackOrigin(): string {
  const { VERCEL_ENV, VERCEL_URL, VERCEL_PROJECT_PRODUCTION_URL } = process.env;
  if (VERCEL_ENV === "production" && VERCEL_PROJECT_PRODUCTION_URL) return `https://${VERCEL_PROJECT_PRODUCTION_URL}`;
  if (VERCEL_ENV && VERCEL_ENV !== "production" && VERCEL_URL) return `https://${VERCEL_URL}`;
  return PRODUCTION_FALLBACK;
}

/** The public origin used for canonical URLs, the sitemap and social cards. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackOrigin()).replace(/\/+$/, "");

/**
 * Search engines may index this deployment only when `ALLOW_INDEXING=true`. Set it on the production
 * project alone, so staging and previews stay out of the index (robots.txt and a noindex tag).
 */
export const ALLOW_INDEXING = process.env.ALLOW_INDEXING === "true";

/** When the public prayer guides were last reviewed. Shown on the pages and used as the sitemap lastModified. */
export const CONTENT_REVIEWED = "2026-11-04";

export const SITE_NAME = "Ora";
export const SITE_DESCRIPTION =
  "Ora is a Catholic prayer app for a deeper faith: pray the Rosary, keep your own prayers, and come back to God each day.";

/** Public, signed-out pages that belong in the sitemap. */
export const PUBLIC_PATHS = ["/", "/rosary", "/angelus", "/divine-mercy"] as const;
