# Design tokens

Source of truth for every visual value. Extracted from the approved prototype (`design/prototype/index.html`).
In code these live only as CSS variables / Tailwind theme values. Components never use raw values.

Status: **palette pending Yossi's approval.** Changing a color means changing its value here and in the theme file.
Nothing else.

## Color

Emotional brief: seriousness, warmth, care.

| Token | Value | Role | Emotion |
|---|---|---|---|
| `ink` | `#152420` | Dark grounds (hero, final CTA, file 1), primary text on light | Seriousness |
| `field` | `#24413A` | Committed sections (years, reviews, file 2) | Seriousness |
| `brass` | `#B98A52` | Accent and primary buttons on dark grounds, file 4 | Warmth |
| `brass-deep` | `#7E5829` | Accent text on light grounds (eyebrows, links, highlights) | Warmth |
| `stone` | `#EEE9DF` | Page ground | Care |
| `paper` | `#F7F4EE` | Raised surfaces (process card, file 3, review cards, panels) | Care |
| `bark` | `#DCD6C9` | Secondary surface (visit), hairlines on light | Care |
| `muted` | `#535A55` | Secondary text on light | |
| `on-dark` | `#EEE9DF` | Text on dark grounds | |
| `on-dark-soft` | `rgba(238,233,223,.72)` | Secondary text on dark grounds | |
| `line-dark` | `rgba(238,233,223,.14)` | Hairlines on dark grounds | |

Verified contrast (WCAG): ink on stone 13.3:1, muted on stone 5.9:1, muted on bark 4.9:1, brass on ink 5.2:1, ink on brass 5.2:1,
brass-deep on stone 5.2:1, on-dark on field 9.1:1. **Never use `brass` for text on light grounds** (2.5:1).

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
| Practice areas H2 | `clamp(2.3rem, 5vw, 4.6rem)` | 1.65rem | 1.02 |
| Final CTA H2 | `clamp(2.6rem, 6.4vw, 6.2rem)` | 1.85rem | 1 |
| Statement paragraph | `clamp(1.9rem, 4.1vw, 4rem)` | 1.2rem | 1.22 / 1.45 |
| "30" numeral | `clamp(9rem, 26vw, 24rem)` weight 900 | 5.5rem | .8 |
| File H3 | `clamp(1.9rem, 3.4vw, 3.1rem)` | 1.25rem | 1.08 |
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
| Reveal | opacity 0 → 1, translateY 28px → 0, 900ms, stagger via `--d` | Blocks entering the viewport (once) |
| Mask reveal | inner span translateY 112% → 0, 1100ms | Headings, line by line |
| Hover lift | translateY -2px, 350ms | Buttons |

Every motion has a `prefers-reduced-motion: reduce` fallback (content fully visible, no scrubbing) and respects the
"stop animations" option of the accessibility menu.

## Texture

"Ruled legal pad": `repeating-linear-gradient` hairlines every 44px at 4.5% opacity on dark grounds, plus one brass
margin line at 22% opacity near the inline end. Used in hero, final CTA and the mobile menu only.

## Palette options (under review)

All five pass the same contrast checks (body text ≥4.5:1 on every ground it sits on). Switch between them live in the
prototype with the "פלטות" button; each has its own link (`#p-<name>`).

| Name | ink | field | brass | brass-deep | stone | paper | bark | muted |
|---|---|---|---|---|---|---|---|---|
| eucalyptus (current) | #152420 | #24413A | #B98A52 | #7E5829 | #EEE9DF | #F7F4EE | #DCD6C9 | #535A55 |
| midnight | #121B29 | #1E3250 | #C98A63 | #8C4A28 | #EFEAE4 | #F8F5F1 | #DED6CC | #565E6A |
| oxblood | #221416 | #4A2026 | #D3AA6B | #7A5220 | #F1EBE3 | #F9F6F1 | #E0D6CA | #5F5755 |
| olive | #1C1E16 | #3B4230 | #CFA24A | #6F5410 | #EFECE2 | #F8F6EF | #DEDACB | #5A5C50 |
| charcoal | #19191B | #2D2D31 | #C8AB80 | #6E5436 | #EEEBE6 | #F8F6F3 | #DDD8D0 | #5B5A57 |
