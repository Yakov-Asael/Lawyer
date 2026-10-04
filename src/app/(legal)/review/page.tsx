import type { Metadata } from "next";
import { site } from "@content/data";
import { LegalTitleCard } from "@/components/legal/LegalTitleCard";
import { ReviewForm } from "@/components/review/ReviewForm";
import { buttonVariants } from "@/components/ui/button";

const copy = site.reviewForm;

/** A utility page for clients Yossi sends the link to, so it stays out of search results and the sitemap. */
export const metadata: Metadata = {
  title: copy.title,
  alternates: { canonical: "/review" },
  robots: { index: false, follow: true },
};

/**
 * /review (spec 18): the review form as a page, on the legal template. ?area=family|torts|real-estate|notary
 * preselects the practice area, so Yossi can send a ready link after a case closes.
 */
export default function ReviewPage() {
  return (
    <>
      <LegalTitleCard title={copy.title} intro={copy.note} />
      <div className="mx-auto max-w-[640px] px-gutter pt-[clamp(36px,6vw,80px)] pb-[clamp(60px,9vw,120px)]">
        <div className="rounded-lg border border-bark bg-paper px-[22px] py-[26px] shadow-file min-[700px]:px-[34px] min-[700px]:py-[34px]">
          <ReviewForm
            areaFromUrl
            doneHeading="h2"
            doneAction={
              // A full load, like the other links home from the legal template.
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a href="/" className={buttonVariants({ variant: "line" })}>
                {site.legal.backLabel}
              </a>
            }
          />
        </div>
      </div>
    </>
  );
}
