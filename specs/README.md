# Specs

One spec per section, derived from the approved prototype (`design/prototype/index.html`).
Build order follows the numbering. A section is built only when its spec is approved (CLAUDE.md, golden rule 1).

Visual values come from `design/tokens.md`. Data comes from `specs/content-contract.md`.

## Index

| # | Spec | Status |
|---|---|---|
| 00 | [Foundations: shell, RTL, motion system](00-foundations.md) | Draft |
| 01 | [Shared components](01-shared-components.md) | Draft |
| 02 | [Header and mobile menu](02-header-menu.md) | Draft |
| 03 | [Hero and intro loader](03-hero.md) | Draft |
| 04 | [Statement](04-statement.md) | Draft |
| 05 | [30 years](05-years.md) | Draft |
| 06 | [Practice areas (stacked files)](06-practice-areas.md) | Draft |
| 07 | [Process](07-process.md) | Draft |
| 08 | [About](08-about.md) | Draft |
| 09 | [Reviews slider](09-reviews.md) | Draft |
| 10 | [FAQ](10-faq.md) | Draft |
| 11 | [Visit](11-visit.md) | Draft |
| 12 | [Final CTA](12-final-cta.md) | Draft |
| 13 | [Footer](13-footer.md) | Draft |
| 14 | [Mobile contact dock](14-dock.md) | Draft |
| 15 | [Accessibility menu](15-accessibility-menu.md) | Draft |
| 16 | [SEO, metadata and legal pages](16-seo-legal.md) | Draft |
| - | [Content contract](content-contract.md) | Draft |

## Dependencies to approve (CLAUDE.md: flag before adding)

| Package | Why | Alternative |
|---|---|---|
| `lenis` | Smooth scroll, part of the approved feel | Native scroll (loses the feel) |
| `embla-carousel-react` (via shadcn Carousel) | Endless reviews loop with RTL and swipe | Hand-rolled scroll-snap loop as in the prototype |
| `zod` | Content contract | Already in the locked stack |

No animation library (Framer Motion, GSAP). All motion is CSS plus one small rAF scroll hook.

## Template for every section spec

1. **Purpose**: what the visitor should understand or do.
2. **Content**: fields from the content contract.
3. **Layout**: desktop ≥900px and phone <900px.
4. **Behavior and motion**: including the reduced-motion and "stop animations" fallback.
5. **Accessibility**: semantics, keyboard, screen reader.
6. **Implementation notes**: components, shadcn mapping, files.
7. **Acceptance criteria**: testable, checked with Playwright at 1440px and 390px.
