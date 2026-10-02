"use client";

import { useEffect, useRef, type RefObject } from "react";
import { onFrame, viewportProgress } from "@/lib/motion";
import { useMotion } from "./MotionProvider";

/**
 * Reports the 0..1 progress of an element through the viewport on the shared frame loop
 * (spec 00, `useScrollProgress`). The callback writes styles directly, so scrolling never
 * re-renders React. With motion off it is called once with 1: the effect's final state.
 */
export type ProgressMeasure = (rect: DOMRect, viewportHeight: number) => number;

export function useScrollProgress(
  ref: RefObject<Element | null>,
  onProgress: (progress: number) => void,
  /** How progress is measured. Default: travel through the whole viewport. */
  measure: ProgressMeasure = viewportProgress,
): void {
  const { enabled } = useMotion();
  const callback = useRef(onProgress);
  const measureRef = useRef(measure);

  useEffect(() => {
    callback.current = onProgress;
    measureRef.current = measure;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      callback.current(1);
      return;
    }
    let lastY = Number.NaN;
    let lastH = Number.NaN;
    return onFrame(() => {
      const y = window.scrollY;
      const h = window.innerHeight;
      if (y === lastY && h === lastH) return;
      lastY = y;
      lastH = h;
      callback.current(measureRef.current(el.getBoundingClientRect(), h));
    });
  }, [enabled, ref]);
}
