# 06 Practice areas (stacked files)

## Purpose
Let the visitor find their topic in seconds and start a WhatsApp conversation already labeled with it.

## Content
`practiceAreas[4]`: tabLabel, headline, lead, services (3 to 6), whatsappTopic, ctaLabel. Order: family, torts,
real estate, notary.

## Layout
- Section head: eyebrow "תחומי עיסוק", H2 "ארבעה תחומים, / עורך דין אחד.", intro paragraph.
- Four "court files", each = tab + body:
  - Tab: `display:flex; width:fit-content`, flush with the body's start edge, `margin-block-end:-1px` (no gap),
    top radius 14px, 14px / 700 / tracking .06em, small dot before the label.
  - Body: `radius-md` with the start-top corner square (where the tab sits), padding `clamp(28px, 4vw, 52px)`,
    min-height `clamp(340px, 44vh, 420px)`. ≥900px two columns: headline + lead + CTA / service list. Phones: one column.
- Colors per file: 1 `ink`, 2 `field`, 3 `paper`, 4 `brass` (text and CTA variant adapt: `brass` button on dark files,
  `ink` button on light files).

## Motion (signature)
- Files are `position: sticky`, `top: 90px + index * 26px`, so each new file slides over the previous one and the
  tabs stack like a drawer.
- A covered file scales to `1 - overlap * .05` and dims (`brightness(1 - overlap * .25)`).

## Behavior
CTA → `waLink(whatsappTopic)`, e.g. "...אשמח להתייעץ בנושא דיני משפחה."

## Fallbacks
Reduced motion: no scaling/dimming (stacking remains, it is layout, not animation).

## Accessibility
Each file is an `<article>` with its headline as `<h3>`; service lists are `<ul>`.

## Acceptance criteria
- [ ] Tab and body touch with zero gap (measured) at 1440 and 390; tab right edge equals body right edge.
- [ ] Each CTA opens WhatsApp with its own topic in the message.
- [ ] Scrolling shows all four tabs stacked at the top edge before the section ends.
- [ ] Service lists come from content; no hardcoded items.
