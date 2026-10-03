# 12 Final CTA

## Purpose
Close the page with one clear, warm invitation to talk.

## Content
`finalCta.line1` ("בואו נדבר"), `finalCta.line2` ("על מה שקרה."), `finalCta.body`.

## Layout
- Rounded `ink` card with the ruled texture, centered, padding `clamp(80px, 11vw, 160px)`.
- Seal `stamp` variant on top (130 to 190px).
- H2 two lines, second in `brass`. Body in `on-dark-soft` max 30em.
- ContactButtons: "שלחו הודעה בוואטסאפ" (`brass`) + round call icon (`ghost`), no number text; on phones they stay
  on one row.

## Motion (signature)
When the seal enters the viewport it "stamps": scale 1.6 and -35° to scale .94 and -6° to scale 1 and -8°,
750ms with a slight overshoot. Plays once. Static at -8° under reduced motion.

## Implementation (built)
- `src/components/sections/FinalCta.tsx` (server): ruled `ink` card, `Seal` stamp variant (SealStamp: plays once via the
  shared observer, rests at -8deg without motion), `SectionHeading` with the new `introSize="final"` (19px, 15.5px on
  phones), and the shared `ContactButtons` kept on one row.

## Acceptance criteria
- [ ] Stamp plays once, only when visible.
- [ ] Buttons identical in behavior to the hero ContactButtons.
- [ ] Section fits one viewport at 1440x900.
