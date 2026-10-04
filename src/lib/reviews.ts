import { site, type Review } from "@content/data";

/**
 * The single source of published reviews (spec 09). Today they live in content, added by hand once approved;
 * if reviews move to a database (specs 18, 19), only this function changes.
 */
export function getApprovedReviews(): readonly Review[] {
  return site.reviews.filter((r) => r.consentConfirmed);
}
