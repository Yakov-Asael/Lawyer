import type { Metadata, Viewport } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import { site } from "@content";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { IntroCurtain } from "@/components/hero/IntroCurtain";
import { MotionBoot, MotionProvider } from "@/components/motion";
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

const { office } = site;

export const metadata: Metadata = {
  title: `${office.name} | ${office.title} ב${office.city}`,
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
        <IntroCurtain />
        <a href="#content" className="skip-link">
          {site.ui.skipLink}
        </a>
        <MotionProvider>
          <Header />
          <main id="content" tabIndex={-1} className="page-frame">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
