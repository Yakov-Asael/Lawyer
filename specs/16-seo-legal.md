# 16 SEO, metadata and legal pages

## Purpose
Be found for local searches ("עורך דין חדרה", "נוטריון חדרה", "עורך דין גירושין חדרה") and meet legal requirements
before launch.

## Metadata
- `<title>`: "עו״ד יוסי שוקרון כהן | עורך דין ונוטריון בחדרה".
- Description (≤155 chars) naming the four practice areas and Hadera.
- Canonical URL (domain TBD), Open Graph + Twitter card with a designed 1200x630 image (seal + name on `ink`).
- Favicon and app icons from the seal monogram.

## Structured data (JSON-LD, generated from content)
- `LegalService` (or `Attorney`) with name, address, telephone, geo, openingHours (when known), url, image,
  `areaServed: חדרה`. Name, address and phone must match Google Business Profile and Golden Pages exactly.
- `FAQPage` from the visible FAQ items.
- `Person` for Yossi, linked as `founder`.
- No `AggregateRating` (reviews are self-curated; Google disallows self-serving review markup).

## Technical SEO
Static export, `sitemap.xml`, `robots.txt`, Hebrew `lang`, one H1, semantic sections, image alts, Core Web Vitals
within the targets in spec 00.

## Legal pages (simple text pages in the same design system)
| Page | Required content |
|---|---|
| הצהרת נגישות | Accessibility level and standard, what was adapted, known limitations, accessibility contact (name, phone, email), last update date |
| מדיניות פרטיות | What data is collected (none by forms in v1; analytics and Maps cookies if enabled), purpose, contact |
| Cookie notice | Only if analytics or the Maps embed are enabled |

Legal texts to be reviewed by Yossi (he is the lawyer). We provide structure and draft, not legal advice.

## Acceptance criteria
- [ ] Rich Results Test passes for LegalService and FAQPage.
- [ ] NAP in JSON-LD equals `office` content byte for byte.
- [ ] Both legal pages exist and are linked from the footer and the accessibility menu.
