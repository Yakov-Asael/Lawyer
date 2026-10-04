"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/motion";
import { FILE_TAB, foldHidden, foldProgress, onFrame, overlapRatio } from "@/lib/motion";

/**
 * The practice-area stack (spec 06). Every file is sticky at the same line (CSS); this folds the stack to two tabs:
 * as the next file arrives, the current one lifts one tab height, so at rest only the previous and the current tab
 * show, and files two back are hidden so a wider tab never peeks out. Covered files dim (brightness 1 - overlap * .25).
 * With motion off there is no lift and no dimming; covered files are simply hidden under the current one.
 */
export function FileStack({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    const files = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-file]") ?? []);
    const lifts = files.map(() => 0);
    let lastY = Number.NaN;
    let lastH = Number.NaN;
    const update = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      if (y === lastY && h === lastH) return;
      lastY = y;
      lastH = h;
      // Untransformed tops: the lift moves a file's box up, so add it back.
      const tops = files.map((f, i) => f.getBoundingClientRect().top + lifts[i]!);
      files.forEach((file, i) => {
        const next = files[i + 1];
        if (!next) return;
        if (enabled) {
          lifts[i] = FILE_TAB * foldProgress(tops[i + 1]!);
          file.style.transform = lifts[i] ? `translateY(${-lifts[i]!}px)` : "";
          const overlap = overlapRatio(file.getBoundingClientRect(), next.getBoundingClientRect());
          file.style.filter = overlap > 0 ? `brightness(${1 - overlap * 0.25})` : "";
        }
        // Motion on: hide two back. Motion off (no lift): the next file covers this one fully, hide it once it arrives.
        file.style.visibility = foldHidden(enabled ? tops[i + 2] : tops[i + 1]) ? "hidden" : "";
      });
    };
    update();
    const stop = onFrame(update);
    return () => {
      stop();
      files.forEach((f) => {
        f.style.transform = "";
        f.style.filter = "";
        f.style.visibility = "";
      });
    };
  }, [enabled]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
