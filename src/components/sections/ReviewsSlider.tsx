"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { site, type Review } from "@content/data";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel";
import { SheetDialog, type SheetDialogHandle } from "@/components/ui/sheet-dialog";
import { QUOTE_PATH, ReviewCard, ReviewReader } from "./ReviewCard";

/**
 * Endless reviews slider (spec 09). Embla loops by moving the real slides, so there are no clones and assistive tech
 * meets each review once. Phones: one centred card with peeks, swipe only. 900px+: three cards, arrows on both sides
 * of the cards. "קראו עוד" opens one shared reader dialog.
 */
export function ReviewsSlider({ reviews }: { reviews: readonly Review[] }) {
  const labels = site.reviewsHead;
  const reader = useRef<SheetDialogHandle>(null);
  const [reading, setReading] = useState<Review | null>(null);

  return (
    <>
      <Carousel
        aria-roledescription={labels.roleDescription}
        aria-label={labels.carouselLabel}
        opts={{ loop: true, align: "center", breakpoints: { "(min-width: 900px)": { align: "start" } } }}
        className="mt-[clamp(40px,6vw,64px)] desk:mx-auto desk:max-w-[calc(var(--content-max)+136px)] desk:px-[calc(var(--gutter)+68px)]"
      >
        <div className="relative">
          <CarouselContent className="-ms-3.5 pt-1.5 pb-6 desk:-ms-6">
            {reviews.map((review, i) => (
              <CarouselItem
                key={`${review.clientName}-${i}`}
                aria-label={`${i + 1} / ${reviews.length}`}
                className="basis-[calc(100vw-22vw-20px)] ps-3.5 desk:basis-1/3 desk:ps-6"
              >
                <ReviewCard
                  review={review}
                  onReadMore={(opener) => {
                    setReading(review);
                    reader.current?.open(opener);
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <Arrows prevLabel={labels.prev} nextLabel={labels.next} />
        </div>
      </Carousel>

      <SheetDialog
        ref={reader}
        labelledBy="review-reader-title"
        closeLabel={labels.close}
        header={
          <>
            <h2 id="review-reader-title" className="sr-only">
              {labels.readerTitle}
            </h2>
            <svg viewBox="0 0 34 26" aria-hidden="true" focusable="false" className="h-[30px] w-10 fill-brass">
              <path d={QUOTE_PATH} />
            </svg>
          </>
        }
      >
        {reading && <ReviewReader review={reading} />}
      </SheetDialog>
    </>
  );
}

/** Desktop arrows on both sides of the cards, vertically centred on them. "Previous" is on the right in RTL. */
function Arrows({ prevLabel, nextLabel }: { prevLabel: string; nextLabel: string }) {
  const { scrollPrev, scrollNext } = useCarousel();
  const button =
    "pointer-events-auto grid size-[52px] place-items-center rounded-full border-[1.5px] border-on-dark/35 text-on-dark transition-colors duration-[250ms] hover:border-brass hover:bg-brass hover:text-ink [&_svg]:size-5";

  return (
    <div
      data-arrows
      className="pointer-events-none absolute -inset-x-[68px] top-1.5 bottom-6 hidden items-center justify-between desk:flex"
    >
      <button type="button" aria-label={prevLabel} onClick={scrollPrev} className={button}>
        <ArrowRight strokeWidth={1.8} aria-hidden="true" />
      </button>
      <button type="button" aria-label={nextLabel} onClick={scrollNext} className={button}>
        <ArrowLeft strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
}
