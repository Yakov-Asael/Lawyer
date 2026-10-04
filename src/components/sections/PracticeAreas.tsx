import { site, type PracticeArea } from "@content/data";
import { SectionHeading } from "@/components/shared";
import { ButtonLink } from "@/components/ui/button";
import { waLink } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { FileStack } from "./FileStack";

/**
 * Practice areas as stacked court files (spec 06). Every file sticks at 128px; FileStack folds the stack so only the
 * previous and the current tab show. Colours follow the file order: ink, field, paper, ink, brass.
 */

type Tone = { surface: string; dot: string; lead: string; rule: string; cta: "brass" | "ink" };

const TONES: readonly Tone[] = [
  { surface: "on-dark bg-ink text-on-dark", dot: "before:bg-brass", lead: "text-on-dark-soft", rule: "border-line-dark", cta: "brass" },
  { surface: "on-dark bg-field text-on-dark", dot: "before:bg-brass", lead: "text-on-dark-soft", rule: "border-line-dark", cta: "brass" },
  { surface: "bg-paper text-ink", dot: "before:bg-ink", lead: "text-muted", rule: "border-bark", cta: "ink" },
  { surface: "on-dark bg-ink text-on-dark", dot: "before:bg-brass", lead: "text-on-dark-soft", rule: "border-line-dark", cta: "brass" },
  // Brass ground: the default brass-deep focus ring would vanish, so it switches to ink.
  { surface: "bg-brass text-ink [--focus:var(--ink)]", dot: "before:bg-ink", lead: "text-ink", rule: "border-ink/20", cta: "ink" },
];

function CourtFile({ area, index }: { area: PracticeArea; index: number }) {
  const tone = TONES[index % TONES.length]!;
  const headingId = `area-${area.id}`;

  return (
    <article
      data-file
      aria-labelledby={headingId}
      className="sticky top-[128px]"
    >
      <div
        className={cn(
          "-mb-px flex min-h-11 w-fit items-center gap-2.5 rounded-t-[14px] px-[18px] pt-[9px] pb-2.5 text-[13px] font-bold tracking-[0.06em]",
          "before:size-[7px] before:shrink-0 before:rounded-full tablet:px-[22px] tablet:pt-2.5 tablet:pb-3 tablet:text-sm",
          tone.surface,
          tone.dot,
        )}
      >
        {area.tabLabel}
      </div>
      <div
        className={cn(
          "grid min-h-[clamp(340px,44vh,420px)] gap-7 rounded-md rounded-ss-none p-[clamp(28px,4vw,52px)] pt-[52px] shadow-file",
          "tablet:pt-[clamp(28px,4vw,52px)] desk:grid-cols-[1.1fr_1fr] desk:items-start",
          tone.surface,
        )}
      >
        <div>
          <h3 id={headingId} className="type-h3-file font-bold">
            {area.headline}
          </h3>
          <p className={cn("mt-3.5 max-w-[28em] type-lead", tone.lead)}>{area.lead}</p>
          <ButtonLink href={waLink(area.whatsappTopic)} variant={tone.cta} className="mt-[26px]">
            {area.ctaLabel}
          </ButtonLink>
        </div>
        <div>
          <ul>
            {area.services.map((service) => (
              <li
                key={service}
                className={cn(
                  "flex items-center gap-3 border-b py-2.5 text-[15px] tablet:py-[13px] tablet:text-[17px]",
                  "before:size-1.5 before:shrink-0 before:rounded-full before:bg-current before:opacity-55",
                  tone.rule,
                )}
              >
                {service}
              </li>
            ))}
          </ul>
          {area.servicesNote && <p className={cn("mt-3 text-sm", tone.lead)}>{area.servicesNote}</p>}
        </div>
      </div>
    </article>
  );
}

export function PracticeAreas() {
  const { areas, practiceAreas } = site;

  return (
    <section
      id="areas"
      aria-labelledby="areas-title"
      className="mx-auto max-w-wide px-gutter pt-[clamp(90px,12vw,170px)] pb-10"
    >
      <SectionHeading
        id="areas-title"
        eyebrow={areas.eyebrow}
        lines={[areas.line1, areas.line2]}
        size="areas"
        intro={areas.intro}
        introClassName="max-w-[34em]"
        className="mb-[clamp(40px,6vw,70px)]"
      />
      <FileStack className="grid gap-[clamp(24px,4vh,40px)]">
        {practiceAreas.map((area, i) => (
          <CourtFile key={area.id} area={area} index={i} />
        ))}
      </FileStack>
    </section>
  );
}
