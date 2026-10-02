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
| 17 | [Terms of use (תקנון)](17-terms.md) | Draft |
| 18 | [Review submission](18-review-submission.md) | Draft |
| 19 | [Admin: review moderation](19-admin.md) | Draft |
| 20 | [Press and cases page (phase 2)](20-press-and-cases.md) | Future |
| - | [Content contract](content-contract.md) | Draft |

## Dependencies (approved 2026-10-02, free tiers only)

Rule: nothing that costs money. Every service below runs on its free plan; stay inside the limits.

| Package / service | Why | Free-plan limit that matters |
|---|---|---|
| `lenis` | Smooth scroll, part of the approved feel | MIT, no cost |
| `embla-carousel-react` (via shadcn Carousel) | Endless reviews loop with RTL and swipe | MIT, no cost |
| `zod` | Content contract | Already in the locked stack |
| Netlify (free plan) | Hosting, deploy preview per branch, serverless functions for specs 18 and 19 | Monthly usage quota (bandwidth, function calls), ample for one landing page; commercial use allowed |
| Neon Postgres (free plan) + `drizzle-orm` | Reviews storage and moderation (specs 18, 19) | 0.5 GB storage; DB sleeps when idle (first request slower) |
| `next-auth` (Auth.js) | Google sign-in for Yossi only | Open source, no cost |
| `resend` (free plan) | Email Yossi about new reviews | 3,000 emails/month, 100/day |
| Cloudflare Turnstile | Bot protection on the form | Free |
| Google Maps embed (iframe, no API key) | Map in the Visit section | Free; no Maps JavaScript API |

Any new paid tier, API key with billing, or extra package: flag first.

No animation library (Framer Motion, GSAP). All motion is CSS plus one small rAF scroll hook.

## Template for every section spec

1. **Purpose**: what the visitor should understand or do.
2. **Content**: fields from the content contract.
3. **Layout**: desktop ≥900px and phone <900px.
4. **Behavior and motion**: including the reduced-motion and "stop animations" fallback.
5. **Accessibility**: semantics, keyboard, screen reader.
6. **Implementation notes**: components, shadcn mapping, files.
7. **Acceptance criteria**: testable, checked with Playwright at 1440px and 390px.
