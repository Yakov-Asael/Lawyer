import type { MetadataRoute } from "next";
import { isProductionBuild } from "@content";
import { absoluteUrl } from "@/lib/site-url";

/**
 * robots.txt (spec 16). Only the production deploy is indexable; previews and branch deploys ask crawlers to stay
 * out, so a half-finished preview never competes with the live site.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionBuild) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dev/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
