import { site } from "@content/data";
import { Reveal } from "@/components/motion";
import { ContactButtons, Ruled, Seal, SectionHeading } from "@/components/shared";

/**
 * Final CTA (spec 12): one warm invitation to talk. The seal stamps down once when it comes into view
 * (SealStamp, CSS `seal-stamp`) and rests at -8deg under reduced motion.
 */
export function FinalCta() {
  const { finalCta } = site;

  return (
    <section
      aria-labelledby="final-title"
      className="on-dark relative isolate mt-inset grid justify-items-center overflow-hidden rounded-lg bg-ink px-gutter py-[clamp(80px,11vw,160px)] text-center text-on-dark"
    >
      <Ruled />
      <Seal variant="stamp" className="mb-[34px]" />
      <SectionHeading
        id="final-title"
        size="final"
        lines={[finalCta.line1, finalCta.line2]}
        lineClassNames={[undefined, "text-brass"]}
        intro={finalCta.body}
        introSize="final"
        introClassName="mt-[22px] max-w-[30em]"
        className="items-center"
      />
      <Reveal delay={250} className="mt-[38px]">
        {/* One row on phones too: the WhatsApp label stays, the call is an icon. */}
        <ContactButtons tone="dark" className="flex-nowrap justify-center" />
      </Reveal>
    </section>
  );
}
