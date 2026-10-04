import { PLACEHOLDER_PATTERN, type Faq } from "@content";

/**
 * The FAQ items to publish (spec 10). On a production build an item whose answer is missing or still a
 * placeholder is left out; previews keep it so the owner can see what is still open.
 */
export function publishedFaq(items: readonly Faq[], production: boolean): Faq[] {
  return production ? items.filter((item) => !PLACEHOLDER_PATTERN.test(item.answer)) : [...items];
}

/** FAQPage structured data built from exactly the items on the page (spec 16). */
export function faqJsonLd(items: readonly Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
