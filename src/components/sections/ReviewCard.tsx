"use client";

import { useEffect, useRef, useState } from "react";
import { practiceArea, site, type Review } from "@content/data";

export const QUOTE_PATH =
  "M0 26V15C0 6.7 4.4 1.7 13 0l1.5 3.4C9.6 5 7.2 8 7 12h7v14zm19 0V15c0-8.3 4.4-13.3 13-15l1.5 3.4C28.6 5 26.2 8 26 12h7v14z";

/**
 * One review (spec 09): quote clamped to four lines. "קראו עוד" appears only when the text actually overflows and
 * opens the full review in the reader dialog, so cards never change height and the row stays even.
 */
export function ReviewCard({ review, onReadMore }: { review: Review; onReadMore: (opener: HTMLElement) => void }) {
  const quote = useRef<HTMLQuoteElement>(null);
  const [clamped, setClamped] = useState(false);
  const labels = site.reviewsHead;

  useEffect(() => {
    const el = quote.current;
    if (!el) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="flex h-full min-h-[300px] flex-col gap-4 rounded-[24px] bg-paper px-7 pt-[30px] pb-[26px] text-ink shadow-review desk:px-8 desk:pt-[34px] desk:pb-[30px]">
      <svg viewBox="0 0 34 26" aria-hidden="true" focusable="false" className="h-[26px] w-[34px] fill-brass">
        <path d={QUOTE_PATH} />
      </svg>
      <blockquote ref={quote} className="line-clamp-4 text-[15.5px] leading-[1.75] tablet:text-[17px]">
        {review.quote}
      </blockquote>
      {clamped && (
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={(e) => onReadMore(e.currentTarget)}
          className="self-start py-1 text-[15px] font-bold text-brass-deep hover:underline"
        >
          {labels.readMore}
        </button>
      )}
      <figcaption className="mt-auto pt-[18px] font-bold text-brass-deep">
        <Attribution review={review} />
      </figcaption>
    </figure>
  );
}

/** The full review inside the reader dialog: quote mark, the whole quote in serif, name and area. */
export function ReviewReader({ review }: { review: Review }) {
  return (
    <figure className="grid gap-[18px]">
      <blockquote className="font-serif text-[clamp(1.15rem,2.2vw,1.35rem)] leading-[1.75]">{review.quote}</blockquote>
      <figcaption className="border-t border-bark pt-4 font-bold text-brass-deep">
        <Attribution review={review} />
      </figcaption>
    </figure>
  );
}

/** Client name, then the practice area when the review names one. */
function Attribution({ review }: { review: Review }) {
  return (
    <>
      {review.clientName}
      {review.area && <span className="block text-sm font-normal text-muted">{practiceArea(review.area).tabLabel}</span>}
    </>
  );
}
