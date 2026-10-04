import { site } from "@content/data";

/**
 * Intro loader (spec 03): seal rings draw, monogram and name appear, the curtain slides up.
 * CSS only and decorative. Hidden on repeat loads in the session and under reduced motion (see globals.css).
 */
export function IntroCurtain() {
  return (
    <div className="curtain" aria-hidden="true">
      <div className="grid justify-items-center gap-[22px]">
        <svg viewBox="0 0 120 120" className="size-[120px]" focusable="false">
          <circle className="curtain-ring" cx="60" cy="60" r="54" />
          <circle className="curtain-ring" cx="60" cy="60" r="42" />
          <text x="60" y="72" textAnchor="middle" className="curtain-mono fill-brass font-serif text-[34px] font-bold">
            {site.office.monogram}
          </text>
        </svg>
        <div className="curtain-name font-serif text-[22px] tracking-[0.02em]">{site.office.shortName}</div>
      </div>
    </div>
  );
}
