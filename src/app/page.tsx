import { site } from "@content";

/**
 * Foundations placeholder. Sections replace this one by one as their specs are approved (specs 02-14).
 * It only proves the shell: RTL, fonts, tokens, frame and the content contract.
 */
export default function Home() {
  const { office } = site;

  return (
    <section className="on-dark rounded-lg bg-ink px-gutter py-section" aria-labelledby="shell-title">
      <div className="mx-auto max-w-content">
        <h1 id="shell-title" className="font-serif text-[clamp(2rem,7.2vw,7.4rem)] leading-[1.08] tablet:leading-[0.98]">
          {site.hero.line1}
          <br />
          <span className="text-brass">{site.hero.line2}</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-on-dark-soft">{site.hero.sub}</p>
        <p className="mt-10 text-on-dark-soft">
          {office.name} · {office.title} · {office.address}, {office.city} ·{" "}
          <span className="num">{office.phoneDisplay}</span>
        </p>
      </div>
    </section>
  );
}
