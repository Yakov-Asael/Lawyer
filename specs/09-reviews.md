# 09 Reviews slider

## Purpose
Social proof from real clients, curated by the office (not a Google feed), in a compact endless slider.

## Content
`reviews[]`: quote, clientName, area, `consentConfirmed: true`. Section heading "מה אומרים לקוחות." and a note line
(final wording TBD). **If `reviews` is empty the whole section is not rendered** (and removed from nav).

## Layout
- Rounded `field` card; head (eyebrow, H2, note) in the 1180px container.
- Cards: `paper` ground, `ink` text, 24px radius, brass quote mark SVG, quote 17px (15.5px phones) clamped to
  4 lines, "קראו עוד" / "הצג פחות" toggle (only when the text overflows), name in `brass-deep` 700 + area in `muted`.
- ≥900px: three cards visible in the container, arrows centered below (52px round, `on-dark` border; hover `brass`).
- <900px: one centered card (`100vw - 2 * 11vw - 20px`) with the neighbors peeking on both sides; no arrows, swipe only.

## Behavior
- Endless loop in both directions (arrows and swipe never hit an edge).
- RTL: "next" is to the left; the next-arrow points left.
- Arrow moves by one card. No autoplay (content must not move while being read).
- Read-more expands only its own card.

## Implementation notes
Preferred: shadcn `Carousel` (Embla) with `loop: true`, `direction: "rtl"`, `align: "start"` on desktop and
`"center"` on phones, `slidesToScroll: 1`. Fallback (as in the prototype): native scroll-snap track with one real set
between two cloned sets (`aria-hidden`, `inert`) and a silent jump when scrolling settles in a clone.

## Accessibility
`role="region" aria-roledescription="קרוסלה" aria-label="המלצות לקוחות"`; arrows labeled "ההמלצות הקודמות/הבאות";
cloned slides hidden from assistive tech; the track is keyboard scrollable.

## Acceptance criteria
- [ ] Desktop: 3 cards visible; 8 clicks forward and 8 back cycle through all reviews with no dead end.
- [ ] Phone: swipe cycles endlessly; no arrows rendered; peeks visible on both sides after the first swipe.
- [ ] A screen reader announces each real review once (clones excluded).
- [ ] "קראו עוד" appears only on clamped quotes and toggles `aria-expanded`.
- [ ] A review without `consentConfirmed: true` fails the build.
