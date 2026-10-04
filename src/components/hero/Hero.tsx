import Image from "next/image";
import { site } from "@content";
import { Fragment, type CSSProperties } from "react";
import { Parallax } from "@/components/motion";
import { ContactButtons, Ruled, Seal } from "@/components/shared";
import { splitAround } from "@/lib/emphasis";
import portrait from "../../../design/assets/yossi-shukrun-cohen-portrait.webp";

/**
 * Hero (spec 03): who (face and name), why him (personal, 23 years of practice), how to reach him.
 * Dark inset card; the header sits over its top padding.
 * The entrance is CSS-only (`hero-in`, `hero-line` in globals.css): always in view at load, it needs no observer,
 * and the LCP text never waits for JavaScript.
 */

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
export function Hero() {
  const { hero, office } = site;
  const sub = splitAround(hero.sub, hero.subEmphasis);

  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative isolate grid min-h-[clamp(620px,calc(100svh-20px),940px)] items-end overflow-hidden rounded-lg bg-ink px-gutter pt-[120px] pb-[clamp(28px,5vw,64px)] text-on-dark"
    >
      <Parallax factor={-0.06} className="absolute inset-x-0 -inset-y-[20%] -z-10">
        <Ruled />
      </Parallax>

      <div className="grid items-end gap-10 desk:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)] desk:gap-[clamp(40px,5vw,90px)]">
        <div>
          <h1 id="hero-title" className="type-hero font-bold">
            {[hero.line1, hero.line2].map((line, i) => (
              <Fragment key={i}>
                {/* A real space between the stacked lines, so the heading reads as two sentences. */}
                {i > 0 && " "}
                <span className={i === 1 ? "mask-line-stacked font-medium text-brass" : "mask-line-stacked"}>
                  <span className="mask-piece hero-line">
                    <span style={delay(i * 150)}>{line}</span>
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>
          <p
            style={delay(400)}
            className="hero-in mt-[18px] max-w-[34em] text-[15px] text-on-dark-soft tablet:mt-7 tablet:text-[clamp(17px,1.35vw,20px)]"
          >
            {sub.before}
            {sub.match && <strong className="font-semibold text-on-dark">{sub.match}</strong>}
            {sub.after}
          </p>
          <div style={delay(550)} className="hero-in mt-6 tablet:mt-[34px]">
            <ContactButtons
              tone="dark"
              size="hero"
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 tablet:flex tablet:gap-3"
            />
          </div>
          <ul
            style={delay(700)}
            className="hero-in mt-[30px] flex flex-wrap gap-x-[22px] gap-y-2 text-[13px] text-on-dark-soft tablet:text-sm"
          >
            {[`${office.address}, ${office.city}`, office.title].map((item) => (
              <li key={item} className="inline-flex items-center gap-2 before:size-[5px] before:rounded-full before:bg-brass">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={delay(250)} className="hero-in relative w-[min(78%,340px)] justify-self-center desk:w-[min(100%,420px)]">
          <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[999px_999px_var(--radius-md)_var(--radius-md)] bg-field shadow-portrait after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_1px_var(--portrait-edge)]">
            <Parallax factor={0.08} className="absolute inset-x-0 -top-[8%] h-[116%]">
              <Image
                src={portrait}
                alt={hero.portraitAlt}
                fill
                loading="eager"
                fetchPriority="high"
                quality={90}
                sizes="(min-width: 900px) 420px, min(78vw, 340px)"
                className="object-cover object-[50%_30%]"
              />
            </Parallax>
          </div>
          <Seal
            variant="hero"
            className="absolute -start-5 bottom-[34px] w-[104px] desk:-start-[34px] desk:w-32"
          />
        </div>
      </div>
    </section>
  );
}
