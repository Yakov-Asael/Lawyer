import { site } from "@content/data";
import { ringGlyphs } from "@/lib/seal";
import { cn } from "@/lib/utils";
import { SealSpin } from "./SealSpin";
import { SealStamp } from "./SealStamp";

/**
 * The notary seal, the site's brand mark (spec 01). Decorative: always aria-hidden.
 * - hero:  ink disc, brass rings and ring text, turns with scroll
 * - stamp: brass disc, ink rings and text, lands once in view (final CTA)
 * - mark:  line only, 64px, currentColor (footer)
 */
type SealProps = { variant: "hero" | "stamp" | "mark"; className?: string };

const C = 100; // centre of the 200x200 viewBox

function RingText({ radius, className }: { radius: number; className: string }) {
  return (
    <g className={className} data-ring="">
      {ringGlyphs(site.brand.sealRing).map(({ char, angle }, i) => (
        <text key={i} x={C} y={C - radius} textAnchor="middle" transform={`rotate(${angle} ${C} ${C})`}>
          {char}
        </text>
      ))}
    </g>
  );
}

export function Seal({ variant, className }: SealProps) {
  const { monogram } = site.office;

  if (variant === "mark") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={cn("size-16 text-brass-deep", className)}>
        <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <text x="32" y="39" textAnchor="middle" className="font-serif text-[19px] font-bold" fill="currentColor">
          {monogram}
        </text>
      </svg>
    );
  }

  if (variant === "stamp") {
    return (
      <SealStamp className={className}>
        <circle cx={C} cy={C} r="96" className="fill-brass" />
        <circle cx={C} cy={C} r="86" fill="none" className="stroke-ink" strokeWidth="1.4" />
        <circle cx={C} cy={C} r="58" fill="none" className="stroke-ink" strokeWidth="1.4" />
        <RingText radius={72} className="fill-ink font-sans text-[13px] font-bold" />
        <text x={C} y="110" textAnchor="middle" className="fill-ink font-serif text-[42px] font-bold">
          {monogram}
        </text>
      </SealStamp>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("aspect-square rounded-full bg-ink shadow-seal", className)}
    >
      <svg viewBox="0 0 200 200" focusable="false" className="size-full">
        <SealSpin>
          <circle cx={C} cy={C} r="92" fill="none" className="stroke-brass" strokeWidth="1.2" />
          <circle cx={C} cy={C} r="58" fill="none" className="stroke-brass" strokeWidth="1.2" />
          <RingText radius={74} className="fill-brass font-sans text-[13px] font-bold" />
        </SealSpin>
        <text x={C} y="108" textAnchor="middle" className="fill-on-dark font-serif text-[40px] font-bold">
          {monogram}
        </text>
        <text x={C} y="128" textAnchor="middle" className="fill-brass font-sans text-[11px] tracking-[2px]">
          {site.brand.sealSub}
        </text>
      </svg>
    </div>
  );
}
