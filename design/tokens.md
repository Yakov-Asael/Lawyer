# Design tokens

Source of truth for every visual value. Extracted from the approved prototype (`design/prototype/index.html`).
In code these live only as CSS variables / Tailwind theme values. Components never use raw values.

Status: **palette approved by the owner: cleangold** (clean white, deep navy, a touch of gold). Changing a color means
changing its value here and in the theme file (`src/app/globals.css`).
Nothing else.

## Color

Emotional brief: seriousness, warmth, care.

| Token | Value | Role | Emotion |
|---|---|---|---|
| `ink` | `#14233A` | Dark grounds (hero, final CTA, file 1), primary text on light | Seriousness |
| `field` | `#1F3452` | Committed sections (years, reviews, file 2) | Seriousness |
| `brass` | `#CDAE6A` | Accent and primary buttons on dark grounds, file 5 (notary) | Warmth |
| `brass-deep` | `#7A5B18` | Accent text on light grounds (eyebrows, links, highlights) | Warmth |
| `stone` | `#F8F7F4` | Page ground | Care |
| `paper` | `#FFFFFF` | Raised surfaces (process card, file 3, review cards, panels) | Care |
| `bark` | `#E6E3DC` | Secondary surface (visit), hairlines on light | Care |
| `muted` | `#55565C` | Secondary text on light | |
| `on-dark` | `#F8F7F4` | Text on dark grounds | |
| `on-dark-soft` | `rgba(248,247,244,.72)` | Secondary text on dark grounds | |
| `line-dark` | `rgba(248,247,244,.14)` | Hairlines on dark grounds | |
| `focus` | `brass-deep` on light, `brass` inside `.on-dark` | Keyboard focus ring (2px, 3px offset) | |

Verified contrast (WCAG): ink on stone 14.7:1, muted on stone 6.8:1, muted on bark 5.7:1, brass on ink 7.4:1,
ink on brass 7.4:1, brass-deep on stone 5.9:1, on-dark on field 11.7:1, on-dark-soft on field 6.9:1.
**Never use `brass` for text on light grounds.**

High-contrast mode (accessibility menu) overrides: `muted #2B312D`, `on-dark-soft #FFFFFF`, `brass-deep #5E4019`,
`bark #B9B2A2`, `line-dark rgba(255,255,255,.4)`.

## Typography

| Token | Stack | Use |
|---|---|---|
| `font-serif` | "Frank Ruhl Libre", "David Libre", "Times New Roman", serif | Headings, display numerals, seal monogram |
| `font-sans` | "Assistant", "Heebo", Arial, sans-serif | Body, UI, buttons |

Weights loaded: Frank Ruhl Libre 400/500/700/900, Assistant 400/500/600/700. Load via `next/font/google` (self-hosted).

Frank Ruhl Libre reads larger than its nominal size; the phone scale compensates.

| Role | Desktop (clamp) | Phone ≤600px | Line height |
|---|---|---|---|
| Hero H1 | `clamp(2.9rem, 7.2vw, 7.4rem)` | 2rem | .98 / 1.08 |
| Section H2 | `clamp(2.2rem, 4.4vw, 4rem)` | 1.55rem | 1.05 |
| 30 years H2 | `clamp(2rem, 3.6vw, 3.4rem)` | 1.55rem | 1.12 |
| Practice areas H2 | `clamp(2.3rem, 5vw, 4.6rem)` | 1.65rem | 1.02 |
| Final CTA H2 | `clamp(2.6rem, 6.4vw, 6.2rem)` | 1.85rem | 1 |
| Statement paragraph | `clamp(1.9rem, 4.1vw, 4rem)` | 1.2rem | 1.22 / 1.45 |
| "30" numeral | `clamp(9rem, 26vw, 24rem)` weight 900 | 5.5rem | .8 |
| File H3 | `clamp(1.9rem, 3.4vw, 3.1rem)` | 1.25rem | 1.08 |
| Process step H3 | `clamp(1.4rem, 2vw, 1.75rem)` | 1.1rem | 1.2 |
| Body | 17px | 15px | 1.65 |
| Lead / section intro | 18px | 15px | 1.65 |
| Eyebrow | 13px, weight 600, tracking .14em, `brass-deep` (`brass` on dark) | 12px | |
| Button | 16px, weight 700 | 15px | 1 |

