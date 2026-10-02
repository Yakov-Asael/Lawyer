import type { Metadata, Viewport } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import { site } from "@content";
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
    <html lang="he" dir="rtl" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          {site.ui.skipLink}
        </a>
        <main id="content" tabIndex={-1} className="page-frame">
          {children}
        </main>
      </body>
    </html>
  );
}
