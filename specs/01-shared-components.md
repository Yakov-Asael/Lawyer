# 01 Shared components

## Purpose
One implementation per repeated element, so every section looks and behaves the same.

## Button (`shadcn/ui Button`, custom variants)
| Variant | Look | Used on |
|---|---|---|
| `brass` | bg `brass`, text `ink` | Primary action on dark grounds |
| `ink` | bg `ink`, text `stone` | Primary action on light grounds |
| `ghost` | 1.5px border `on-dark` at 45%, text `on-dark` | Secondary on dark |
| `line` | 1.5px border `ink`, text `ink` | Secondary on light |
| `icon` | Round, same height as the paired button, icon only, `aria-label` required | Call button next to WhatsApp |

- Height 52px (48px in the hero on phones), pill radius, 16px / 700 (15px on phones).
- Text is optically centered on the Hebrew x-height: `text-box: trim-both ex alphabetic`, `line-height: 1`.
- Hover (pointer devices only): translateY -2px, 350ms. Focus: 2px `brass` outline, 3px offset.
- External targets (`wa.me`, `tel:`, Waze, Maps) always `target="_blank" rel="noopener"`.

## ContactButtons (the pattern used across the site)
WhatsApp button + round call icon to its left (in RTL: after it in DOM). The phone number is never shown as button
text; it is the call button's `aria-label` ("חיוג ל-052-252-1127").
WhatsApp links always go through `waLink(topic?)`.

## Eyebrow
Text only (no leading rule), 13px / 600 / tracking .14em, `brass-deep` on light, `brass` on dark.

## SectionHeading
Eyebrow + H2 with `<MaskText>`; optional intro paragraph with `<Reveal delay=120ms>`.

## Seal (brand mark)
- SVG: two concentric rings, monogram "ש״כ" in Frank Ruhl Libre 700, ring text
  "עורך דין ונוטריון · חדרה · שוקרון כהן ·".
- Ring text is placed glyph by glyph (not `textPath`, which renders Hebrew inconsistently), counter-clockwise so it
  reads right to left.
- Variants: `hero` (ink disc, brass ring, rotates with scroll), `stamp` (brass disc, ink text, final CTA),
  `mark` (line only, 64px, footer).

## Icons
`lucide-react` for UI icons. Custom inline SVG only for: WhatsApp, Waze, the accessibility figure, the seal.
Stroke 1.8, round caps. No emojis, no image icons.

## Implementation (built)
| Piece | File | Notes |
|---|---|---|
| Button, ButtonLink, `buttonVariants` | `src/components/ui/button.tsx` | shadcn pattern written by hand (registry host blocked). `variant`: brass, ink, ghost, line. `shape`: pill, icon. `size`: default (52px), hero (48px below 600px). No Radix Slot: links use `ButtonLink`, which adds `target="_blank" rel="noopener"` to external hrefs |
| ContactButtons | `src/components/shared/ContactButtons.tsx` | `tone` dark/light, optional `topic`, `label`, `size`. Copy from `ui.whatsappCta` / `ui.callLabel` |
| Eyebrow | `src/components/shared/Eyebrow.tsx` | `on-dark:` variant switches brass-deep to brass |
| SectionHeading | `src/components/shared/SectionHeading.tsx` | `size`: h2, areas, final (type scale utilities `type-*` in globals.css) |
| Seal | `src/components/shared/Seal.tsx` | `variant`: hero, stamp, mark. Ring text from `brand.sealRing`, laid out by `ringGlyphs()` in `src/lib/seal.ts` (graphemes, counter-clockwise from the top) |
| Icons | `src/components/icons.tsx` | WhatsApp, Waze. Phone and map pin come from lucide |

The prototype has `data-ring` groups but no script that lays them out, so the ring layout was built from this spec,
not copied from the prototype.

## Acceptance criteria
- [ ] All buttons pass 4.5:1 text contrast and have a visible focus ring.
- [ ] Measured text center within 1.5px of the button's vertical center at 1440 and 390.
- [ ] Every icon-only control has an `aria-label`.
- [ ] Seal ring text reads correctly (right to left) in Chrome, Safari and Firefox.
