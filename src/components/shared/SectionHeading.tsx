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
  /** Mask whole lines (default) or word by word, for a heading that should wrap freely. */
  by?: "line" | "word";
  /** Type role from the scale: section H2 by default. */
  size?: "h2" | "areas" | "final" | "years";
  /** Extra classes for the intro paragraph (measure, size). */
  introClassName?: string;
  className?: string;
};

const sizeClass = {
  h2: "type-h2",
  areas: "type-h2-areas",
  final: "type-h2-final",
  years: "type-h2-years",
} as const;

/** Eyebrow + masked H2 + optional intro (spec 01). */
export function SectionHeading({
  id,
  eyebrow,
  lines,
  lineClassNames,
  intro,
  by,
  size = "h2",
  introClassName,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      {eyebrow && (
        <Reveal as="span" className="mb-4">
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <MaskText
        as="h2"
        id={id}
        lines={lines}
        by={by}
        stagger={by === "word" ? 60 : undefined}
        lineClassNames={lineClassNames}
        className={sizeClass[size]}
      />
      {intro && (
        <Reveal as="p" delay={120} className={cn("mt-6 max-w-[60ch] type-lead text-muted on-dark:text-on-dark-soft", introClassName)}>
          {intro}
        </Reveal>
      )}
    </div>
  );
}
