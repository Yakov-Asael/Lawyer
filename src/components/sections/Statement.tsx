"use client";

import { useRef } from "react";
import { site } from "@content/data";
import { Reveal, useScrollProgress } from "@/components/motion";
import { Eyebrow } from "@/components/shared";
import { readingProgress } from "@/lib/motion";
import { splitWords } from "@/lib/words";
import { cn } from "@/lib/utils";

/**
 * Statement (spec 04): the visitor's situation and the core promise.
 * Signature motion: words light up as the reader scrolls. The word spans are presentational (aria-hidden);
 * assistive tech reads one visually hidden copy of the paragraph, so it is never read word by word.
 */
export function Statement() {
  const { statement } = site;
  const pieces = splitWords(statement.text, statement.highlight);
  const paragraph = useRef<HTMLParagraphElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);
  const litCount = useRef(-1);

  useScrollProgress(
    paragraph,
    (progress) => {
      const list = words.current;
      const lit = Math.round(progress * list.length);
      if (lit === litCount.current) return;
      litCount.current = lit;
      list.forEach((word, i) => word.classList.toggle("is-lit", i < lit));
    },
    readingProgress,
  );

  let wordIndex = 0;

  return (
    <section
      aria-label={statement.label}
      className="mx-auto max-w-wide px-gutter pt-[72px] pb-14 tablet:pt-[clamp(90px,13vw,190px)] tablet:pb-[clamp(70px,10vw,140px)]"
    >
      <p ref={paragraph} className="type-statement font-medium text-pretty">
        <span className="sr-only">{statement.text}</span>
        <span aria-hidden="true">
          {pieces.map((piece, i) => {
            if (piece.space) return piece.text;
            const index = wordIndex++;
            return (
              <span
                key={i}
                ref={(el) => {
                  if (el) words.current[index] = el;
                }}
                className={cn("scrub-word", piece.highlight && "text-brass-deep")}
              >
                {piece.text}
              </span>
            );
          })}
        </span>
      </p>

      <Reveal className="mt-[30px] flex flex-wrap items-center gap-x-[30px] gap-y-[18px] text-muted tablet:mt-12">
        <Eyebrow>{statement.footLabel}</Eyebrow>
        <span>{statement.footText}</span>
      </Reveal>
    </section>
  );
}
