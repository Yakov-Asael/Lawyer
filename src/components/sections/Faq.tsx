import { isProductionBuild, site } from "@content/data";
import { Reveal } from "@/components/motion";
import { NumText, SectionHeading } from "@/components/shared";
import { faqJsonLd, publishedFaq } from "@/lib/faq";
import { jsonLdScript } from "@/lib/structured-data";

/**
 * FAQ (spec 10). Native <details>/<summary>: keyboard operable, exposes its expanded state, and works without JS.
 * Several items may be open at once. The JSON-LD is built from exactly the items rendered.
 */
export function Faq() {
  const head = site.faqHead;
  const items = publishedFaq(site.faq, isProductionBuild);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="mx-auto grid max-w-content items-start gap-10 px-gutter py-[clamp(90px,11vw,160px)] desk:grid-cols-[0.8fr_1.2fr] desk:gap-[clamp(50px,7vw,110px)]"
    >
      <SectionHeading
        id="faq-title"
        eyebrow={head.eyebrow}
        lines={[head.heading]}
        by="word"
        intro={head.intro}
        introClassName="mt-[18px] max-w-[24em]"
        className="desk:sticky desk:top-[110px]"
      />

      <div className="border-t border-ink">
        {items.map((item, i) => (
          <Reveal key={item.question} delay={i * 50}>
            <details className="faq-item group border-b border-bark">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-serif text-[1.02rem] leading-[1.3] font-medium transition-colors hover:text-brass-deep tablet:text-[clamp(1.25rem,1.9vw,1.6rem)] [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className={[
                    "relative size-[34px] shrink-0 rounded-full border-[1.5px] border-bark transition-[background-color,border-color] duration-300",
                    "group-open:border-ink group-open:bg-ink",
                    // Centred with inset-0 + m-auto, so RTL cannot shift the bars.
                    "before:absolute before:inset-0 before:m-auto before:h-[1.5px] before:w-3 before:bg-ink group-open:before:bg-stone",
                    "after:absolute after:inset-0 after:m-auto after:h-[1.5px] after:w-3 after:rotate-90 after:bg-ink",
                    "after:transition-transform after:duration-[450ms] after:ease-out group-open:after:rotate-0 group-open:after:bg-stone",
                  ].join(" ")}
                />
              </summary>
              <p className="max-w-[36em] pb-[26px] text-[15px] text-muted tablet:text-[17px]">
                <NumText text={item.answer} />
              </p>
            </details>
          </Reveal>
        ))}
      </div>

      <script
        type="application/ld+json"
        // Built from the same items as the visible list.
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(items)) }}
      />
    </section>
  );
}
