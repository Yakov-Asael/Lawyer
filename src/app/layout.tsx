import type { Metadata, Viewport } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import { site } from "@content";
import { A11yMenu } from "@/components/a11y/A11yMenu";
import { ContactDock } from "@/components/dock/ContactDock";
import { Footer } from "@/components/footer/Footer";
import { MotionBoot, MotionProvider } from "@/components/motion";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const serif = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-frank-ruhl",
});

const sans = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-assistant",
});

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
    <html lang="he" dir="rtl" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
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
