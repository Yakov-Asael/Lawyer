# 19 Admin: review moderation (for Yossi)

## Purpose
A simple, private place where Yossi approves, edits or rejects submitted reviews. Built so it can later hold press
items and cases (spec 20) without a redesign.

## Access
- Route `/admin`, not linked from the site, `noindex`.
- Sign-in with Google (Auth.js), allowed only for an allowlist of emails in env (`ADMIN_EMAILS`). No passwords stored.
- Session expires after 30 days; sign-out button always visible.

## Screens
1. **תור לאישור (default)**: pending reviews, newest first. Each card: name, area, text, submitted date, phone (if
   given) with a call link for verification. Actions: אישור ופרסום, עריכה ואישור, דחייה.
2. **Edit**: name and text editable (shortening only, per the consent text), area select. Save and publish.
3. **מפורסמות**: approved reviews with drag handle to set order in the slider, and "הסרה מהאתר".
4. Empty states in words ("אין המלצות חדשות").

## Design
Internal tool: stock shadcn/ui components (Card, Button, Tabs, Dialog, Textarea, Badge) in the site's tokens and fonts.
Mobile first: Yossi will mostly approve from his phone. Hebrew RTL. No motion beyond defaults.

## Publishing
- Approve sets `status: "approved"`, `consentConfirmed: true` in the public review record, removes the phone, and
  triggers on-demand revalidation of `/` so the slider updates within seconds.
- Reject sets `status: "rejected"` (auto-deleted after 30 days).
- Audit fields: `approvedBy`, `approvedAt`.

## Data and stack (flag: new dependencies, see README)
| Need | Choice | Why |
|---|---|---|
| Database | Postgres via Vercel Marketplace (Neon), free tier | Relational, backups, works with Vercel previews |
| ORM / queries | Drizzle | Typed, light, SQL-first |
| Auth | Auth.js (Google provider) | No password handling |
| Email | Resend | New-review notifications |
| Bot protection | Cloudflare Turnstile | Free, privacy-friendly |

This moves the site from a pure static export to static pages plus serverless routes on Vercel.

## Acceptance criteria
- [ ] A non-allowlisted Google account cannot reach any `/admin` data (server-side check on every request).
- [ ] Approving a review shows it on `/` within 60 seconds; the phone number is no longer stored.
- [ ] Reordering published reviews changes the slider order.
- [ ] Full flow works on a 390px phone.
- [ ] `/admin` and `/api/*` are excluded from the sitemap and carry `noindex`.
