import type { PracticeArea, PracticeAreaId, Site } from "./schema";
import { siteContent } from "./site";

/**
 * The site content for components and client code, without Zod.
 *
 * Validation runs once, on the server, in ./index.ts (imported by the root layout), so a malformed field still fails
 * the build. The contract has no transforms (copy is checked for surrounding whitespace, not trimmed), so the parsed
 * value equals this raw object; content.test.ts asserts it. Importing "@content" from a client component would ship
 * the whole validator to every visitor: use this module there instead.
 */
export const site = siteContent as unknown as Site;

export type * from "./schema";
export { isPracticeAreaId, PLACEHOLDER_PATTERN, PRACTICE_AREA_IDS } from "./ids";

/** True for a production deploy (Netlify CONTEXT=production); previews and dev are not. */
export const isProductionBuild = process.env.CONTEXT === "production";

/** A practice area by id. The contract guarantees all four exist, so a miss is a programming error. */
export function practiceArea(id: PracticeAreaId): PracticeArea {
  const area = site.practiceAreas.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown practice area: ${id}`);
  return area;
}
