import { MaskText, Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  /** id of the h2, for the section's aria-labelledby. */
  id: string;
  eyebrow?: string;
  /** Heading lines; each one masks in on its own. */
  lines: readonly string[];
  lineClassNames?: readonly (string | undefined)[];
  /** Optional intro paragraph under the heading. */
  intro?: string;
  /** Type role from the scale: section H2 by default. */
  size?: "h2" | "areas" | "final";
  className?: string;
};

const sizeClass = { h2: "type-h2", areas: "type-h2-areas", final: "type-h2-final" } as const;

/** Eyebrow + masked H2 + optional intro (spec 01). */
export function SectionHeading({
  id,
  eyebrow,
  lines,
  lineClassNames,
  intro,
  size = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      {eyebrow && (
        <Reveal as="span" className="mb-4">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <MaskText as="h2" id={id} lines={lines} lineClassNames={lineClassNames} className={sizeClass[size]} />
      {intro && (
        <Reveal as="p" delay={120} className="mt-6 max-w-[60ch] type-lead text-muted on-dark:text-on-dark-soft">
          {intro}
        </Reveal>
      )}
    </div>
  );
}
