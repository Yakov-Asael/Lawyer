import { MapPin, Phone } from "lucide-react";
import { site } from "@content/data";
import { WazeIcon, WhatsAppIcon } from "@/components/icons";
import { Seal } from "@/components/shared";
import { mapsLink, telLink, waLink, wazeLink } from "@/lib/contact";
import { menuLinks } from "@/lib/navigation";
import { getApprovedReviews } from "@/lib/reviews";
import { cn } from "@/lib/utils";

/** Rendered once at build time. */
const YEAR = new Date().getFullYear();

/**
 * Footer (spec 13): identity, contact shortcuts, navigation and legal links. Lives in the root layout after <main>,
 * so it is the page's contentinfo landmark and also closes the legal pages; section links therefore point at "/#id".
 */
export function Footer() {
  const { office, ui, legal, navigation } = site;
  const callLabel = ui.callLabel.replace("{phone}", office.phoneDisplay);

  const icons = [
    { href: waLink(), label: ui.whatsappShort, icon: <WhatsAppIcon /> },
    { href: telLink(), label: callLabel, icon: <Phone strokeWidth={1.8} aria-hidden="true" /> },
    { href: wazeLink(), label: ui.wazeLabel, icon: <WazeIcon /> },
    { href: mapsLink(), label: ui.mapsLabel, icon: <MapPin strokeWidth={1.8} aria-hidden="true" /> },
  ];

  const links = [
    ...menuLinks(navigation.menu, getApprovedReviews().length > 0).map((l) => ({ href: `/${l.href}`, label: l.label })),
    { href: legal.termsPath, label: legal.termsLabel },
    { href: legal.accessibilityStatementPath, label: legal.accessibilityLabel },
    { href: legal.privacyPath, label: legal.privacyLabel },
  ];

  return (
    <footer className="dock-clearance">
      <div className="mx-auto grid max-w-[900px] justify-items-center px-gutter pt-14 pb-[34px] text-center text-[15px] text-muted">
        <Seal variant="mark" />
        <p className="mt-4 font-serif text-[22px] font-bold text-ink">{office.name}</p>
        <p className="mt-1.5">
          {office.title} · {office.address}, {office.city}
        </p>

        <ul className="mt-[22px] flex gap-1.5">
          {icons.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener"
                aria-label={item.label}
                className="grid size-[46px] place-items-center rounded-full text-brass-deep transition-colors duration-[250ms] hover:bg-bark hover:text-ink [&_svg]:size-6"
              >
                {item.icon}
              </a>
            </li>
          ))}
        </ul>

        {/* Dots only from 900px, where the links fit on one line; below that, gaps and no dots, so a wrapped line
            never starts with a separator. Each link is a 44px-tall target for older thumbs. */}
        <ul className="mt-[22px] flex max-w-[36em] flex-wrap justify-center gap-x-5 gap-y-0 desk:max-w-none desk:flex-nowrap desk:gap-x-0">
          {links.map((link, i) => (
            <li
              key={link.href}
              className={cn(
                "flex items-center",
                i > 0 &&
                  "desk:before:mx-3 desk:before:size-1 desk:before:rounded-full desk:before:bg-bark desk:before:content-['']",
              )}
            >
              <a
                href={link.href}
                className="inline-flex min-h-11 items-center text-ink underline decoration-bark underline-offset-[5px] transition-colors hover:decoration-brass-deep"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-[26px] text-[13px]">
          © <span className="num">{YEAR}</span> {office.name}. {legal.disclaimer}
        </p>
      </div>
    </footer>
  );
}
