# 09 Reviews slider

## Purpose
Social proof from real clients, curated by the office (not a Google feed), in a compact endless slider.

## Content
`reviews[]`: quote, clientName, area, `consentConfirmed: true`. Source: approved rows from the reviews table (spec 19),
ordered as set in the admin. Section heading "מה אומרים לקוחות." and a note line
(final wording TBD). **If `reviews` is empty** the slider is not rendered; the section shows a compact invitation instead
(heading, one line "היו הראשונים לשתף איך היה לעבוד איתנו", and the "השאירו המלצה" button), so the form stays reachable
from day one. The "המלצות" nav link is hidden while empty.

## Layout
- Rounded `field` card; head (eyebrow, H2, note) in the 1180px container.
- Cards: `paper` ground, `ink` text, 24px radius, brass quote mark SVG, quote 17px (15.5px phones) clamped to
  4 lines, "קראו עוד" button (only when the text overflows), name in `brass-deep` 700 + area in `muted`.
- ≥900px: three cards visible in the container; arrows on both sides of the cards, vertically centered on them
  (52px round, `on-dark` border; hover `brass`; "previous" on the right, "next" on the left in RTL). Owner feedback.
- <900px: one centered card (`100vw - 2 * 11vw - 20px`) with the neighbors peeking on both sides; no arrows, swipe only.

## Adding a review
A "השאירו המלצה" ghost button with a pen icon sits centered under the slider. It opens the submission dialog (spec 18).

## Behavior
- Endless loop in both directions (arrows and swipe never hit an edge).
- RTL: "next" is to the left; the next-arrow points left.
- Arrow moves by one card. No autoplay (content must not move while being read).
- Read-more opens a reader dialog (shadcn Dialog, same panel as spec 18: bottom sheet on phones, centered on
  desktop) with the quote mark, the full quote in serif and the name + area. Cards never change height, so the
  carousel row stays even. Focus moves to the close button; Esc, backdrop or close returns focus to the button.

## Implementation notes
Preferred: shadcn `Carousel` (Embla) with `loop: true`, `direction: "rtl"`, `align: "start"` on desktop and
`"center"` on phones, `slidesToScroll: 1`. Fallback (as in the prototype): native scroll-snap track with one real set
between two cloned sets (`aria-hidden`, `inert`) and a silent jump when scrolling settles in a clone.

## Accessibility
`role="region" aria-roledescription="קרוסלה" aria-label="המלצות לקוחות"`; arrows labeled "ההמלצות הקודמות/הבאות";
cloned slides hidden from assistive tech; the track is keyboard scrollable.

## Implementation (built)
- Source: `getApprovedReviews()` (`src/lib/reviews.ts`) reads `content.reviews` (approved, with consent). Owner's
  decision (option A): reviews arrive by email from the form (spec 18) and are added here by hand. If a database is
  added later (spec 19), only this function changes.
- `Reviews.tsx` (server) shows the slider or, with no reviews, the compact invitation. The "השאירו המלצה" button
  arrives with the submission form (spec 18); until then the invitation is heading and line only.
- `ReviewsSlider.tsx` + `src/components/ui/carousel.tsx` (shadcn Carousel on Embla, written by hand, RTL). Embla loops
  by moving real slides: no clones, so each review is announced once. Keyboard: Left = next, Right = previous.
- `ReviewCard.tsx`: 4-line clamp; "קראו עוד" appears only when the quote overflows (measured, ResizeObserver).
- The "המלצות" menu link is filtered out while there are no reviews (`menuLinks()`, tested).
- `/dev/reviews` renders the slider with marked sample data for tests. It is a dynamic route that returns 404 unless
  `ENABLE_DEV_PREVIEWS=1`, which only the Playwright web server sets.
- Note line wording ("המלצות שנבחרו על ידי המשרד ומתפרסמות בהסכמת הלקוחות.") approved by the owner.

## Acceptance criteria
- [ ] Desktop: 3 cards visible; 8 clicks forward and 8 back cycle through all reviews with no dead end.
- [ ] Phone: swipe cycles endlessly; no arrows rendered; peeks visible on both sides after the first swipe.
- [ ] A screen reader announces each real review once (clones excluded).
- [ ] "קראו עוד" appears only on clamped quotes, opens the reader dialog with the full text, and focus returns on close.
- [ ] Only approved reviews render; with zero approved reviews the compact invitation shows instead of the slider.

## Implementation update (2026-10-04, owner feedback)
- Desktop arrows sit on both sides of the cards (`data-arrows`, absolutely positioned over the 68px side gutters),
  vertically centred on them.
- "קראו עוד" opens one shared reader built on `SheetDialog` (`src/components/ui/sheet-dialog.tsx`), the native
  modal shared with spec 18: bottom sheet on phones, centred from 700px, focus on the close button, Esc/backdrop/close
  return focus to the button. Cards never change height.
