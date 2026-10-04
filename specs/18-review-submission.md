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
- [ ] Empty submit shows 4 field errors and the consent error; focus lands on the first invalid field.
- [ ] Valid submit reaches Netlify Forms (and the notification email) and shows the thank-you state; nothing appears on the site.
- [ ] `/review?area=torts` opens with "נזיקין וביטוח" selected.
- [ ] Side-by-side fields (name, area) share the same top and height (measured); the select uses a custom chevron, not the native control.
- [ ] A bot filling the honeypot is dropped by Netlify (no submission, no email).
- [ ] Keyboard-only and screen-reader flows work end to end at 390 and 1440.
