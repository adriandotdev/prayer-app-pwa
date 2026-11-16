import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/** Organization, WebSite and SoftwareApplication structured data for the signed-out landing page. */
export function landingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/brand/icon-512.png` },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION, inLanguage: "en", publisher: { "@id": `${SITE_URL}/#org` } },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        isAccessibleForFree: true,
        featureList: [
          "Interactive Rosary with the four sets of mysteries",
          "Divine Mercy Chaplet, Angelus, Seven Sorrows and Stations of the Cross",
          "Works offline as an installable web app",
          "Personal prayer library and intentions",
        ],
        publisher: { "@id": `${SITE_URL}/#org` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };
}
