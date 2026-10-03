"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/components/motion";
import { remap } from "@/lib/motion";

/** Draw window on the section's viewport progress: starts at .3, complete just before the section is centred (.48). */
const START = 0.3;
const SPAN = 0.18;

/**
 * Yossi's signature drawing itself with scroll (spec 08). pathLength=1 normalises the stroke, so the dash maths
 * needs no measuring. Decorative: the name is already the heading.
 */
export function Signature({ viewBox, path }: { viewBox: string; path: string }) {
  const stroke = useRef<SVGPathElement>(null);
  const section = useRef<Element | null>(null);

  useScrollProgress(section, (p) => {
    const el = stroke.current;
    if (el) el.style.strokeDashoffset = String(1 - remap(p, START, SPAN));
  });

  return (
    <div
      aria-hidden="true"
      data-signature
      ref={(el) => {
        section.current = el?.closest("section") ?? null;
      }}
      className="mt-[34px]"
    >
      <svg viewBox={viewBox} className="h-auto w-[min(300px,80%)]" focusable="false">
        <path
          ref={stroke}
          d={path}
          pathLength={1}
          className="signature-path fill-none stroke-ink [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.2]"
        />
      </svg>
    </div>
  );
}
