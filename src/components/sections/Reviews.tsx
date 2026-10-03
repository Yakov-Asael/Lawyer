import type { Review } from "@content";
import { site } from "@content";
import { SectionHeading } from "@/components/shared";
import { getApprovedReviews } from "@/lib/reviews";
import { ReviewsSlider } from "./ReviewsSlider";

/**
 * Reviews (spec 09): curated by the office, published with consent. With no approved reviews the slider is not
 * rendered and the section shows a compact invitation instead.
 */
export function Reviews({ reviews = getApprovedReviews() }: { reviews?: readonly Review[] }) {
  const head = site.reviewsHead;
  const empty = reviews.length === 0;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="on-dark relative overflow-hidden rounded-lg bg-field py-[clamp(70px,9vw,130px)] text-on-dark"
    >
      <div className="mx-auto max-w-content px-gutter">
        <SectionHeading
          id="reviews-title"
          eyebrow={head.eyebrow}
          lines={[head.heading]}
          intro={empty ? head.empty : head.note}
          introClassName="mt-3.5 max-w-[26em]"
        />
      </div>
      {!empty && <ReviewsSlider reviews={reviews} />}
    </section>
  );
}
