# 13 Footer

## Purpose
Identity, contact shortcuts, navigation and legal links, compact and centered.

## Content
`office.monogram`, `office.name`, `office.title`, `office.address`, `office.city`, legal disclaimer, links.

## Layout (all widths, centered, max 900px)
1. Seal `mark` variant (64px, `brass-deep` line).
2. Name in serif 22px `ink`.
3. Tagline "עורך דין ונוטריון · הרברט סמואל 27, חדרה" in `muted`.
4. Icon row, 46px targets, `brass-deep`, hover `bark` background: WhatsApp, call, Waze, Google Maps.
5. Links: תחומי עיסוק, אודות, המלצות, שאלות נפוצות, הגעה למשרד, תקנון האתר, הצהרת נגישות, מדיניות פרטיות.
   Underlined (`bark` underline, `brass-deep` on hover). Desktop: separated by small dots.
   Phones: no dots (a wrapped line must not start with a dot), gap 12px x 20px.
6. "© {year} עו״ד יוסי שוקרון כהן. המידע באתר אינו מהווה ייעוץ משפטי." 13px.

## Rules
Year computed at build time. "המלצות" link hidden when there are no approved reviews.

## Implementation (built)
- `src/components/footer/Footer.tsx`, rendered in the root layout after `<main>`: the page's `contentinfo` landmark,
  and it will close the legal pages too. Section links therefore point at `/#id`; the anchor handler treats a
  `/#id` link to the current page as in-page (`inPageHash()`, tested), so it still scrolls smoothly and moves focus.
- Legal links come from `content.legal` (paths and labels); the pages arrive with specs 16 and 17.
- Separators: dots only from 900px, where the links fit one line (verified); below that gaps and no dots, so no line
  ever starts with a separator (fixes the prototype's desktop wrap that started a line with a dot).
- Dock clearance moved from `<main>` to the footer (`dock-clearance`), so the last line sits above the phone dock.
- Year rendered at build time.

## Acceptance criteria
- [ ] No line of links starts with a separator at 390px.
- [ ] Every icon link has an `aria-label`; all targets ≥44px.
- [ ] Footer is fully visible above the contact dock when scrolled to the bottom on phones.
