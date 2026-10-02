"use client";

import { useRef } from "react";
import { useInViewOnce } from "@/components/motion";
import { cn } from "@/lib/utils";

/** The stamp variant's SVG: lands once when it enters the viewport (CSS `seal-stamp`). */
export function SealStamp({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInViewOnce(ref);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      data-in={inView ? "" : undefined}
      className={cn("seal-stamp size-[clamp(130px,16vw,190px)]", className)}
    >
      {children}
    </svg>
  );
}
