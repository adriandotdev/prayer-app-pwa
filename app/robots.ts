import type { MetadataRoute } from "next";

import { ALLOW_INDEXING, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/login", "/offline", "/prayers", "/collections", "/intentions", "/profile", "/appearance", "/s/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
