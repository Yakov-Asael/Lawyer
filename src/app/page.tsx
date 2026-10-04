import { site } from "@content";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { PracticeAreas } from "@/components/sections/PracticeAreas";
import { Process } from "@/components/sections/Process";
import { Reviews } from "@/components/sections/Reviews";
import { Statement } from "@/components/sections/Statement";
import { Visit } from "@/components/sections/Visit";
import { Years } from "@/components/sections/Years";
import { ContactButtons, Seal, SectionHeading } from "@/components/shared";

/**
 * The landing page. Sections follow the approved prototype order; the final CTA and footer below are still
 * placeholders until specs 12 and 13 replace them.
 */
export default function Home() {
  const { office } = site;

  return (
    <>
      <Hero />
      <Statement />
      <Years />
      <PracticeAreas />
      <Process />
      <About />
      <Reviews />
      <Faq />
      <Visit />

      <section className="on-dark relative isolate flex flex-col items-center overflow-hidden rounded-lg bg-ink px-gutter py-section text-center" aria-labelledby="shell-final">
        <Seal variant="stamp" className="mb-8" />
        <SectionHeading
          id="shell-final"
          size="final"
          lines={[site.finalCta.line1, site.finalCta.line2]}
          lineClassNames={[undefined, "text-brass"]}
          intro={site.finalCta.body}
          className="items-center"
        />
        <ContactButtons tone="dark" className="mt-10" />
      </section>

      <div className="flex items-center gap-4 px-gutter py-12">
        <Seal variant="mark" />
        <p className="text-muted">
          {office.name} · {office.title} · {office.address}, {office.city}
        </p>
      </div>
    </>
  );
}
