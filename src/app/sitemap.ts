import type { MetadataRoute } from "next";
import { LEGAL_PATHS, legalPages } from "@content";
import { absoluteUrl } from "@/lib/site-url";

/** sitemap.xml (spec 16): the landing page and every published legal page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...legalPages.map((page) => ({
      url: absoluteUrl(LEGAL_PATHS[page.slug]),
      lastModified: page.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
