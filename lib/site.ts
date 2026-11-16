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
export const CONTENT_REVIEWED = "2026-11-07";

export const SITE_NAME = "Ora";
export const SITE_DESCRIPTION =
  "Ora is a Catholic prayer app for a deeper faith: pray the Rosary, keep your own prayers, and come back to God each day.";

/** Home page description: longer than SITE_DESCRIPTION, naming the free, no-account, offline and chaplet hooks. */
export const HOME_DESCRIPTION =
  "Pray the Rosary bead by bead with Ora, a free Catholic prayer app. No account needed, works offline. Also the Divine Mercy Chaplet, Angelus and Stations of the Cross.";

/** Version of the privacy policy and terms. Bump it (and LEGAL_UPDATED) whenever either text changes. */
export const POLICY_VERSION = "2026-11-07";
export const LEGAL_UPDATED = "7 November 2026";

/** Who writes the public guides. Shown as a byline and used as the Person author in Article structured data. */
export const SITE_AUTHOR = { name: "Adrian Marcelo", url: "https://adrianmarcelo.dev" } as const;

/**
 * Other profiles that belong to Ora (comma-separated URLs in NEXT_PUBLIC_SITE_SAME_AS), used as `sameAs` in
 * the Organization structured data. Empty until Ora has public profiles; never add a URL that is not Ora's.
 */
export const SITE_SAME_AS = (process.env.NEXT_PUBLIC_SITE_SAME_AS ?? "")
  .split(",")
  .map((u) => u.trim())
  .filter((u) => /^https:\/\//.test(u));

/** Where privacy requests and support messages go. Set NEXT_PUBLIC_CONTACT_EMAIL before launch. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";

/** Public, signed-out pages that belong in the sitemap. */
export const PUBLIC_PATHS = ["/", "/rosary", "/angelus", "/divine-mercy", "/seven-sorrows", "/stations-of-the-cross", "/learn/how-to-pray-the-rosary", "/learn/rosary-mysteries-by-day", "/learn/rosary-prayers", "/learn/how-to-pray-the-divine-mercy-chaplet", "/learn/how-to-pray-the-angelus", "/learn/how-to-pray-the-stations-of-the-cross", "/privacy", "/terms", "/credits"] as const;
