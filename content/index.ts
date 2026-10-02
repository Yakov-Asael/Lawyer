import { PLACEHOLDER_PATTERN, Site } from "./schema";
import { siteContent } from "./site";

export * from "./schema";

/** Paths of every string that still carries a "[placeholder...]" marker. */
export function findPlaceholders(value: unknown, path = ""): string[] {
  if (typeof value === "string") return PLACEHOLDER_PATTERN.test(value) ? [path] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => findPlaceholders(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => findPlaceholders(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** Parse at import time so a malformed field fails the build, not the visitor. */
export const site: Site = Site.parse(siteContent);

// Placeholders are fine in dev and previews; a production deploy must not ship them.
// Netlify sets CONTEXT=production only for production deploys (deploy previews use "deploy-preview").
if (process.env.CONTEXT === "production") {
  const open = findPlaceholders(site);
  if (open.length > 0) {
    throw new Error(`Content has unresolved placeholders:\n  ${open.join("\n  ")}`);
  }
}
