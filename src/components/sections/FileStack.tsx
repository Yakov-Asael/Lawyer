"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/motion";
import { onFrame, overlapRatio } from "@/lib/motion";

/**
 * Dims each practice-area file as the next one slides over it (spec 06): brightness(1 - overlap * .25).
 * Stacking itself is CSS (sticky); this only adds the dimming, and only while motion runs.
 */
export function FileStack({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    const files = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-file]") ?? []);
    if (!enabled) {
      files.forEach((f) => (f.style.filter = ""));
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
      files.forEach((file, i) => {
        const next = files[i + 1];
        if (!next) return;
        const overlap = overlapRatio(file.getBoundingClientRect(), next.getBoundingClientRect());
        file.style.filter = overlap > 0 ? `brightness(${1 - overlap * 0.25})` : "";
      });
    });
  }, [enabled]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
