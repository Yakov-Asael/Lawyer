import type { NavLink } from "@content/data";

/** The reviews link only makes sense once there is a slider to land on (spec 09). */
export function menuLinks(links: readonly NavLink[], hasReviews: boolean): NavLink[] {
  return links.filter((link) => hasReviews || link.href !== "#reviews");
}
