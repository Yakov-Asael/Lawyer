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
| תקנון האתר | See spec 17 |

Legal texts to be reviewed by Yossi (he is the lawyer). We provide structure and draft, not legal advice.

## Acceptance criteria
- [ ] Rich Results Test passes for LegalService and FAQPage.
- [x] NAP in JSON-LD equals `office` content byte for byte.
- [x] Both legal pages exist and are linked from the footer and the accessibility menu.

## Implementation (built)
- **Metadata** (`src/app/layout.tsx`): title, description from `site.seo` (Zod caps it at 155 chars), `metadataBase`
  from `SITE_URL`, else Netlify's build-time `URL`, else localhost (`src/lib/site-url.ts`). Each page sets its own
  canonical. Open Graph + Twitter card use `public/og.png`.
- **Brand rasters**: `/dev/brand` (dev only, `ENABLE_DEV_PREVIEWS=1`) draws the 1200x630 share card and the seal
  icon with the real fonts and tokens. `pnpm brand-assets` screenshots them into `public/og.png`,
  `src/app/icon.png` (512), `src/app/apple-icon.png` (180) and `src/app/favicon.ico` (48, PNG in ICO).
- **JSON-LD**: `LegalService` + `founder` Person from `officeJsonLd(office)` (`src/lib/structured-data.ts`), emitted
  on the home page. NAP is copied straight from `office` (unit + e2e tested). No `AggregateRating`. `geo` and
  `openingHours` are left out until confirmed: `hours` is free text today, and schema.org needs
  `Mo-Th 09:00-17:00`. `FAQPage` stays with the FAQ section.
- **robots.txt / sitemap.xml**: only a production deploy (`CONTEXT=production`) is indexable; previews disallow `/`.
  The sitemap lists `/` and every legal page.
- **Route groups**: `(home)` brings the intro curtain, the hero header and `<main>`; `(legal)` brings a slim header
  (brand, "חזרה לאתר", contact pair from 1000px; phones use the dock) and `<main>`. Footer, dock and accessibility
  menu stay in the root layout. Links back home are full loads, so the home page boots its motion state first.
- **Legal template** (`src/components/legal/LegalDocument.tsx`, shared with spec 17): dark title card with the
  ruled texture and a seal watermark, updated date (dd.mm.yyyy), a table of contents (sticky on desktop, a
  `<details>` on phones), numbered clauses with anchors `#clause-N`, 70ch column, contact card with tel/mailto links.
  No scroll animations.
- **Content**: `content/legal/accessibility.ts` and `content/legal/privacy.ts` (`LegalPage` contract, as in spec 17,
  plus `approved`, `intro`, `items` and `contact`). Drafts only: `approved: false` blocks a production build until
  Yossi signs off, like a placeholder. Open placeholders: physical accessibility of the office; the privacy rights
  clause. The accessibility coordinator is the office (name, phone, email) until Yossi names someone.
- **Cookie notice**: not needed. No analytics, no Maps embed (the map is a static drawing), no cookies. The
  accessibility choices and the intro flag live in the visitor's browser storage only, as the privacy page says.
- **Accessibility menu**: links to both legal pages; terms joins in spec 17.
- **Open**: domain (set `SITE_URL` in Netlify when known); Rich Results Test must run against a public URL (the
  container cannot reach it); the browser list in the accessibility statement assumes the pending Safari/Firefox check.
