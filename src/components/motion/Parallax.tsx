"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotion } from "./MotionProvider";
import { useScrollProgress } from "./use-scroll-progress";

/**
 * Shifts itself vertically as its parent travels through the viewport: `factor` of its own height,
 * centred on the middle of the travel (factor 0.08 = 8%, negative moves against the scroll).
 */
export function Parallax({ factor, className, children }: { factor: number; className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const parent = useRef<Element | null>(null);
  const { enabled } = useMotion();

  useScrollProgress(parent, (p) => {
    const el = ref.current;
    if (!el) return;
    // Motion off: rest at the neutral position, not at the end of the travel.
    el.style.transform = enabled ? `translate3d(0, ${(p - 0.5) * factor * 100}%, 0)` : "";
  });

  return (
    <div
      ref={(el) => {
        ref.current = el;
        parent.current = el?.parentElement ?? null;
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  );
}
