/** Pure scroll math shared by every scroll-driven effect. */

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * Progress of an element through the viewport: 0 when its top meets the viewport bottom,
 * 1 when its bottom leaves the viewport top.
 */
export function viewportProgress(rect: Pick<DOMRect, "top" | "height">, viewportHeight: number): number {
  const travel = viewportHeight + rect.height;
  if (travel <= 0) return 1;
  return clamp01((viewportHeight - rect.top) / travel);
}

/** Re-map a 0..1 progress so an effect runs only inside [start, start + span]. */
export function remap(progress: number, start: number, span: number): number {
  if (span <= 0) return progress >= start ? 1 : 0;
  return clamp01((progress - start) / span);
}

/**
 * Reading progress through a block of text (statement scrub, spec 04): 0 when the block's top reaches
 * `startAt` of the viewport height, 1 after scrolling the block's height plus `extra` of the viewport.
 */
export function readingProgress(
  rect: Pick<DOMRect, "top" | "height">,
  viewportHeight: number,
  startAt = 0.82,
  extra = 0.25,
): number {
  const span = rect.height + viewportHeight * extra;
  if (span <= 0) return 1;
  return clamp01((viewportHeight * startAt - rect.top) / span);
}

/**
 * How much of a stacked card is covered by the next one (practice-area files, spec 06):
 * 0 when the next card's top is at or below this card's bottom, 1 when it covers the full height.
 */
export function overlapRatio(card: Pick<DOMRect, "bottom" | "height">, next: Pick<DOMRect, "top">): number {
  if (card.height <= 0) return 0;
  return clamp01((card.bottom - next.top) / card.height);
}
