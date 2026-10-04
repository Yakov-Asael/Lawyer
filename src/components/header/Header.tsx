import { site } from "@content";
import { ContactButtons } from "@/components/shared";
import { Brand } from "./Brand";
import { MobileMenu } from "./MobileMenu";

/**
 * Site header (spec 02): sits over the hero card, not sticky.
 * Rendered before <main> so it keeps the banner landmark and the skip link jumps past it.
 */
export function Header() {
  return (
    <header className="on-dark absolute inset-x-inset top-inset z-10 flex items-center justify-between gap-6 px-gutter py-[22px]">
      <Brand />
      <nav aria-label={site.ui.navLabel} className="hidden gap-[30px] text-[15px] nav:flex">
        {site.navigation.header.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-on-dark-soft no-underline transition-colors duration-200 hover:text-on-dark"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <ContactButtons tone="dark" size="compact" label={site.ui.whatsappShort} className="hidden nav:flex" />
      <MobileMenu />
    </header>
  );
}
