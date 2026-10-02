import { site } from "@content";
import { MaskText, Reveal } from "@/components/motion";

/**
 * Foundations placeholder. Sections replace this one by one as their specs are approved (specs 02-14).
 * It only proves the shell: RTL, fonts, tokens, frame, the content contract and the motion primitives.
 */
export default function Home() {
  const { office } = site;

  return (
    <>
      <section className="on-dark rounded-lg bg-ink px-gutter py-section" aria-labelledby="shell-title">
        <div className="mx-auto max-w-content">
          <MaskText
            as="h1"
            id="shell-title"
            lines={[site.hero.line1, site.hero.line2]}
            lineClassNames={[undefined, "text-brass"]}
            delay={150}
            stagger={150}
            className="font-serif text-[clamp(2rem,7.2vw,7.4rem)] leading-[1.08] tablet:leading-[0.98]"
          />
          <Reveal as="p" delay={400} className="mt-6 max-w-[60ch] text-on-dark-soft">
            {site.hero.sub}
          </Reveal>
          <Reveal as="p" delay={550} className="mt-10 text-on-dark-soft">
            {office.name} · {office.title} · {office.address}, {office.city} ·{" "}
            <span className="num">{office.phoneDisplay}</span>
          </Reveal>
        </div>
      </section>

      <section className="px-gutter py-section" aria-labelledby="shell-years">
        <div className="mx-auto max-w-content">
          <MaskText
            id="shell-years"
            lines={[site.years.heading]}
            by="word"
            stagger={60}
            className="font-serif text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.05]"
          />
          <Reveal as="p" delay={150} className="mt-6 max-w-[60ch] text-muted" data-testid="below-fold-reveal">
            {site.years.body}
          </Reveal>
        </div>
      </section>
    </>
  );
}
