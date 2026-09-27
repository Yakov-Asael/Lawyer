# 00 Foundations: shell, RTL, motion system

## Purpose
The base every section sits on: document setup, page frame, tokens wiring, and one motion system that every section
reuses instead of inventing its own.

## Document
- `<html lang="he" dir="rtl">`, `color-scheme: light`. Single light theme by design (no dark mode in v1).
- Fonts via `next/font/google` (Frank Ruhl Libre 400/500/700/900, Assistant 400/500/600/700), `display: swap`,
  exposed as CSS variables `--font-serif` / `--font-sans`.
- Skip link "דלג לתוכן" as the first focusable element, visible on focus.
- `body` background `stone`, text `ink`, 17px / 1.65 (15px on phones).

## Page frame
- `<main>` has `padding-inline: inset` and `padding-block: inset`. Dark and colored sections are rounded cards
  (`radius-lg`) inside that frame; light sections sit on the `stone` ground without a card.
- On phones `<main>` reserves bottom space for the contact dock (`84px + safe-area`).
- No horizontal scroll at any width from 320px up (`overflow-x: clip` on `main`).

## RTL rules
- Logical properties only (`ms/me`, `ps/pe`, `start/end`, `inset-inline-*`). No `left/right` in components, except
  where a transform must be physical (carousel scroll math) and that is commented.
- Directional icons mirror: "next" points left, "previous" points right.
- Numbers, phone, email: wrapped in an isolating LTR span (`.num`).

## Tailwind / tokens
- Theme colors, radii, fonts, easings from `design/tokens.md` in `tailwind.config` / CSS variables.
- No raw hex or px in components except layout constants that are tokens.

## Motion system (`src/lib/motion` + `src/components/motion`)
| Primitive | Behavior |
|---|---|
| `<Reveal delay>` | opacity/translateY 28px → 0, 900ms `ease-out`, plays once at 12% visibility (IntersectionObserver, rootMargin -12% bottom) |
| `<MaskText>` | Splits into lines/words wrapped in overflow-hidden spans; inner span 112% → 0, 1100ms, stagger via delay |
| `useScrollProgress(ref)` | One shared rAF loop returns 0..1 progress of an element through the viewport. Used by parallax, statement scrub, 30 fill, process track, signature, file stacking |
| `SmoothScroll` provider | Lenis (`lerp: 0.1`); anchor links scroll via Lenis with -12px offset; exposes `stop()/start()` for menus |

Rules:
- Content is readable before JS: initial hidden states are applied only after hydration adds a class to `<html>`.
- `prefers-reduced-motion: reduce` or accessibility "stop animations": no loader, no reveals, no scrubbing,
  no smooth scroll; everything renders in its final state.
- One rAF loop for the whole page, paused when the tab is hidden.

## Acceptance criteria
- [ ] `lang="he"` and `dir="rtl"` on `<html>`; skip link works with Tab + Enter.
- [ ] No horizontal scroll at 320, 390, 768, 1024, 1440px.
- [ ] With reduced motion emulated, every section is fully visible on load and nothing animates.
- [ ] Disabling JS still shows all content (no element stuck at opacity 0).
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility 100, no CLS above 0.05.
