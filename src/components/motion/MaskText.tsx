"use client";

import { Fragment, useRef, type CSSProperties, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "./use-in-view-once";

type MaskTag = "h1" | "h2" | "h3" | "p" | "span";

type MaskTextProps = {
  as?: MaskTag;
  /** Text lines, in reading order. Each line slides up out of its own mask. */
  lines: readonly string[];
  /** Split each line further into words, staggered one by one. */
  by?: "line" | "word";
  /** Render each line on its own row (true) or let lines flow and wrap (false). */
  stacked?: boolean;
  /** Start delay and per-step stagger, in ms. */
  delay?: number;
  stagger?: number;
  /** Extra classes per line, by index, e.g. the brass second line of a heading. */
  lineClassNames?: readonly (string | undefined)[];
  className?: string;
  id?: string;
};

/**
 * Line-by-line mask reveal for headings (spec 00, `<MaskText>`).
 * The text stays real text in the DOM: screen readers and copy-paste read it whole.
 */
export function MaskText({
  as = "h2",
  lines,
  by = "line",
  stacked = true,
  delay = 0,
  stagger = 100,
  lineClassNames,
  className,
  id,
}: MaskTextProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInViewOnce(ref);

  let step = 0;
  const piece = (text: string, key: string) => (
    <span key={key} className="mask-piece">
      <span style={{ "--d": `${delay + stagger * step++}ms` } as CSSProperties}>{text}</span>
    </span>
  );

  return (
    <Tag ref={ref} id={id} className={cn("mask", className)} data-in={inView ? "" : undefined}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className={cn("mask-line", stacked && "mask-line-stacked", lineClassNames?.[i])}>
            {by === "word"
              ? line.split(/\s+/).map((word, w) => (
                  <Fragment key={w}>
                    {w > 0 && " "}
                    {piece(word, `${i}-${w}`)}
                  </Fragment>
                ))
              : piece(line, `${i}`)}
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
