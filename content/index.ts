import { isProductionBuild, site } from "./data";
import { accessibilityPage } from "./legal/accessibility";
import { privacyPage } from "./legal/privacy";
import { termsPage } from "./legal/terms";
import {
  LegalPage,
  PLACEHOLDER_PATTERN,
  Site,
  type LegalSlug,
} from "./schema";
import { siteContent } from "./site";

export * from "./schema";
export { isPracticeAreaId, isProductionBuild, practiceArea, PRACTICE_AREA_IDS, site } from "./data";

/**
 * Content paths whose placeholders do not block production because the UI drops the item instead:
 * an FAQ item without an approved answer is excluded from the live site (spec 10).
 */
const EXCLUDED_WHEN_MISSING = [/^faq\[\d+\]\.answer$/];

/** Paths of every string that still carries a "[placeholder...]" marker. */
export function findPlaceholders(value: unknown, path = ""): string[] {
  if (typeof value === "string") return PLACEHOLDER_PATTERN.test(value) ? [path] : [];
  if (Array.isArray(value)) return value.flatMap((v, i) => findPlaceholders(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => findPlaceholders(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/**
 * Validated at import time so a malformed field fails the build, not the visitor. The root layout imports this
 * module, so every build runs it. Components read the same (identical) object from ./data, without Zod.
 */
Site.parse(siteContent);

/** Legal pages (specs 16, 17), validated like the rest of the content. */
export const legalPages: readonly LegalPage[] = [accessibilityPage, privacyPage, termsPage].map((page) => LegalPage.parse(page));

/** The route of each legal page, from the paths the footer and accessibility menu already link to. */
export const LEGAL_PATHS: Record<LegalSlug, string> = {
  accessibility: site.legal.accessibilityStatementPath,
  privacy: site.legal.privacyPath,
  terms: site.legal.termsPath,
};

/** A legal page by slug. A miss is a programming error (a route without its content). */
export function legalPage(slug: LegalSlug): LegalPage {
  const page = legalPages.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown legal page: ${slug}`);
  return page;
}

/** Legal pages Yossi has not approved yet; they block production like placeholders. */
export function unapprovedLegalPages(pages: readonly Pick<LegalPage, "slug" | "approved">[]): string[] {
  return pages.filter((p) => !p.approved).map((p) => `legal/${p.slug} (not approved)`);
}

/** Placeholders that would reach visitors and so must block a production build. */
export function blockingPlaceholders(value: unknown): string[] {
  return findPlaceholders(value).filter((path) => !EXCLUDED_WHEN_MISSING.some((rule) => rule.test(path)));
}

// Placeholders are fine in dev and previews; a production deploy must not ship them.
// Netlify sets CONTEXT=production only for production deploys (deploy previews use "deploy-preview").
if (isProductionBuild) {
  const open = [...blockingPlaceholders(site), ...blockingPlaceholders({ legal: legalPages }), ...unapprovedLegalPages(legalPages)];
  if (open.length > 0) {
    throw new Error(`Content has unresolved placeholders:\n  ${open.join("\n  ")}`);
  }
}
