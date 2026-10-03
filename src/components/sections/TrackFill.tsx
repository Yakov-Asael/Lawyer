"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/components/motion";
import { remap, viewportProgress } from "@/lib/motion";

/** Fill window on the steps' viewport progress (approved prototype): starts at .25, full at .6. */
const START = 0.25;
const SPAN = 0.35;

/**
 * The brass-deep line inside the process track (spec 07). It grows from the first step to the last.
 * transform-origin is physical on purpose: scaleX has no logical origin, and the inline start is the right in RTL.
 */
export function TrackFill() {
  const ref = useRef<HTMLSpanElement>(null);
  const steps = useRef<Element | null>(null);

  useScrollProgress(steps, (p) => {
    const el = ref.current;
    if (el) el.style.transform = `scaleX(${remap(p, START, SPAN)})`;
  }, viewportProgress);

  return (
    <span
      ref={(el) => {
        ref.current = el;
        // Progress is measured on the whole steps block (track + list), the track's parent's parent.
        steps.current = el?.parentElement?.parentElement ?? null;
      }}
      className="track-fill absolute inset-0 bg-brass-deep will-change-transform ltr:origin-left rtl:origin-right"
    />
  );
}
