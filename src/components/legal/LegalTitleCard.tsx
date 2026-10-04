import type { ReactNode } from "react";
import { Ruled, Seal } from "@/components/shared";

/**
 * The dark title card that opens every page in the legal template (specs 16 to 18): the slim header sits over its
 * top padding, like the home header over the hero. Static: no scroll animations.
 */
export function LegalTitleCard({ title, meta, intro }: { title: string; meta?: ReactNode; intro?: string }) {
  return (
    <section
      aria-labelledby="legal-title"
      className="on-dark relative isolate overflow-hidden rounded-lg bg-ink px-gutter pt-[clamp(120px,14vw,170px)] pb-[clamp(34px,5vw,64px)] text-on-dark"
    >
      <Ruled className="-z-10" />
      <Seal
        variant="mark"
        className="absolute -end-6 -bottom-8 -z-10 size-[clamp(150px,22vw,260px)] text-brass opacity-25"
      />
      <div className="mx-auto max-w-content">
        <h1 id="legal-title" className="type-h2 font-bold">
          {title}
        </h1>
        {meta && <p className="mt-4 text-[14px] text-on-dark-soft tablet:text-[15px]">{meta}</p>}
        {intro && <p className="type-lead mt-6 max-w-[40em] text-on-dark-soft">{intro}</p>}
      </div>
    </section>
  );
}
