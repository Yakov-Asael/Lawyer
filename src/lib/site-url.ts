/**
 * The site's absolute origin, for canonical URLs, Open Graph images, JSON-LD and the sitemap (spec 16).
 * SITE_URL wins once the domain is set; otherwise Netlify's own URL (set at build time); otherwise local dev.
 * Never hardcoded: the domain is still open.
 */
export function resolveSiteUrl(env: Partial<Record<"SITE_URL" | "URL", string>>): URL {
  const raw = env.SITE_URL?.trim() || env.URL?.trim() || "http://localhost:3000";
  return new URL(raw.endsWith("/") ? raw : `${raw}/`);
}

export const siteUrl = resolveSiteUrl({ SITE_URL: process.env.SITE_URL, URL: process.env.URL });

/** An absolute URL on this site, e.g. absoluteUrl("/privacy-policy"). */
export function absoluteUrl(path: string, base: URL = siteUrl): string {
  return new URL(path, base).toString();
}
