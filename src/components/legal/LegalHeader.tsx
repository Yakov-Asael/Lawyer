import { ArrowRight } from "lucide-react";
import { site } from "@content";
import { Brand } from "@/components/header/Brand";
import { ContactButtons } from "@/components/shared";

/**
 * Slim header for the legal pages (spec 17): brand, a way back to the site, and the contact pair on wide screens
 * (phones have the contact dock). Sits over the top of the dark title card, like the home header over the hero.
 */
export function LegalHeader() {
  return (
    <header className="on-dark absolute inset-x-inset top-inset z-10 flex items-center justify-between gap-6 px-gutter py-[22px]">
      <Brand href="/" />
      <div className="flex items-center gap-6">
        {/* A full load on purpose (as the brand link): the home page sets its motion state before first paint. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-[15px] text-on-dark-soft no-underline transition-colors duration-200 hover:text-on-dark"
        >
          {/* "Back" points to the reading start, which is the right in RTL. */}
          <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          {site.legal.backLabel}
        </a>
        <ContactButtons tone="dark" size="compact" label={site.ui.whatsappShort} className="hidden nav:flex" />
      </div>
    </header>
  );
}
