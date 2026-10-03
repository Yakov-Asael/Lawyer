import { notFound } from "next/navigation";
import type { Review } from "@content";
import { Reviews } from "@/components/sections/Reviews";

/**
 * Dev-only preview of the reviews slider with sample data (there are no approved reviews yet).
 * 404 unless ENABLE_DEV_PREVIEWS=1, which only the Playwright web server sets; never on Netlify.
 */
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

const SAMPLE = "[ציטוט לדוגמה בלבד, לבדיקת התצוגה. אינו המלצה אמיתית.]";
const LONG = `${SAMPLE} ${SAMPLE} ${SAMPLE} ${SAMPLE} ${SAMPLE} ${SAMPLE}`;
const AREAS = ["family", "torts", "real-estate", "notary", "family", "torts"] as const;

const samples: Review[] = AREAS.map((area, i) => ({
  quote: i % 2 === 0 ? LONG : `${SAMPLE} ${SAMPLE}`,
  clientName: `[לקוח לדוגמה ${i + 1}]`,
  area,
  consentConfirmed: true,
}));

export default function ReviewsPreview() {
  if (process.env.ENABLE_DEV_PREVIEWS !== "1") notFound();
  return <Reviews reviews={samples} />;
}
