# 03 Hero and intro loader

## Purpose
In one viewport: who this is (a face and a name), why him (personal, 23 years of practice), and how to reach him.

## Content
`hero.line1` ("ליווי משפטי אישי."), `hero.line2` ("23 שנות ניסיון."), `hero.sub`, `office.address`, `office.title`,
portrait image, seal.

## Intro loader
- Full-screen `ink` curtain: seal rings draw (stroke-dashoffset, 1.1s `ease-io`), monogram and name fade in,
  then the curtain slides up (`translateY(-102%)`, 900ms, starts at 1.35s).
- Pure CSS, never blocks: if JS fails the curtain still leaves.
- Not rendered at all under reduced motion or "stop animations".
- Shown once per session (sessionStorage), so internal navigation does not replay it.

## Layout
- Dark rounded card (`ink`), ruled-pad texture with parallax (-6%), min-height `clamp(620px, 100svh - 20px, 940px)`,
  content bottom-aligned, top padding clears the header.
- ≥900px: two columns `1.35fr / .8fr`, text at start (right), portrait at end (left).
- <900px: stacked, text first, portrait below at `min(78%, 340px)`.
- H1: serif 700, line 2 in `brass` weight 500. Sub: max 34em, `on-dark-soft`, with the personal-handling sentence in
  `on-dark` 600.
- Actions: ContactButtons ("שלחו הודעה בוואטסאפ" + round call icon). On phones a two-column grid `1fr auto`, 48px.
- Meta row: address and title with small brass dots.
- Portrait: arched top (`999px 999px radius-md radius-md`), 4:5, object-position 50% 30%, inner parallax 8%.
- Seal (`hero` variant) overlaps the portrait's bottom-start corner, 128px (104px phones), rotates `scrollY * 0.12deg`.

## Variants under review
`data-hero="light"`: same layout on a `paper` ground with ink text and `brass-deep` second line. Kept alongside the
dark hero until the owner chooses.

## Motion
H1 lines mask-reveal after the loader (1.55s, 1.7s); sub, actions, meta and portrait rise in sequence (1.8s to 2.25s).
Without the loader (repeat visit or reduced motion) the same sequence starts at 0.

## Assets
Portrait: `design/assets/yossi-shukrun-cohen-portrait.webp` for now; **production needs the high-resolution
original** (target 1200x1500, served via `next/image`, priority).

## Accessibility
One `<h1>`. Portrait alt: "עו״ד יוסי שוקרון כהן". Seal is decorative (`aria-hidden`).

## Acceptance criteria
- [ ] First viewport at 390x844 shows H1, sub, WhatsApp + call; portrait may start below the fold.
- [ ] LCP element is the H1 or portrait; LCP < 2.5s on mobile 4G throttling.
- [ ] Loader does not appear on the second page load within the session, nor with reduced motion.
- [ ] WhatsApp opens `wa.me/972522521127` with the generic greeting.
