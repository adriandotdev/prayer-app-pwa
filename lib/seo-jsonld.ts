import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_SAME_AS, SITE_URL } from "@/lib/site";

const absolute = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

/** Question and answer pairs shown on the landing page. The same text is the FAQPage structured data. */
export const LANDING_FAQ = [
  {
    q: "What is Ora?",
    a: "Ora is a free Catholic prayer app. You can pray the Rosary bead by bead, follow the Divine Mercy Chaplet, the Angelus, the Seven Sorrows and the Stations of the Cross, and, once signed in, keep your own prayers and intentions in one place.",
  },
  {
    q: "How do I pray the Rosary with Ora?",
    a: "Open the Rosary, choose the Joyful, Sorrowful, Glorious or Luminous mysteries (or follow the set for today), and Ora walks you through each bead and prayer in order. A full Rosary takes about 15 to 20 minutes.",
  },
  {
    q: "Do I need an account to use Ora?",
    a: "No. The Rosary and the other guided prayers work without an account. A free Google sign-in is only needed to keep your own prayers, collections and intentions.",
  },
  {
    q: "Does Ora work offline?",
    a: "Yes. Ora is an installable web app, so the Rosary and the chaplets keep working without a connection once the app has loaded. Add it to your home screen to open it like any other app.",
  },
  {
    q: "Are the prayers the traditional texts?",
    a: "Yes. Every prayer is given in its traditional text, never paraphrased or shortened.",
  },
] as const;

/** Organization, WebSite, SoftwareApplication and FAQPage structured data for the signed-out landing page. */
export function landingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/icon-512.png`,
        founder: { "@id": `${SITE_URL}/#author` },
        ...(SITE_SAME_AS.length > 0 ? { sameAs: SITE_SAME_AS } : {}),
      },
      authorPerson(),
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
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: LANDING_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

/** The Person who writes the guides, as a graph node other nodes reference by id. */
export function authorPerson() {
  return { "@type": "Person", "@id": `${SITE_URL}/#author`, name: SITE_AUTHOR.name, url: SITE_AUTHOR.url, worksFor: { "@id": `${SITE_URL}/#org` } };
}

/** BreadcrumbList for a page. `trail` is ordered from the first parent to the page itself (Home is added). */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  const items = [{ name: SITE_NAME, path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

/** WebPage plus breadcrumb for a practice page (rosary, chaplets, stations), optionally with its visible Q&A. */
export function practicePageJsonLd({
  name,
  description,
  path,
  reviewed,
  faq = [],
}: {
  name: string;
  description: string;
  path: string;
  reviewed: string;
  faq?: { q: string; a: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absolute(path)}#webpage`,
        url: absolute(path),
        name,
        description,
        inLanguage: "en",
        dateModified: reviewed,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        breadcrumb: breadcrumbJsonLd([{ name, path }]),
      },
      ...(faq.length > 0
        ? [{ "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
        : []),
    ],
  };
}

/** Article for a learn guide: Person author, Organization publisher, breadcrumb. */
export function articleJsonLd({ title, description, path, reviewed }: { title: string; description: string; path: string; reviewed: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        mainEntityOfPage: absolute(path),
        dateModified: reviewed,
        inLanguage: "en",
        author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/brand/icon-512.png` },
      },
      breadcrumbJsonLd([{ name: title, path }]),
    ],
  };
}
