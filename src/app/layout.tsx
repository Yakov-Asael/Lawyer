import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@content";
import { A11yMenu } from "@/components/a11y/A11yMenu";
import { ContactDock } from "@/components/dock/ContactDock";
import { Footer } from "@/components/footer/Footer";
import { MotionBoot, MotionProvider } from "@/components/motion";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

/*
 * Fonts are self-hosted (src/app/fonts, the Google Fonts variable woff2 subsets, SIL OFL), so a build never downloads
 * them: a failed fetch to Google Fonts broke a production build on Netlify (2026-11-28). Each family is two faces, a
 * Hebrew subset and a Latin one; the CSS stack lists Hebrew first, and the browser takes Latin glyphs from the next
 * face. Only the Latin face gets a metric-adjusted fallback, so that fallback never catches Latin text first.
 */
const frankRuhlHebrew = localFont({
  src: "./fonts/frank-ruhl-libre-hebrew.woff2",
  weight: "400 900",
  display: "swap",
  variable: "--font-frank-ruhl",
  adjustFontFallback: false,
});
const frankRuhlLatin = localFont({
  src: "./fonts/frank-ruhl-libre-latin.woff2",
  weight: "400 900",
  display: "swap",
  variable: "--font-frank-ruhl-latin",
  adjustFontFallback: "Times New Roman",
});

const assistantHebrew = localFont({
  src: "./fonts/assistant-hebrew.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-assistant",
  adjustFontFallback: false,
});
const assistantLatin = localFont({
  src: "./fonts/assistant-latin.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-assistant-latin",
  adjustFontFallback: "Arial",
});

const fontVariables = [frankRuhlHebrew, frankRuhlLatin, assistantHebrew, assistantLatin].map((f) => f.variable).join(" ");

const { office, seo } = site;

/** Site-wide metadata (spec 16). Each page sets its own canonical; the share image is design/og (pnpm og). */
export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: `${office.name} | ${office.title} ב${office.city}`, template: `%s | ${office.name}` },
  description: seo.description,
  applicationName: office.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: office.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: seo.ogImageAlt }],
  },
  twitter: { card: "summary_large_image", images: [{ url: "/og.png", alt: seo.ogImageAlt }] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: MotionBoot adds motion/intro classes to <html> before React hydrates.
    <html lang="he" dir="rtl" className={fontVariables} suppressHydrationWarning>
      <body>
        <MotionBoot />
        <a href="#content" className="skip-link">
          {site.ui.skipLink}
        </a>
        <MotionProvider>
          {/* Each route group brings its own header and <main id="content"> (home: hero header; legal: slim). */}
          {children}
          <Footer />
          <ContactDock />
          <A11yMenu />
        </MotionProvider>
      </body>
    </html>
  );
}
