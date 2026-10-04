"use client";

import { useRef } from "react";
import { site } from "@content";
import { useScrollProgress } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { remap } from "@/lib/motion";

/** Fill window on the section's viewport progress: starts at .18, full at .5 (section centre at viewport centre). */
const FILL_START = 0.18;
const FILL_SPAN = 0.32;

/**
 * Years of practice (spec 05): the office's one hard number, made physical.
 * The numeral is decorative (aria-hidden); the heading states the fact in words, the body the licensing years.
 * Education lives in the About facts (prototype, 2026-10-04).
 */
export function Years() {
  const { office, years } = site;
  const section = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useScrollProgress(section, (progress) => {
    const el = fill.current;
    if (!el) return;
    const filled = remap(progress, FILL_START, FILL_SPAN);
    el.style.clipPath = `inset(${(1 - filled) * 100}% 0 0 0)`;
  });

  return (
    <section
      ref={section}
      aria-labelledby="years-title"
      className="on-dark relative grid items-center gap-[30px] overflow-hidden rounded-lg bg-field px-gutter py-[clamp(60px,8vw,120px)] text-on-dark desk:grid-cols-[auto_1fr] desk:gap-[clamp(40px,6vw,100px)]"
    >
      <div aria-hidden="true" dir="ltr" className="relative type-numeral tracking-[-0.04em] tabular-nums">
        <span className="years-outline">{office.yearsOfPractice}</span>
        <span ref={fill} className="years-fill absolute inset-0 text-brass will-change-[clip-path]">
          {office.yearsOfPractice}
        </span>
      </div>

      <div>
        <SectionHeading
          id="years-title"
          eyebrow={years.eyebrow}
          lines={[years.heading]}
          by="word"
          size="years"
          intro={years.body}
          introClassName="mt-[18px] max-w-[30em]"
        />
      </div>
    </section>
  );
}
