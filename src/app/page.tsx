import { site } from "@content";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { PracticeAreas } from "@/components/sections/PracticeAreas";
import { Process } from "@/components/sections/Process";
import { Reviews } from "@/components/sections/Reviews";
import { Statement } from "@/components/sections/Statement";
import { Visit } from "@/components/sections/Visit";
import { Years } from "@/components/sections/Years";
import { Seal } from "@/components/shared";

/**
 * The landing page. Sections follow the approved prototype order; the footer below is still
 * a placeholder until spec 13 replaces it.
 */
export default function Home() {
  const { office } = site;

  return (
    <>
      <Hero />
      <Statement />
      <Years />
      <PracticeAreas />
      <Process />
      <About />
      <Reviews />
      <Faq />
      <Visit />

      <FinalCta />

      <div className="flex items-center gap-4 px-gutter py-12">
        <Seal variant="mark" />
        <p className="text-muted">
          {office.name} · {office.title} · {office.address}, {office.city}
        </p>
      </div>
    </>
  );
}
