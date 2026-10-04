import type { z } from "zod";
import type { LegalPage } from "../schema";
import { office } from "../site";

/**
 * Privacy policy (spec 16). Describes the site as built: no analytics, no cookies, no Maps embed; the review form
 * (spec 18) goes through Netlify Forms. A draft for Yossi: `approved` stays false until he signs off.
 * If analytics or a Maps embed are ever added, this page and a cookie notice must change with them.
 */
export const privacyPage = {
  slug: "privacy",
  title: "מדיניות פרטיות",
  updatedAt: "2026-10-04",
  approved: false,
  intro: `${office.name} מכבד את הפרטיות שלכם. מדיניות זו מסבירה איזה מידע נאסף כשאתם משתמשים באתר, למה, ומה הזכויות שלכם.`,
  sections: [
    {
      heading: "מי אנחנו",
      body: [`האתר מופעל על ידי ${office.name}, ${office.title}, ${office.address}, ${office.city}.`],
    },
    {
      heading: "המידע שנאסף באתר",
      body: [
        "האתר אינו מבקש מכם להירשם או למסור פרטים אישיים כדי לקרוא אותו. אין באתר כלי מעקב, כלי ניתוח תנועה או עוגיות פרסום.",
        "שירות האחסון של האתר, Netlify, רושם מידע טכני בסיסי, כמו כתובת IP וסוג הדפדפן, לצורך הפעלה ואבטחה של האתר בלבד.",
      ],
    },
    {
      heading: "מידע שנשמר במכשיר שלכם",
      body: [
        "הגדרות תפריט הנגישות שבחרתם, וסימון שכבר ראיתם את פתיח האתר, נשמרים בדפדפן שלכם בלבד. המידע הזה אינו נשלח אלינו, ואפשר למחוק אותו בכל רגע מהגדרות הדפדפן.",
      ],
    },
    {
      heading: "פנייה למשרד",
      body: [
        "כשאתם פונים בוואטסאפ, בטלפון או בדוא״ל, הפרטים שאתם בוחרים למסור מגיעים למשרד ומשמשים רק לטיפול בפנייה שלכם. מה שנאמר לעורך דין במסגרת ייעוץ מוגן בחיסיון עורך דין ולקוח.",
        "שיחות בוואטסאפ עוברות דרך שירות של חברת מטא, וחלים עליהן תנאי השימוש ומדיניות הפרטיות שלה.",
      ],
    },
    {
      heading: "טופס ההמלצה",
      body: [
        "אם תבחרו להשאיר המלצה, הפרטים שתמלאו בטופס (שם לפרסום, תחום הטיפול, ההמלצה, ואם תרצו גם טלפון) נשלחים למשרד בדוא״ל דרך שירות הטפסים של חברת האחסון. המלצה מתפרסמת באתר רק אחרי אישור המשרד, ורק בהסכמתכם.",
        "מספר הטלפון משמש רק כדי לאמת את ההמלצה, ולעולם אינו מתפרסם. אחרי שההמלצה פורסמה או נדחתה, הפנייה נמחקת משירות הטפסים.",
      ],
    },
    {
      heading: "קישורים לשירותים חיצוניים",
      body: [
        "באתר יש קישורים לוואטסאפ, לוייז ולגוגל מפות. כשאתם עוברים אליהם, חלה עליכם מדיניות הפרטיות של אותו שירות.",
      ],
    },
    {
      heading: "הזכויות שלכם",
      body: [
        "לפי חוק הגנת הפרטיות, התשמ״א-1981, אתם רשאים לבקש לעיין במידע שנשמר עליכם אצל המשרד, ולבקש לתקן או למחוק אותו. [placeholder: לאישור נוסח עם יוסי]",
      ],
    },
    {
      heading: "שינויים במדיניות",
      body: ["המשרד רשאי לעדכן את המדיניות מעת לעת. התאריך בראש העמוד מציין את הגרסה העדכנית."],
    },
    {
      heading: "יצירת קשר",
      body: ["לשאלות על המדיניות או על המידע שלכם:"],
      contact: {
        name: office.name,
        phoneDisplay: office.phoneDisplay,
        phoneE164: office.phoneE164,
        email: office.email,
        address: `${office.address}, ${office.city}`,
      },
    },
  ],
} satisfies z.input<typeof LegalPage>;
