# 02 Header and mobile menu

## Purpose
Identify the office and offer the two contact actions from the first second, without competing with the hero.

## Content
`office.shortName`, `office.title`, `office.city`; nav targets: תחומי עיסוק, אודות, שאלות נפוצות, הגעה למשרד.

## Layout
- Absolute over the hero (not sticky), padding `22px gutter`.
- Start (right): brand block, name in serif 21px (19px phones) + "עורך דין ונוטריון · חדרה" 12.5px `on-dark-soft`.
- ≥1000px: centered nav (15px, `on-dark-soft`, hover `on-dark`) and at the end ContactButtons
  (WhatsApp `brass` 44px high with label "וואטסאפ", round call icon 44px `ghost`).
- <1000px: nav and buttons hidden; a 48px round burger (two bars, the second shorter and end-aligned).

## Mobile menu
- Full-screen overlay, `ink` ground with the ruled texture, fades in 450ms.
- Top row mirrors the header: brand + round close button (X rotates 90° on hover).
- Links in serif 700, `clamp(2.1rem, 9vw, 3.2rem)` (1.9rem phones), staggered rise 80ms apart:
  תחומי עיסוק, אודות, המלצות, שאלות נפוצות, הגעה למשרד.
- Footer of the menu: full-width WhatsApp (`brass`) and call (`ghost`) buttons, address and phone line.
- Clicking a link closes the menu, then smooth-scrolls to the target.

## Behavior
- Open: `main` becomes `inert`, scroll locked (Lenis stopped + `overflow: hidden`), focus moves to the first link
  after the menu is visible (two animation frames).
- Close: button, Esc, or any link. Focus returns to the burger.

## Implementation notes
shadcn `Sheet` (side: top, full-screen) restyled, or a custom dialog with the same semantics.
Files: `src/components/header/Header.tsx`, `MobileMenu.tsx`.

## Accessibility
Burger: `aria-label="פתיחת תפריט"`, `aria-expanded`, `aria-controls`. Menu: `role="dialog" aria-modal="true"`.

## Implementation (built)
- `src/components/header/Header.tsx` (server), `Brand.tsx`, `MobileMenu.tsx` (client: burger + dialog).
- The header renders in the root layout before `<main>`, absolutely positioned over the hero card (`inset` + `22px gutter`).
  This keeps the `banner` landmark and lets the skip link jump past the nav. The hero (spec 03) reserves top space for it.
- The menu is a custom dialog (no Radix), portalled to `<body>`. When open, every other child of `<body>` is `inert`,
  `html.menu-lock` stops native scroll and Lenis is stopped.
- A menu link closes the menu first and then calls `goToHash()` from the motion context, because Lenis ignores
  `scrollTo` while it is stopped. Focus goes to the target section; Esc or the close button returns focus to the burger.
- The menu also closes when the viewport widens past 1000px.
- Nav labels and targets live in `content` (`navigation.header`, `navigation.menu`).
- Known limit: without JavaScript the burger does nothing on phones; contact stays one tap away through the dock
  (spec 14).

## Acceptance criteria
- [ ] At 1440: brand, 4 links, WhatsApp and call icon visible in one row; no phone number text.
- [ ] At 390: only brand + burger; menu opens, focus lands on "תחומי עיסוק", Esc closes and refocuses the burger.
- [ ] Tab cannot reach page content while the menu is open.
- [ ] A menu link closes the menu and lands on the section.
