"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/motion";
import { onFrame } from "@/lib/motion";

/** Rotates its SVG group with page scroll (0.12deg per px), on the shared frame loop. Still when motion is off. */
export function SealSpin({ children }: { children: React.ReactNode }) {
  const ref = useRef<SVGGElement>(null);
  const { enabled } = useMotion();

  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    if (!enabled) {
      g.style.transform = "";
      return;
    }
    let last = Number.NaN;
    return onFrame(() => {
      const y = window.scrollY;
      if (y === last) return;
      last = y;
      g.style.transform = `rotate(${y * 0.12}deg)`;
    });
  }, [enabled]);

  return (
    <g ref={ref} className="seal-spin">
      {children}
    </g>
  );
}
