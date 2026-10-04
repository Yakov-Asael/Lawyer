import type { Metadata } from "next";
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
import { absoluteUrl } from "@/lib/site-url";
import { jsonLdScript, officeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const officeData = officeJsonLd(site.office, {
  url: absoluteUrl("/"),
  image: absoluteUrl("/og.png"),
  description: site.seo.description,
});

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
      {/* LegalService + founder (spec 16); the FAQPage data lives with the FAQ section. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(officeData) }} />
    </>
  );
}
