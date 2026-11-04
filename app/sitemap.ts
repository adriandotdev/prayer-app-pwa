import type { MetadataRoute } from "next";

import { CONTENT_REVIEWED, PUBLIC_PATHS, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: CONTENT_REVIEWED,
  }));
}
