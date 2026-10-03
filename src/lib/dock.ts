/** The dock appears once the hero's bottom edge has passed 40% of the viewport height (spec 14). */
export const DOCK_THRESHOLD = 0.4;

/**
 * Whether the phone contact dock should show. `heroBottom` is the hero's bottom edge relative to the viewport, or
 * null on pages without a hero (legal pages), where the dock always shows.
 */
export function dockVisible(heroBottom: number | null, viewportHeight: number): boolean {
  if (heroBottom === null) return true;
  return heroBottom < viewportHeight * DOCK_THRESHOLD;
}
