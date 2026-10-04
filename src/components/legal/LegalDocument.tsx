import { ArrowLeft, ChevronDown } from "lucide-react";
import type { LegalPage } from "@content/data";
import { site } from "@content/data";
import { formatDate } from "@/lib/format-date";
import { LegalContactCard } from "./LegalContactCard";
import { LegalTitleCard } from "./LegalTitleCard";

/** Stable in-page anchor of clause n (1-based); legal documents are cited by clause number. */
export const clauseId = (n: number) => `clause-${n}`;

function TocLinks({ page }: { page: LegalPage }) {
  return (
    <ol className="grid gap-0.5">
      {page.sections.map((section, i) => (
        <li key={section.heading}>
          <a
            href={`#${clauseId(i + 1)}`}
            className="flex min-h-11 items-baseline gap-3 py-2 text-[15px] text-muted no-underline transition-colors hover:text-ink"
          >
            <span className="num w-5 shrink-0 font-serif text-brass-deep">{i + 1}.</span>
            {section.heading}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * The shared legal-page template (specs 16, 17): dark title card, then a table of contents (sticky on desktop,
 * collapsible on phones) beside numbered clauses in a readable column. Static: no scroll animations.
 */
export function LegalDocument({ page }: { page: LegalPage }) {
  const { legal } = site;

  return (
    <>
      <LegalTitleCard
        title={page.title}
        meta={
          <>
            {legal.updatedLabel}: <time dateTime={page.updatedAt} className="num">{formatDate(page.updatedAt)}</time>
          </>
        }
        intro={page.intro}
      />

      <div className="mx-auto grid max-w-content items-start gap-8 px-gutter pt-[clamp(36px,6vw,80px)] pb-[clamp(60px,9vw,120px)] desk:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] desk:gap-[clamp(48px,7vw,110px)]">
        <nav aria-label={legal.tocLabel} className="desk:sticky desk:top-10">
          <details className="group rounded-lg border border-bark bg-paper desk:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 font-serif text-[1.05rem] font-bold [&::-webkit-details-marker]:hidden">
              {legal.tocLabel}
              <ChevronDown
                className="size-5 text-brass-deep transition-transform duration-300 group-open:rotate-180"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </summary>
            <div className="border-t border-bark px-5 py-2">
              <TocLinks page={page} />
            </div>
          </details>
          <div className="hidden desk:block">
            <p className="border-b border-ink pb-3 font-serif text-[1.05rem] font-bold">{legal.tocLabel}</p>
            <div className="pt-2">
              <TocLinks page={page} />
            </div>
          </div>
        </nav>

        <article className="min-w-0">
          {page.sections.map((section, i) => {
            const n = i + 1;
            return (
              <section
                key={section.heading}
                id={clauseId(n)}
                aria-labelledby={`${clauseId(n)}-title`}
                className="border-t border-bark pt-8 pb-10 first:border-ink first:pt-6"
              >
                <h2 id={`${clauseId(n)}-title`} className="flex items-baseline gap-4 font-serif text-[1.35rem] leading-[1.25] font-bold tablet:text-[1.7rem]">
                  <span className="num shrink-0 text-brass-deep">{n}.</span>
                  <span>{section.heading}</span>
                </h2>
                <div className="mt-4 grid max-w-[70ch] gap-4 text-[16px] leading-[1.75] text-ink tablet:text-[17px]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.items && (
                    <ul className="grid gap-2.5">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="relative ps-6 before:absolute before:start-0 before:top-[0.72em] before:size-[6px] before:rounded-full before:bg-brass"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.links && (
                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-bark underline-offset-[5px] transition-colors hover:decoration-brass-deep"
                          >
                            {link.label}
                            {/* "Forward" points left in RTL. */}
                            <ArrowLeft className="size-4 text-brass-deep" strokeWidth={1.8} aria-hidden="true" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {section.contact && <LegalContactCard contact={section.contact} />}
              </section>
            );
          })}
        </article>
      </div>
    </>
  );
}