Headings: `text-wrap: balance`. Numbers inside Hebrew text: `direction: ltr; unicode-bidi: isolate; tabular-nums`.

## Space and shape

| Token | Value | Use |
|---|---|---|
| `inset` | 10px | Page frame around rounded section cards |
| `gutter` | `clamp(20px, 4.2vw, 64px)` | Horizontal padding inside sections |
| `content-max` | 1180px (1280px for wide text sections) | Content width |
| `radius-lg` | 28px | Section cards |
| `radius-md` | 18px | Files, inner cards |
| `radius-sm` | 12px | Small surfaces |
| `radius-pill` | 999px | Buttons, badges |
| Section padding | `clamp(70px, 9vw, 130px)` vertical | Most sections |

Breakpoints: phone ≤600px (type scale), tablet/phone <900px (layout stacks, dock visible), desktop ≥900px,
header nav ≥1000px.

## Motion

| Token | Value | Use |
|---|---|---|
| `ease-out` | `cubic-bezier(.16,1,.3,1)` | Reveals, hovers, springs |
| `ease-io` | `cubic-bezier(.65,0,.35,1)` | Loader draw and curtain |
| `ease-stamp` | `cubic-bezier(.3,1.4,.5,1)` | Seal stamp landing in the final CTA only (deliberate overshoot) |
| Reveal | opacity 0 → 1, translateY 28px → 0, 900ms, stagger via `--d` | Blocks entering the viewport (once) |
| Mask reveal | inner span translateY 112% → 0, 1100ms | Headings, line by line |
| Hover lift | translateY -2px, 350ms | Buttons |

Every motion has a `prefers-reduced-motion: reduce` fallback (content fully visible, no scrubbing) and respects the
"stop animations" option of the accessibility menu.

## Texture

"Ruled legal pad": `repeating-linear-gradient` hairlines every 44px at 4.5% opacity on dark grounds, plus one brass
margin line at 22% opacity near the inline end. Used in hero, final CTA and the mobile menu only.

## Palette options (history; cleangold chosen)

The owner asked for warmer, softer options that still read as serious. All ten pass the same contrast checks
(body text ≥4.5:1 on every ground it sits on). Switch live in the prototype with the "פלטות" button; each has its own
link (`#p-<name>`). The cooler midnight, olive and charcoal options were dropped at the owner's request.

| Name | ink | field | brass | brass-deep | stone | paper | bark | muted |
|---|---|---|---|---|---|---|---|---|
| eucalyptus (prototype v1) | #152420 | #24413A | #B98A52 | #7E5829 | #EEE9DF | #F7F4EE | #DCD6C9 | #535A55 |
| navygold (first mockup) | #0B1220 | #16233A | #C9A24B | #7A5B18 | #F6F2E9 | #FBF8F2 | #E4DFD3 | #555A63 |
| **cleangold (approved)** | #14233A | #1F3452 | #CDAE6A | #7A5B18 | #F8F7F4 | #FFFFFF | #E6E3DC | #55565C |
| clean (clean, navy + steel) | #1B2F4B | #264468 | #D5E0EC | #1E3A5F | #F7F7F8 | #FFFFFF | #E4E4E7 | #52525B |
| walnut | #2A1D17 | #4A3328 | #C8935B | #85502A | #F2EBE2 | #FAF6F0 | #E3D8CA | #5E534B |
| cedar | #2B1A14 | #5A2E22 | #DDA65E | #86521A | #F3ECE4 | #FAF7F2 | #E6DACD | #5F534B |
| cocoa | #26201C | #5C4033 | #D6A676 | #88572A | #F4EEE6 | #FBF8F3 | #E7DDD0 | #5E554D |
| plum | #24161F | #4A2A3D | #D9A95F | #7E5520 | #F3ECE6 | #FAF7F3 | #E4D9D1 | #5E545A |
| tobacco | #211C16 | #4A4232 | #CFA066 | #7E5A2E | #F2EDE3 | #FAF7F0 | #E2DBCC | #5C5850 |
| oxblood | #221416 | #4A2026 | #D3AA6B | #7A5220 | #F1EBE3 | #F9F6F1 | #E0D6CA | #5F5755 |
