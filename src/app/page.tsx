import { practiceArea, site } from "@content";
import { MaskText, Reveal } from "@/components/motion";
import { ContactButtons, Ruled, Seal, SectionHeading } from "@/components/shared";
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
      <section className="on-dark relative isolate overflow-hidden rounded-lg bg-ink px-gutter pt-[120px] pb-section" aria-labelledby="shell-title">
        <Ruled />
        <div className="mx-auto grid max-w-content items-center gap-12 desk:grid-cols-[1fr_auto]">
          <div>
            <MaskText
              as="h1"
              id="shell-title"
              lines={[site.hero.line1, site.hero.line2]}
              lineClassNames={[undefined, "text-brass"]}
              delay={150}
              stagger={150}
              className="type-hero"
            />
            <Reveal as="p" delay={400} className="mt-6 max-w-[60ch] type-lead text-on-dark-soft">
              {site.hero.sub}
            </Reveal>
            <Reveal delay={550} className="mt-10">
              <ContactButtons tone="dark" size="hero" />
            </Reveal>
          </div>
          <Seal variant="hero" className="w-[104px] desk:w-32" />
        </div>
      </section>

      <section id="about" className="px-gutter py-section" aria-labelledby="shell-years">
        <div className="mx-auto max-w-content">
          <SectionHeading
            id="shell-years"
            eyebrow={site.years.eyebrow}
            lines={[site.years.heading]}
            intro={site.years.body}
          />
          <Reveal delay={200} className="mt-10 flex flex-wrap items-center gap-4" data-testid="below-fold-reveal">
            <ContactButtons tone="light" topic={family.whatsappTopic} label={family.ctaLabel} />
            <ButtonLink href={wazeLink()} variant="line" shape="icon" aria-label={site.ui.wazeLabel} title="Waze">
              <WazeIcon strokeWidth={1.7} />
            </ButtonLink>
            <ButtonLink href={mapsLink()} variant="line" shape="icon" aria-label={site.ui.mapsLabel} title="Google Maps">
              <MapPin strokeWidth={1.7} aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

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
