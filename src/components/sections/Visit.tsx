import { MapPin } from "lucide-react";
import { site } from "@content/data";
import { WazeIcon, WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { ButtonLink } from "@/components/ui/button";
import { mapsLink, waLink, wazeLink } from "@/lib/contact";

/**
 * Visit (spec 11): where, when, parking and access, and one-tap navigation.
 * Hours and the access line render only when they exist in content. The map is a static, cookie-free drawing that
 * links to Google Maps; the live embed waits for the privacy notice (spec 16).
 */
export function Visit() {
  const { office, visit, ui } = site;

  return (
    <section id="visit" aria-labelledby="visit-title" className="rounded-lg bg-bark px-gutter py-[clamp(60px,8vw,110px)]">
      <div className="mx-auto grid max-w-content items-center gap-[clamp(36px,5vw,70px)] desk:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading id="visit-title" eyebrow={visit.eyebrow} lines={[visit.heading]} />
          <Reveal as="p" delay={80} className="mt-[22px] font-serif text-[1.1rem] font-bold tablet:text-[clamp(1.4rem,2.2vw,1.9rem)]">
            {office.address}, {office.city}
          </Reveal>
          {office.accessAndParking && (
            <Reveal as="p" delay={120} data-testid="visit-access" className="mt-3 max-w-[28em] text-[15px] text-muted tablet:text-[17px]">
              {office.accessAndParking}
            </Reveal>
          )}
          {office.hours && (
            <Reveal as="p" delay={140} data-testid="visit-hours" className="mt-1.5 text-muted">
              {office.hours}
            </Reveal>
          )}
          <Reveal delay={180} className="mt-7">
            <ButtonLink href={waLink()} variant="ink">
              <WhatsAppIcon />
              <span>{visit.whatsappCta}</span>
            </ButtonLink>
          </Reveal>
          <Reveal delay={220} className="mt-4 flex gap-2.5">
            <ButtonLink href={wazeLink()} variant="ink" shape="icon" size="compact" aria-label={ui.wazeLabel} title="Waze">
              <WazeIcon strokeWidth={1.7} />
            </ButtonLink>
            <ButtonLink href={mapsLink()} variant="ink" shape="icon" size="compact" aria-label={ui.mapsLabel} title="Google Maps">
              <MapPin strokeWidth={1.7} aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <a
            href={mapsLink()}
            target="_blank"
            rel="noopener"
            aria-label={visit.mapLabel}
            data-map
            className="relative block aspect-[16/11] overflow-hidden rounded-lg border border-map-edge bg-map-ground shadow-map"
          >
            <span aria-hidden="true" className="map-streets" />
            {/* Pin tip on the exact centre: centred with inset-x-0 + mx-auto, lifted by its own height. */}
            <MapPin
              aria-hidden="true"
              strokeWidth={1.6}
              className="absolute inset-x-0 top-1/2 mx-auto size-[46px] -translate-y-full fill-brass-deep text-paper drop-shadow-[0_8px_10px_var(--map-edge)]"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
