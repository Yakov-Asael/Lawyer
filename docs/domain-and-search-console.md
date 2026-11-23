# הדומיין ו-Google Search Console

דומיין: **yossi-shukrun.com** (פנוי נכון ל-2026-10-10). נרשם ב-GoDaddy על שם יעקב, ה-DNS מנוהל ב-Netlify.
אתר Netlify: `yossi-shukrun`. כתובת ראשית: `https://yossi-shukrun.com`, ו-www מפנה אליה.

האתר עולה לאוויר רק כש-production build עובר (placeholders פתוחים ועמודים משפטיים שלא אושרו חוסמים אותו בכוונה,
`content/index.ts`). את הדומיין, ה-DNS והאימות ב-Search Console אפשר לעשות כבר עכשיו.

## 1. רכישה ב-GoDaddy
- [ ] לחפש `yossi-shukrun.com`, לבחור **שנה אחת**. מחיר המבצע חל רק על השנה הראשונה, וקנייה לכמה שנים מחייבת את
      השנים הבאות במחיר המלא, כך שאין בה חיסכון.
- [ ] בקופה להסיר את כל התוספות: Email / Microsoft 365, Website Builder, SSL (Netlify נותן חינם), Domain Protection.
- [ ] לוודא ש-Domain Privacy פעיל (אמור להיות כלול) ו-Auto-renew פעיל.
- [ ] אופציונלי, אחרי 60 יום: העברה ל-Cloudflare Registrar (במחיר עלות, ההעברה כוללת שנה). ה-DNS נשאר ב-Netlify,
      אז האתר לא מושבת.

## 2. חיבור ל-Netlify (Netlify DNS)
1. Netlify: Projects > `yossi-shukrun` > **Domain management** > **Add a domain** > `yossi-shukrun.com` > Verify > Add domain.
2. כשנשאלים, לבחור **Set up Netlify DNS**. Netlify יוצר את האזור ומציג **4 שרתי שמות** (`dns1.p0X.nsone.net` וכו׳).
3. GoDaddy: My Products > הדומיין > **DNS** > **Nameservers** > Change > "I'll use my own nameservers" >
   להדביק את ארבעת השרתים מ-Netlify > Save. (GoDaddy יזהיר שה-DNS שלו יפסיק לעבוד: זה בדיוק המטרה.)
4. המתנה: בדרך כלל פחות משעה, לפעמים עד 24-48 שעות.
5. Netlify > Domain management:
   - לוודא ש-`yossi-shukrun.com` מסומן **Primary domain**. `www.yossi-shukrun.com` נוסף אוטומטית ומפנה (301) ל-apex.
   - **HTTPS**: Netlify מנפיק תעודת Let's Encrypt אוטומטית כשה-DNS מתעדכן. אם לא: "Verify DNS configuration" ואז
     "Provision certificate". HTTP מופנה ל-HTTPS אוטומטית.
   - `yossi-shukrun.netlify.app` מפנה לדומיין הראשי אוטומטית.

## 3. SITE_URL
`SITE_URL=https://yossi-shukrun.com` מוגדר ב-Netlify בהקשר **production** בלבד (הוגדר 2026-10-10).
הקוד (`src/lib/site-url.ts`) משתמש בו ל-canonical, `sitemap.xml`, `robots.txt`, Open Graph ו-JSON-LD.
ב-deploy previews הוא לא מוגדר, אז הם משתמשים בכתובת של Netlify, ו-robots חוסם בהם אינדוקס.

## 4. בדיקות אחרי שהאתר באוויר
- [ ] `http://www.yossi-shukrun.com` ו-`http://yossi-shukrun.com` מגיעים ב-301 ל-`https://yossi-shukrun.com/`.
- [ ] המנעול בדפדפן תקין (תעודה בתוקף).
- [ ] `https://yossi-shukrun.com/robots.txt`: `Allow: /` ושורת `Sitemap: https://yossi-shukrun.com/sitemap.xml`.
- [ ] `https://yossi-shukrun.com/sitemap.xml`: כל הכתובות על הדומיין (לא netlify.app).
- [ ] בקוד המקור של דף הבית: `<link rel="canonical" href="https://yossi-shukrun.com"/>` (Next.js מוריד את הלוכסן בדף הבית, וגוגל מתייחס לשתי הצורות כאותה כתובת) ו-`og:image` על הדומיין.

## 5. Google Search Console
**אימות (אפשר כבר עכשיו, אחרי שלב 2):**
1. https://search.google.com/search-console > Add property > **Domain** (לא URL prefix) > `yossi-shukrun.com`.
   נכס Domain מכסה apex, www, http ו-https ברשומה אחת.
2. גוגל מציג רשומת TXT (`google-site-verification=...`). להעתיק.
3. Netlify > Domain management > `yossi-shukrun.com` > **DNS settings** > Add new record:
   Type `TXT`, Name `@` (או ריק), Value: הערך מגוגל. Save.
4. חזרה ל-Search Console > Verify. אם נכשל, לנסות שוב אחרי כמה דקות עד שעה. לא למחוק את הרשומה אחרי האימות.

**אחרי שהאתר באוויר:**
- [ ] Sitemaps > להגיש `sitemap.xml` (הכתובת המלאה: `https://yossi-shukrun.com/sitemap.xml`).
- [ ] URL Inspection > `https://yossi-shukrun.com/` > **Request indexing**.
- [ ] Rich Results Test (https://search.google.com/test/rich-results) על `https://yossi-shukrun.com/`:
      מצופה לזהות **Local business** (`LegalService`) ו-**FAQ**, בלי שגיאות. הערה: מאז 2023 גוגל מציג תוצאות FAQ
      עשירות רק לאתרי ממשלה ובריאות, אז ה-FAQ יזוהה כתקין אבל לא יופיע כתוצאה מורחבת. זה צפוי.
- [ ] Schema Markup Validator (https://validator.schema.org) לבדיקה מלאה של כל השדות, כולל `founder` ושעות.
- [ ] אחרי שבוע-שבועיים: Performance > לבדוק הופעות לחיפושים "עורך דין חדרה", "נוטריון חדרה".
- [ ] אופציונלי: Bing Webmaster Tools > Import from Google Search Console (חינם, דקה).
