# CLAUDE.md: Lawyer Landing Page

Operating rules for every Claude Code agent in this repo. Read this fully before any task.
Single developer works this repo. These rules exist to keep the code clean, correct, and cheap to maintain.

## Project in one paragraph
A single-page marketing site for an Israeli law office (family law, torts, notary services). The audience is private
clients in a stressful moment who need to trust the office fast and reach it with one tap. Success = a WhatsApp chat
or a phone call started. The site is Hebrew-only and RTL from day one, and must meet Israeli web accessibility law
(IS 5568, WCAG 2.0 AA as the practical floor).

## Golden rules
1. **Design locked, then spec, then code.** No section is built before its mockup is approved and its spec exists in
   `/specs/`. Visual decisions are made in the mockup, not in code. This is what prevents design ping-pong.
2. **Contracts, not shapes.** All office data (name, phone, WhatsApp number, address, hours, practice areas) comes
   from one typed, Zod-validated content module. Components never hold their own copy of it.
3. **No spaghetti.** Small, single-responsibility components. Pure helpers (e.g. building `wa.me` / `tel:` links)
   live outside components and are unit-tested.
4. **Green or nothing.** Never mark a task done with failing tests, typecheck, lint, or partial work. If blocked,
   log the blocker as a new task and stop.
5. **Solve, don't patch.** Fix the root cause. Prefer shared tokens and primitives over one-off local styles.
6. **Token-efficient.** Read the spec + content module before re-reading large components.
7. **No hardcoded config.** Phone numbers, WhatsApp number, addresses, analytics IDs: config/env only. All UI copy
   lives in `/content`, never inline in components.

## Stack (locked)
- Next.js (App Router): static pages plus serverless routes for the review form and the admin (specs 18, 19)
- TypeScript strict everywhere
- Tailwind CSS + shadcn/ui, icons via `lucide-react` only
- Zod for the content contract and any external input
- Vitest for unit tests, Playwright for visual/E2E checks
- pnpm as package manager
- Deploy: Vercel, preview deploy per branch
- Cross-cutting from day one: Hebrew RTL, accessibility (IS 5568), fast mobile load

Don't add dependencies (animation libs, UI kits) or swap stack pieces without flagging it first.

## Project layout
```
/src/app/          Routes, root layout (lang="he" dir="rtl"), metadata
/src/components/   Section components (Hero, PracticeAreas, About, ...) + /ui for shadcn primitives
/src/lib/          Pure helpers (contact links, formatting), unit-tested
/content/          Typed, Zod-validated site copy and office data
/specs/            One spec per section, derived from the approved mockup
/design/           Design tokens, mockup links, approved screenshots, /assets (photos, references)
/docs/             Non-code workstreams (e.g. Google Business Profile)
PRODUCT.md         The brief: users, positioning, confirmed facts, open decisions. Source of truth for content.
/.claude/skills/   Project skills: ui-ux-pro-max, impeccable
```

## The build-verify loop (every task)
1. **Claim** the task. Confirm scope and which paths it touches.
2. **Spec check.** Approved mockup + spec for this section? If not, raise it and stop before building.
3. **Build** the smallest correct slice that satisfies the acceptance criteria.
4. **Verify.** Run tests, typecheck, lint, build. Screenshot and compare against the approved mockup.
5. **Self-review.** Diff vs acceptance criteria + golden rules. Stayed in scope?
6. **Handoff.** Small, focused commit. Propose the next task.

## Verification rules: test before you report
**Never tell the user something is done until it has been tested and confirmed working.** No ping-pong.

Do not mark a task complete unless:
- `pnpm build` passes with no errors.
- `pnpm test` passes for the changed behavior.
- `pnpm typecheck` and `pnpm lint` are clean.
- The section is verified with Playwright screenshots at 1440px and 390px, in RTL, and matches the mockup.
- Console has no errors or hydration warnings.
- WhatsApp and phone CTAs open the correct `wa.me` / `tel:` targets on mobile and desktop.
- Keyboard navigation, focus states, and contrast (4.5:1 body text) pass.

## Bug-fixing protocol
1. **Reproduce first.** Confirm the actual failing behavior before touching code.
2. **Find the root cause**, not the surface symptom.
3. **Apply the smallest correct fix**, general enough that the next similar case doesn't reappear.
4. **Re-test the exact failing flow** plus the related states around it.

## Security, legal & quality bar
- No secrets in code. Env/config only.
- Content must respect the Israel Bar Association advertising rules: no promised outcomes, no misleading claims.
  Flag any copy that might cross the line instead of writing it.
- No invented facts: stats, testimonials, credentials come only from the client. Use `[placeholder]` until then.
- Analytics or tracking require a cookie/privacy notice before launch.

## Design quality: non-negotiable
Generic, templated, "default-looking" output is a failed result, not a done one.
- Invoke the `ui-ux-pro-max` and `impeccable` skills before implementing UI; use `impeccable` audit/polish before
  calling a section done.
- Brand aesthetic (prototype v1, pending approval): the emotional brief is seriousness, warmth, care. Eucalyptus ink
  (#152420 / #24413A), brass (#B98A52, #7E5829 for text on light), limestone (#EEE9DF / #F7F4EE).
  Frank Ruhl Libre for headings, Assistant for body. Scroll-driven motion is part of the design (see the direction
  contract in `.impeccable/surfaces/`), always with a `prefers-reduced-motion` fallback.
- `design/prototype/index.html` is the visual source of truth once approved.
- Tokens live in Tailwind/CSS variables only. No raw hex in components.
- RTL-correct layout: logical properties only (`ms-`/`me-`, `ps-`/`pe-`, `start`/`end`), mirrored directional icons.
- No emojis anywhere. No em-dashes in site copy.
- Mobile first: a sticky call + WhatsApp bar is part of the core UX, not decoration.
- If it looks simple, templated, or old-fashioned, it isn't finished. Raise the bar and iterate.

## Git & workflow
- Branch per task: `feat/<slug>`, `fix/<slug>`. Small, focused commits.
- `main` is always releasable. No direct pushes to `main`, even solo (self-imposed until branch protection is set).
- Rebase on `main` before opening a PR.

## When unsure
Don't guess on anything architectural, legal, or brand-related. Present options in a table with a recommendation,
and ask one focused question.

## Out of scope (v1)
CRM/lead integrations, blog/articles, English version, online booking, a general CMS.
Phase 2 (planned, not now): press and cases page (spec 20).
In v1 after all: the review form and Yossi's moderation panel (specs 18, 19).
If asked, acknowledge they're planned for a later version and don't implement them now.
