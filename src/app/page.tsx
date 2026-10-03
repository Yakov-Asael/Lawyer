import { practiceArea, site } from "@content";
import { Hero } from "@/components/hero/Hero";
import { Statement } from "@/components/sections/Statement";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { PracticeAreas } from "@/components/sections/PracticeAreas";
import { Reviews } from "@/components/sections/Reviews";
import { Process } from "@/components/sections/Process";
import { Years } from "@/components/sections/Years";
import { Reveal } from "@/components/motion";
import { ContactButtons, Seal, SectionHeading } from "@/components/shared";
import { ButtonLink } from "@/components/ui/button";
import { mapsLink, wazeLink } from "@/lib/contact";
import { WazeIcon } from "@/components/icons";
import { MapPin } from "lucide-react";

/**
 * Foundations placeholder. Sections replace this one by one as their specs are approved (specs 02-14).
 * It exercises the shell and every shared component from spec 01 on both grounds.
 */
export default function Home() {
  const { office } = site;
  const family = practiceArea("family");

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

      {/* Shared-component showcase until practice areas (spec 06) and visit (spec 11) replace it. */}
      <div className="px-gutter py-section">
        <div className="mx-auto max-w-content">
          <Reveal delay={200} className=" flex flex-wrap items-center gap-4" data-testid="below-fold-reveal">
            <ContactButtons tone="light" topic={family.whatsappTopic} label={family.ctaLabel} />
            <ButtonLink href={wazeLink()} variant="line" shape="icon" aria-label={site.ui.wazeLabel} title="Waze">
              <WazeIcon strokeWidth={1.7} />
            </ButtonLink>
            <ButtonLink href={mapsLink()} variant="line" shape="icon" aria-label={site.ui.mapsLabel} title="Google Maps">
              <MapPin strokeWidth={1.7} aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      <section id="visit" className="on-dark relative isolate flex flex-col items-center overflow-hidden rounded-lg bg-ink px-gutter py-section text-center" aria-labelledby="shell-final">
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
