/** Marker for copy that is still missing from the client. Never shipped to production. */
export const PLACEHOLDER_PATTERN = /\[placeholder[^\]]*\]/;

/** Practice area ids, in display order. Plain data (no Zod), so client code can use it without the validator. */
export const PRACTICE_AREA_IDS = ["family", "real-estate", "torts", "civil", "notary"] as const;

export type PracticeAreaIdValue = (typeof PRACTICE_AREA_IDS)[number];

export function isPracticeAreaId(value: unknown): value is PracticeAreaIdValue {
  return typeof value === "string" && (PRACTICE_AREA_IDS as readonly string[]).includes(value);
}
