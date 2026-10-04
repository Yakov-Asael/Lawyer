import Image from "next/image";
import { site } from "@content/data";
import { Parallax, Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import portrait from "../../../design/assets/yossi-shukrun-cohen-portrait.webp";
import { Signature } from "./Signature";

/**
 * About (spec 08): the person the client will meet, with verifiable facts only.
 * Every fact is derived from `office`; a fact without content (education) is left out, never shown as a placeholder.
 */
export function About() {
  const { about, office } = site;
  const labels = about.factLabels;

  const facts = [
    { label: labels.experience, value: `${office.yearsOfPractice} ${labels.years}` },
    { label: labels.license, value: office.title },
    { label: labels.office, value: office.city },
    ...(office.education ? [{ label: labels.education, value: office.education }] : []),
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto grid max-w-wide items-center gap-[50px] px-gutter py-[clamp(90px,11vw,170px)] desk:grid-cols-[0.85fr_1.15fr] desk:gap-[clamp(50px,7vw,120px)]"
    >
      <Reveal className="relative aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-lg bg-bark">
        <Parallax factor={0.07} className="absolute inset-x-0 -top-[8%] h-[116%]">
          <Image
            src={portrait}
            alt={about.photoAlt}
            fill
            sizes="(min-width: 900px) 460px, 100vw"
            quality={90}
            className="object-cover object-[50%_25%]"
          />
        </Parallax>
      </Reveal>

      <div>
        <SectionHeading id="about-title" eyebrow={about.eyebrow} lines={about.heading} />

        <div className="mt-6 grid max-w-[32em] gap-4 type-lead text-muted">
          {about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} as="p" delay={i * 80}>
              {paragraph}
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-[34px]">
          {/* A lone last fact (odd count, e.g. no education yet) spans the row so its hairline runs full width. */}
          <dl className="grid grid-cols-2 border-t border-bark">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid gap-0.5 border-b border-bark py-[18px] odd:pe-[18px] last:odd:col-span-2"
              >
                <dt className="text-[13px] tracking-[0.06em] text-muted">{fact.label}</dt>
                <dd className="font-serif text-base font-medium tablet:text-[21px]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {about.signature && <Signature viewBox={about.signature.viewBox} path={about.signature.path} />}
      </div>
    </section>
  );
}
