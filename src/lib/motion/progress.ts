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
