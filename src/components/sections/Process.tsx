import { site } from "@content/data";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { TrackFill } from "./TrackFill";

/**
 * Process (spec 07): three steps, and the first takes a minute.
 * An ordered list, because the sequence is the information. On desktop a 1px track runs from the first circle's
 * centre to the last; with three equal columns and a 40px gap, a column centre sits (100% - 80px) / 6 in from each edge.
 */
export function Process() {
  const { processHead, process } = site;

  return (
    <section aria-labelledby="process-title" className="rounded-lg bg-paper px-gutter py-[clamp(70px,9vw,130px)]">
      <div className="mx-auto max-w-content">
        <SectionHeading
          id="process-title"
          eyebrow={processHead.eyebrow}
          lines={[processHead.heading]}
          by="word"
          className="[&_h2]:max-w-[14em]"
        />

        <div className="relative mt-[clamp(50px,7vw,90px)]">
          <div
            aria-hidden="true"
            data-track
            className="absolute inset-x-[calc((100%-80px)/6)] top-[27px] hidden h-px overflow-hidden bg-bark desk:block"
          >
            <TrackFill />
          </div>

          <ol className="relative grid gap-11 desk:grid-cols-3 desk:gap-10">
            {process.map((step, i) => (
              <Reveal key={step.title} as="li" delay={i * 120} className="grid justify-items-center gap-3.5 text-center">
                <span
                  data-step-number
                  className="relative z-10 grid size-[54px] place-items-center rounded-full border-[1.5px] border-brass-deep bg-paper font-serif text-[22px] font-bold text-brass-deep text-trim"
                >
                  {i + 1}
                </span>
                <h3 className="mt-2.5 type-h3-step font-bold">{step.title}</h3>
                <p className="max-w-[22em] text-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
