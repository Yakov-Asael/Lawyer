# שוקרון כהן: דף נחיתה

דף נחיתה לעו״ד יוסי שוקרון כהן, עורך דין ונוטריון בחדרה.
המטרה: שהגולש ישלח הודעה בוואטסאפ או יתקשר.

## סטטוס

| שלב | מצב |
|---|---|
| Brief | הושלם, ב-`PRODUCT.md` |
| עיצוב | אב-טיפוס ממתין לאישור הפלטה של יוסי, ב-`design/prototype/`. טוקנים ב-`design/tokens.md` |
| Specs | טיוטה מלאה ב-`specs/` (17 קבצים + חוזה תוכן), ממתינה לאישור |
| קוד | Foundations (spec 00 shell + חוזה תוכן) ב-`feat/foundations` |
| Google Business Profile | צ'קליסט ב-`docs/google-business-profile.md` |

## תהליך העבודה

1. **Brief**: עובדות מאושרות בלבד. לא ממציאים נתונים, המלצות או הבטחות לתוצאה.
2. **עיצוב נעול**: אב-טיפוס HTML חי עם התנועה האמיתית, מאושר לפני קוד.
3. **Specs**: spec לכל סקשן בתיקייה `/specs/`, שנגזר מהאב-טיפוס המאושר.
4. **בנייה**: סקשן אחרי סקשן, עם בדיקת צילומי מסך מול האב-טיפוס.

הכללים המלאים נמצאים ב-`CLAUDE.md`.

## מבנה

```
CLAUDE.md          כללי העבודה של הפרויקט
PRODUCT.md         ה-brief: קהל, מיצוב, עובדות, החלטות פתוחות
design/assets/     תמונות וחומרי מקור מהלקוח
design/prototype/  אב-טיפוס HTML חי (המוקאפ הנעול)
design/tokens.md   צבעים, טיפוגרפיה, מרווחים ותנועה
specs/             spec לכל סקשן + חוזה התוכן
docs/              משימות שאינן קוד (Google Business Profile)
.claude/skills/    סקילים: ui-ux-pro-max, impeccable
.impeccable/       חוזה הכיוון העיצובי וצילומי בדיקה
```

## סטאק (לשלב הקוד)

Next.js (App Router), TypeScript strict, Tailwind CSS, shadcn/ui, lucide-react, Zod, Vitest, Playwright, pnpm.
פריסה ל-Netlify (תוכנית חינמית).

## צפייה באב-טיפוס

פותחים את `design/prototype/index.html` בדפדפן. הגלילה החלקה (Lenis) נטענת מ-CDN,
ובלעדיה הדף עובד עם גלילה רגילה.

## פיתוח

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm verify       # typecheck + lint + unit tests + build
pnpm test:e2e     # Playwright ב-1440 וב-390 (דורש pnpm build קודם)
```

בסביבת ענן: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm test:e2e`.
