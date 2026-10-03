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

/** The landing page. Sections follow the approved prototype order; header and footer live in the root layout. */
export default function Home() {
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
    </>
  );
}
