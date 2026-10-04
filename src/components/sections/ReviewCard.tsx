"use client";

import { useEffect, useId, useRef, useState } from "react";
import { practiceArea, site, type Review } from "@content/data";

/** One review (spec 09): quote clamped to four lines, with "קראו עוד" only when the text actually overflows. */
export function ReviewCard({ review }: { review: Review }) {
  const quote = useRef<HTMLQuoteElement>(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  const quoteId = useId();
  const labels = site.reviewsHead;

  useEffect(() => {
    const el = quote.current;
    if (!el || open) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 2);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  return (
    <figure className="flex h-full min-h-[300px] flex-col gap-4 rounded-[24px] bg-paper px-7 pt-[30px] pb-[26px] text-ink shadow-review desk:px-8 desk:pt-[34px] desk:pb-[30px]">
      <svg viewBox="0 0 34 26" aria-hidden="true" focusable="false" className="h-[26px] w-[34px] fill-brass">
        <path d="M0 26V15C0 6.7 4.4 1.7 13 0l1.5 3.4C9.6 5 7.2 8 7 12h7v14zm19 0V15c0-8.3 4.4-13.3 13-15l1.5 3.4C28.6 5 26.2 8 26 12h7v14z" />
      </svg>
      <blockquote
        ref={quote}
        id={quoteId}
        className={open ? "text-[15.5px] leading-[1.75] tablet:text-[17px]" : "line-clamp-4 text-[15.5px] leading-[1.75] tablet:text-[17px]"}
      >
        {review.quote}
      </blockquote>
      {(clamped || open) && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={quoteId}
          onClick={() => setOpen((v) => !v)}
          className="self-start py-1 text-[15px] font-bold text-brass-deep hover:underline"
        >
          {open ? labels.readLess : labels.readMore}
        </button>
      )}
      <figcaption className="mt-auto pt-[18px] font-bold text-brass-deep">
        {review.clientName}
        <span className="block text-sm font-normal text-muted">{practiceArea(review.area).tabLabel}</span>
      </figcaption>
    </figure>
  );
}
