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

/**
 * True while the visitor is typing in a text control (the review form). The dock steps aside then, so it never
 * covers the field in use or sits on top of the phone keyboard.
 */
export function isTextEntry(el: Element | null): boolean {
  if (!el) return false;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  if (el instanceof HTMLInputElement) return !["checkbox", "radio", "button", "submit", "reset", "range", "color"].includes(el.type);
  return el instanceof HTMLElement && el.isContentEditable;
}
