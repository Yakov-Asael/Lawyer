"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { site, type Review } from "@content";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/components/ui/carousel";
import { ReviewCard } from "./ReviewCard";

/**
 * Endless reviews slider (spec 09). Embla loops by moving the real slides, so there are no clones and assistive tech
 * meets each review once. Phones: one centred card with peeks, swipe only. 900px+: three cards and arrows.
 */
export function ReviewsSlider({ reviews }: { reviews: readonly Review[] }) {
  const labels = site.reviewsHead;

  return (
    <Carousel
      aria-roledescription={labels.roleDescription}
      aria-label={labels.carouselLabel}
      opts={{ loop: true, align: "center", breakpoints: { "(min-width: 900px)": { align: "start" } } }}
      className="mt-[clamp(40px,6vw,64px)] desk:mx-auto desk:max-w-content desk:px-gutter"
    >
      <CarouselContent className="-ms-3.5 pt-1.5 pb-6 desk:-ms-6">
        {reviews.map((review, i) => (
          <CarouselItem
            key={`${review.clientName}-${i}`}
            aria-label={`${i + 1} / ${reviews.length}`}
            className="basis-[calc(100vw-22vw-20px)] ps-3.5 desk:basis-1/3 desk:ps-6"
          >
            <ReviewCard review={review} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <Arrows prevLabel={labels.prev} nextLabel={labels.next} />
    </Carousel>
  );
}

/** Desktop arrows. "Next" points left in RTL. */
function Arrows({ prevLabel, nextLabel }: { prevLabel: string; nextLabel: string }) {
  const { scrollPrev, scrollNext } = useCarousel();
  const button =
    "grid size-[52px] place-items-center rounded-full border-[1.5px] border-on-dark/35 text-on-dark transition-colors duration-[250ms] hover:border-brass hover:bg-brass hover:text-ink [&_svg]:size-5";

  return (
    <div data-arrows className="mt-[18px] hidden justify-end gap-2.5 desk:flex">
      <button type="button" aria-label={prevLabel} onClick={scrollPrev} className={button}>
        <ArrowRight strokeWidth={1.8} aria-hidden="true" />
      </button>
      <button type="button" aria-label={nextLabel} onClick={scrollNext} className={button}>
        <ArrowLeft strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
}
