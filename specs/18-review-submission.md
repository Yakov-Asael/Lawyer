# 18 Review submission

## Purpose
Let clients leave a testimonial on the site. Nothing is published until Yossi approves it (spec 19).

## Entry points
1. "השאירו המלצה" button under the reviews slider (ghost button with a pen icon).
2. A direct route `/review` with the same form, so Yossi can send clients a link after a case closes
   (e.g. by WhatsApp). Optional `?area=family|torts|real-estate|notary` pre-selects the practice area.

## Form (as designed in the prototype)
| Field | Rules | Published |
|---|---|---|
| שם לפרסום | Required, 2 to 40 chars. Hint: "אפשר גם שם פרטי ואות ראשונה" | Yes |
| תחום הטיפול | Required, one of the 5 areas | Yes |
| ההמלצה | Required, 40 to 600 chars, live counter | Yes (may be shortened by the office) |
| טלפון | Optional, Israeli format, "לא יפורסם". Only for verification | Never |
| Consent checkbox | Required: "אני מאשר/ת לפרסם את ההמלצה באתר בשם שכתבתי. ידוע לי שהמשרד רשאי לקצר אותה או לא לפרסם אותה." | No |

Line under the title: "ההמלצה תפורסם באתר רק אחרי אישור המשרד."

## Layout and behavior
- On the page: a dialog. Phones: bottom sheet (rounded top, full width). ≥700px: centered, max 560px.
- On `/review`: the same form as a page, using the legal-page template (spec 17).
- Inline validation on submit: each error under its field in words, `aria-invalid`, focus moves to the first invalid field.
- Submit shows "שולח..." and disables the button; success replaces the form with a thank-you state and a close button.
- Server error: the form stays filled, a message explains and offers WhatsApp as a fallback.
- Esc and the backdrop close the dialog; focus returns to the opener.

## Backend (decision 2026-10-03: option A, email and manual publishing)
No database and no admin panel in v1. Volume is a few reviews a year; publishing stays a deliberate, manual act.

- The form posts to **Netlify Forms** (free plan: 100 submissions/month). With the Next.js runtime the form also
  needs a static copy in `public/` so Netlify can detect it at deploy time.
- Netlify emails each submission to the site owner (form notification). Nothing is stored on our side.
- Publishing: the approved review is added by hand to `content.reviews` with `consentConfirmed: true`, then deployed.
  The site reads only `getApprovedReviews()`, so moving to a database later (spec 19) changes one function.
- Spam protection: honeypot field (Netlify `netlify-honeypot`) plus Netlify's built-in reCAPTCHA if spam appears.
- Privacy: the phone number exists only in the notification email and the Netlify form log; submissions are deleted
  from Netlify after publishing or rejection. The privacy policy (spec 16) must describe this before launch.

## Rules
- The site never shows a submitted review before approval.
- No rating stars collected in v1 (avoids implying a score the office curates).
- Copy must not ask for case details; the hint says to avoid personal or case-identifying information.

## Acceptance criteria
- [x] Empty submit shows 4 field errors and the consent error; focus lands on the first invalid field.
- [ ] Valid submit reaches Netlify Forms (and the notification email) and shows the thank-you state; nothing appears on the site.
- [x] `/review?area=torts` opens with "נזיקין וביטוח" selected.
- [x] Side-by-side fields (name, area) share the same top and height (measured); the select uses a custom chevron, not the native control.
- [ ] A bot filling the honeypot is dropped by Netlify (no submission, no email).
- [x] Keyboard-only and screen-reader flows work end to end at 390 and 1440.

## Implementation (built)
- **Form** (`src/components/review/ReviewForm.tsx`): shared by the dialog and the page. Validation runs on submit,
  then live so a fixed error clears. Each error sits under its field in words, with `aria-invalid` and
  `aria-describedby`. Focus moves to the first invalid field. The counter shows `n / 600`. Copy lives in
  `site.reviewForm`, and the limits live in `src/lib/review-form.ts`; a test checks that the copy quotes them.
- **Logic** (`src/lib/review-form.ts`, unit-tested): `validateReview`, `normalizeIlPhone` (mobile, 07X and
  landlines; accepts +972), `encodeReview` (area sent as its label so the email reads naturally, phone normalised)
  and `areaFromParam` (unknown values ignored).
- **Netlify Forms**: `public/__forms.html` declares form `review` with `netlify-honeypot="bot-field"`; the site posts
  urlencoded to `/__forms.html`, as the Netlify Next.js runtime requires. A test keeps the field names in sync.
- **Dialog** (`ReviewDialog.tsx`): the shared `SheetDialog` (also the spec 09 reader), a native `<dialog>` with `showModal()`. The browser handles the focus trap, Esc
  and the inert page; the backdrop click, the Lenis scroll lock and the focus return are ours. Phones get a bottom
  sheet and 700px+ a centred panel at most 560px. It rises in under `html.motion` only. A typed draft survives a
  close; a sent form resets.
- **Entry points**: "השאירו המלצה" (ghost, pen icon) sits centred under the slider (owner feedback), or under the intro
  while there are no reviews. `/review` uses the legal template (shared `LegalTitleCard`), is `noindex` and stays out
  of the sitemap.
- **Server error**: the typed values stay, plus an alert with a WhatsApp link that carries the review text.
- **Dock**: the phone dock steps aside while a text field has focus, so it never covers the field or sits on the
  keyboard.
- **Privacy policy**: the review-form clause now names the fields, says the phone is used only to verify the review
  and is never published, and says the submission is deleted after publishing or rejection.
- **Verified with Playwright stubs** (the container cannot reach Netlify): the payload, the thank-you, the error
  path, the keyboard flow, the honeypot wiring, and `?area=torts` → נזיקין וביטוח.
- **Open: verify on a Netlify deploy preview.** Submit once and confirm the email arrives. Then fill the honeypot
  and confirm Netlify drops it. Form notifications: Netlify UI → Forms → review → Form notifications → Email.
