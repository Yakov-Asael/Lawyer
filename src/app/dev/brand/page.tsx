import { notFound } from "next/navigation";
import { site } from "@content/data";
import { Ruled, Seal } from "@/components/shared";

/**
 * Dev-only source of the brand rasters (spec 16): the 1200x630 share card and the app icon, drawn with the real
 * fonts and tokens. `pnpm brand-assets` screenshots them into public/og.png and src/app/icon.png / apple-icon.png.
 * 404 unless ENABLE_DEV_PREVIEWS=1; never on Netlify.
 */
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function BrandAssets() {
  if (process.env.ENABLE_DEV_PREVIEWS !== "1") notFound();
  const { office } = site;

  return (
    <div className="fixed inset-0 z-[2147483647] overflow-auto bg-stone">
      <div
        data-asset="og"
        className="on-dark relative isolate grid h-[630px] w-[1200px] grid-cols-[1fr_auto] items-center gap-14 overflow-hidden bg-ink px-[80px] text-on-dark"
      >
        <Ruled />
        <div>
          <p className="font-serif text-[30px] font-medium text-brass">{office.title}</p>
          <p className="mt-3 font-serif text-[80px] leading-[1.02] font-bold whitespace-nowrap">{office.name}</p>
          <div className="mt-10 h-px w-[120px] bg-brass" />
          <p className="mt-8 text-[28px] text-on-dark-soft">
            {office.address}, {office.city}
            <span className="mx-4 text-brass">·</span>
            <span className="num" dir="ltr">
              {office.phoneDisplay}
            </span>
          </p>
        </div>
        <Seal variant="hero" className="size-[300px]" />
      </div>

      <div data-asset="icon" className="mt-10 grid size-[512px] place-items-center bg-ink">
        <svg viewBox="0 0 64 64" aria-hidden="true" className="size-[440px] text-brass">
          <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <text x="32" y="40.5" textAnchor="middle" className="font-serif text-[23px] font-bold" fill="currentColor">
            {office.monogram}
          </text>
        </svg>
      </div>
    </div>
  );
}
