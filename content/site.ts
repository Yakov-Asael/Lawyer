import type { z } from "zod";
import type { Site } from "./schema";

/**
 * Raw site content. Validated in ./index.ts; components import from "@content", never from here.
 *
 * Missing client copy is written as "[placeholder: ...]" and blocks a production build.
 * Unknown optional facts (hours, parking, education) are omitted, not invented.
 */

const office = {
  name: "עו״ד יוסי שוקרון כהן",
  shortName: "יוסי שוקרון כהן",
  monogram: "ש״כ",
  title: "עורך דין ונוטריון",
  city: "חדרה",
  address: "הרברט סמואל 27",
  phoneDisplay: "052-252-1127",
  phoneE164: "+972522521127",
  whatsappE164: "972522521127",
  email: "shukruny@smile.net.il",
  yearsOfPractice: 30,
  // hours, accessAndParking, education: open items, waiting for Yossi.
} satisfies z.input<typeof Site>["office"];

export const siteContent = {
  office,

  whatsapp: {
    message: "שלום עו״ד שוקרון כהן, אשמח להתייעץ.",
    topicMessage: "שלום עו״ד שוקרון כהן, אשמח להתייעץ בנושא {topic}.",
  },

  ui: {
    skipLink: "דלג לתוכן",
    whatsappCta: "שלחו הודעה בוואטסאפ",
    callLabel: "חיוג ל-{phone}",
    wazeLabel: "ניווט למשרד ב-Waze",
    mapsLabel: "המשרד ב-Google Maps",
    whatsappShort: "וואטסאפ",
    callShort: "חיוג",
    navLabel: "ניווט ראשי",
    menuLabel: "תפריט",
    openMenu: "פתיחת תפריט",
    closeMenu: "סגירת תפריט",
  },

  brand: {
    sealRing: `${office.title} · ${office.city} · שוקרון כהן ·`,
    sealSub: "נוטריון",
  },

  navigation: {
    header: [
      { label: "תחומי עיסוק", href: "#areas" },
      { label: "אודות", href: "#about" },
      { label: "שאלות נפוצות", href: "#faq" },
      { label: "הגעה למשרד", href: "#visit" },
    ],
    menu: [
      { label: "תחומי עיסוק", href: "#areas" },
      { label: "אודות", href: "#about" },
      { label: "המלצות", href: "#reviews" },
      { label: "שאלות נפוצות", href: "#faq" },
      { label: "הגעה למשרד", href: "#visit" },
    ],
  },

  hero: {
    line1: "ליווי משפטי אישי.",
    line2: "30 שנה בחדרה.",
    sub: "דיני משפחה, נזיקין וביטוח, מקרקעין וחוזים ושירותי נוטריון. את התיק שלכם מלווה עו״ד שוקרון כהן בעצמו, מהשיחה הראשונה ועד סוף הטיפול.",
    subEmphasis: "את התיק שלכם מלווה עו״ד שוקרון כהן בעצמו",
    portraitAlt: office.name,
  },

  statement: {
    label: "גישה אישית",
    text: "כשעומדים מול גירושין, תאונה או עסקה גדולה, הדבר החשוב ביותר הוא לדעת שיש מי שמכיר את התיק שלכם לעומק, עונה לטלפון, ומסביר כל שלב בשפה פשוטה.",
    highlight: "הדבר החשוב ביותר",
    footLabel: "בלי מתווכים",
    footText: "אתם מדברים ישירות עם עורך הדין שמטפל בתיק.",
  },

  years: {
    eyebrow: "ותק",
    heading: "שלושים שנה של עבודה משפטית בחדרה",
    body: "היכרות ארוכת שנים עם העיר, עם בתי המשפט באזור ועם האנשים שפונים למשרד.",
  },

  areas: {
    eyebrow: "תחומי עיסוק",
    line1: "ארבעה תחומים,",
    line2: "עורך דין אחד.",
    intro: "בחרו את הנושא ושלחו הודעה. ההודעה בוואטסאפ תיפתח עם שם התחום, כדי שתוכלו פשוט לכתוב מה קרה.",
  },

  // Services are a first draft from the mockup and still need Yossi's confirmation.
  practiceAreas: [
    {
      id: "family",
      tabLabel: "דיני משפחה ומעמד אישי",
      headline: "כשהמשפחה משתנה, צריך מישהו יציב לצידכם.",
      lead: "ליווי רגיש ודיסקרטי בהליכים שנוגעים בדברים הכי אישיים.",
      services: [
        "גירושין והסכמי גירושין",
        "משמורת והסדרי שהות",
        "מזונות",
        "הסכמי ממון וידועים בציבור",
        "ירושות וצוואות",
      ],
      whatsappTopic: "דיני משפחה",
      ctaLabel: "שאלה בנושא משפחה",
      servicesNote: "[placeholder: רשימה לאישור יוסי]",
    },
    {
      id: "torts",
      tabLabel: "נזיקין וביטוח",
      headline: "אחרי פגיעה, הזמן שלכם צריך ללכת להחלמה.",
      lead: "טיפול בתביעה ובהתנהלות מול חברות הביטוח, כדי שלא תצטרכו לעשות את זה לבד.",
      services: ["תאונות דרכים", "נזקי גוף", "תביעות מול חברות ביטוח", "תאונות עבודה"],
      whatsappTopic: "נזיקין וביטוח",
      ctaLabel: "שאלה בנושא נזיקין",
      servicesNote: "[placeholder: רשימה לאישור יוסי]",
    },
    {
      id: "real-estate",
      tabLabel: "מקרקעין, נדל״ן וחוזים",
      headline: "העסקה הגדולה בחיים ראויה לבדיקה יסודית.",
      lead: "ליווי משפטי בקנייה, במכירה ובכל חוזה שחשוב לכם להבין לפני שחותמים.",
      services: ["קנייה ומכירה של דירה", "בדיקת חוזים וניסוחם", "רישום בטאבו", "הסכמי שכירות"],
      whatsappTopic: "מקרקעין וחוזים",
      ctaLabel: "שאלה בנושא נדל״ן",
      servicesNote: "[placeholder: רשימה לאישור יוסי]",
    },
    {
      id: "notary",
      tabLabel: "נוטריון",
      headline: "אישור נוטריוני, באותו משרד ובאותה שיחה.",
      lead: "אימותים, תרגומים וייפויי כוח, בלי לחפש משרד נוסף.",
      services: ["אימות חתימה", "העתק נאמן למקור", "תרגום נוטריוני", "ייפוי כוח נוטריוני"],
      whatsappTopic: "שירותי נוטריון",
      ctaLabel: "תיאום אישור נוטריוני",
      servicesNote: "[placeholder: רשימה לאישור יוסי]",
    },
  ],

  process: [
    {
      title: "שולחים הודעה או מתקשרים",
      body: "כמה משפטים על מה שקרה מספיקים. אין צורך להכין מסמכים מראש.",
    },
    {
      title: "נפגשים במשרד",
      body: `פגישה אישית ב${office.address}, שבה עוברים על המצב ועל האפשרויות.`,
    },
    {
      title: "ליווי עד סוף הטיפול",
      body: "אותו עורך דין לאורך כל הדרך, עם עדכונים ותשובות ישירות.",
    },
  ],

  about: {
    paragraphs: [
      `${office.title}, ${office.yearsOfPractice} שנה במשרד ב${office.city}. [placeholder: פסקה אישית קצרה של יוסי, למה בחר במקצוע ואיך הוא עובד עם לקוחות]`,
      "המשרד מטפל בתיקים בדיני משפחה, נזיקין וביטוח, מקרקעין וחוזים, ומעניק שירותי נוטריון.",
    ],
  },

  faq: [
    {
      question: "איך קובעים פגישה?",
      answer: `שולחים הודעה בוואטסאפ או מתקשרים ל-${office.phoneDisplay}. כמה משפטים על מה שקרה מספיקים כדי להתחיל.`,
    },
    { question: "כמה עולה פגישת הייעוץ הראשונה?", answer: "[placeholder: תשובה של יוסי]" },
    { question: "מה כדאי להביא לפגישה?", answer: "[placeholder: תשובה של יוסי, לפי תחום]" },
    {
      question: "האם מה שאני מספר בפגישה נשאר חסוי?",
      answer:
        "כן. הדברים שנאמרים לעורך דין במסגרת הייעוץ מוגנים בחיסיון עורך דין ולקוח. [placeholder: לאישור נוסח עם יוסי]",
    },
    { question: "אפשר לקבל אישור נוטריוני בלי תיק במשרד?", answer: "[placeholder: תשובה של יוסי]" },
    { question: "האם המשרד מטפל בלקוחות מחוץ לחדרה?", answer: "[placeholder: תשובה של יוסי]" },
  ],

  finalCta: {
    line1: "בואו נדבר",
    line2: "על מה שקרה.",
    body: "הודעה אחת בוואטסאפ או שיחת טלפון, ועו״ד שוקרון כהן יחזור אליכם.",
  },

  legal: {
    disclaimer: "המידע באתר אינו מהווה ייעוץ משפטי.",
    accessibilityStatementPath: "/accessibility-statement",
    privacyPath: "/privacy-policy",
  },
} satisfies z.input<typeof Site>;
