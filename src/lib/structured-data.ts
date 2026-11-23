import type { Office } from "@content/data";

/**
 * JSON-LD for the office (spec 16): a LegalService with Yossi as its founder.
 * Name, address and phone come straight from `office`, so they always match the visible NAP and the
 * Google Business Profile. No AggregateRating: the reviews are self-curated (Google disallows self-serving markup).
 * Hours come from the structured `office.openingHours`, never parsed from the visible sentence.
 * Geo, hasMap and sameAs wait for the Google Business Profile pin and URL (docs/google-business-profile.md).
 */
export function officeJsonLd(office: Office, opts: { url: string; image: string; description: string }) {
  const id = (fragment: string) => `${opts.url}#${fragment}`;
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": id("office"),
    name: office.name,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    telephone: office.phoneE164,
    email: office.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.address,
      addressLocality: office.city,
      addressCountry: "IL",
    },
    ...(office.openingHours && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: office.openingHours.days,
        opens: office.openingHours.opens,
        closes: office.openingHours.closes,
      },
    }),
    areaServed: { "@type": "City", name: office.city },
    knowsLanguage: "he",
    founder: {
      "@type": "Person",
      "@id": id("founder"),
      name: office.shortName,
      jobTitle: office.title,
      telephone: office.phoneE164,
      worksFor: { "@id": id("office") },
    },
  };
}

/** Serialises JSON-LD for an inline <script>; "<" is escaped so content can never close the tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
