"use client";

import { useRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "./use-in-view-once";

type RevealTag = "div" | "section" | "p" | "li" | "ul" | "ol" | "span" | "figure" | "blockquote";

type RevealProps<T extends RevealTag> = {
  as?: T;
  /** Stagger offset in ms, applied as the transition delay. */
  delay?: number;
} & ComponentPropsWithoutRef<T>;

/** Fades and lifts its content in once, when it enters the viewport (spec 00, `<Reveal>`). */
export function Reveal<T extends RevealTag = "div">({ as, delay = 0, className, style, ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInViewOnce(ref);

  return (
    <Tag
      {...rest}
      ref={ref}
      className={cn("reveal", className)}
      data-in={inView ? "" : undefined}
      style={{ ...style, "--d": `${delay}ms` } as CSSProperties}
    />
  );
}
