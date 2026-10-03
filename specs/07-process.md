# 07 Process

## Purpose
Lower the barrier to the first contact: show that starting takes a minute and what happens next.

## Content
`process[3]`: title + body. Current copy: שולחים הודעה או מתקשרים / נפגשים במשרד / ליווי עד סוף הטיפול.

## Layout
- Rounded `paper` card, content max 1180px. Eyebrow "איך מתחילים", H2 "שלושה צעדים, והראשון לוקח דקה."
- ≥900px: three equal columns. Phones: one column.
- Each step is **centered in its column**: numbered circle (54px, `paper` fill, 1.5px `brass-deep` border, serif 700
  numeral optically centered), title, body (max 22em).
- A 1px `bark` track connects the circle centers on desktop: it spans exactly from the first center to the last.

## Motion (signature)
A `brass-deep` line fills the track from the first step to the last as the section scrolls
(scaleX with origin at the inline start). Steps rise with 120ms stagger.

## Semantics
An ordered list (`<ol>`); the numbering is real information (a sequence), so it stays.

## Implementation (built)
- `src/components/sections/Process.tsx` (server) and `TrackFill.tsx` (client, `useScrollProgress` on the steps block,
  fill window .25 to .6 as in the prototype).
- Track geometry is CSS only: three equal columns with a 40px gap put each column centre `(100% - 80px) / 6` in from
  the edges, so `inset-inline` at that value spans exactly first centre to last centre.
- `transform-origin` is physical (`rtl:origin-right`): scaleX has no logical origin; the inline start is the right.
- Heading copy is one string (`processHead.heading`) masked word by word, so it wraps like the prototype.
- New type role `type-h3-step` (prototype values), added to tokens.md.

## Acceptance criteria
- [ ] Circle center equals column center (measured offset 0) at 1440 and 390.
- [ ] Track starts at the first circle's center and ends at the last circle's center.
- [ ] Hidden on phones: the track (steps stack vertically).
