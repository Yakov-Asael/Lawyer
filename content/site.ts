import type { z } from "zod";
import type { Site } from "./schema";

/**
 * Raw site content. Validated in ./index.ts; components import from "@content", never from here.
 *
 * Missing client copy is written as "[placeholder: ...]" and blocks a production build.
 * Unknown optional facts are omitted, not invented. Yossi's own words: content/source/yossi-2026-10-04.md.
 */

export const office = {
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
  yearsOfPractice: 23,
  licensed: { lawyer: 2003, notary: 2015 },
  education: "משפטים ומנהל עסקים, המכללה האקדמית נתניה",
  hours: "קבלת קהל בתיאום מראש, בימים א׳ עד ה׳ בין 8:00 ל-18:00, ולפי הצורך גם מחוץ לשעות האלה.",
  // Yossi (2026-10-05): no elevator and no real wheelchair access; not mentioned here at his request. The
  // accessibility statement still has to describe it (service-accessibility regulations).
  accessAndParking: "קומה 1. יש חניה בקרבת המשרד, ליד פוליצר.",
  // Source: content/source/yossi-2026-10-04.md. Prices are never shown (owner decision).
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
    dockLabel: "יצירת קשר מהירה",
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
    kicker: `${office.title} ב${office.city}`,
    line1: "ליווי משפטי אישי.",
    line2: `${office.yearsOfPractice} שנות ניסיון.`,
    sub: "משפחה וירושה, מקרקעין ונדל״ן, נזיקין וביטוח, משפט אזרחי ומסחרי ושירותי נוטריון. את התיק שלכם מלווה עו״ד שוקרון כהן בעצמו, מהשיחה הראשונה ועד סוף הטיפול.",
    subEmphasis: "את התיק שלכם מלווה עו״ד שוקרון כהן בעצמו",
    portraitAlt: office.name,
  },

  statement: {
    label: "גישה אישית",
    text: "כשמשפחה, נכס, כסף או זכות שלכם עומדים על הפרק, חשוב לדעת שיש לצידכם עורך דין שרואה את התמונה המלאה, מקשיב, ובונה יחד אתכם את הדרך הנכונה לפעול.",
    highlight: "חשוב לדעת",
    footLabel: "בלי מתווכים",
    footText: "אתם מדברים ישירות עם עורך הדין שמטפל בתיק.",
  },

  years: {
    eyebrow: "ותק",
    heading: "עשרים ושלוש שנה של ייעוץ וייצוג משפטי",
    body: `ניסיון מעשי בייעוץ, במשא ומתן, בגישור ובניהול הליכים בבתי המשפט, בתחומי המשפט האזרחי והמסחרי. עורך דין משנת ${office.licensed.lawyer}, נוטריון משנת ${office.licensed.notary}.`,
  },

  areas: {
    eyebrow: "תחומי עיסוק",
    line1: "חמישה תחומים,",
    line2: "עורך דין אחד.",
    intro: "בחרו את הנושא ושלחו הודעה. ההודעה בוואטסאפ תיפתח עם שם התחום, כדי שתוכלו פשוט לכתוב מה קרה.",
  },

  // Five areas, in this order, confirmed with Yossi on 2026-10-04. The notary list is still a draft.
  practiceAreas: [
    {
      id: "family",
      tabLabel: "דיני משפחה וירושה",
      headline: "כשהמשפחה משתנה, צריך מישהו יציב לצידכם.",
      lead: "מעבר להיבטים המשפטיים, מצבים משפחתיים דורשים שיקול דעת, רגישות והבנה של ההשלכות לטווח הארוך.",
      services: [
        "גירושין וחלוקת רכוש",
        "מחלוקות בין בני משפחה",
        "צוואות, ירושות ועיזבונות",
        "צווי ירושה",
        "צווי הורות פסיקתיים",
        "העברות במתנה",
      ],
      whatsappTopic: "דיני משפחה וירושה",
      ctaLabel: "שאלה בנושא משפחה",
    },
    {
      id: "real-estate",
      tabLabel: "מקרקעין ונדל״ן",
      headline: "העסקה הגדולה בחיים ראויה לבדיקה יסודית.",
      lead: "עסקאות ומחלוקות בנכסים ובזכויות במקרקעין, מבדיקת ההסכם ועד ניהול הליך כשאין פתרון בהסכמה.",
      services: [
        "ליווי עסקאות קנייה ומכירה",
        "בחינת הסכמים",
        "מחלוקות בין בעלי זכויות",
        "בעלות ושימוש בנכסים",
        "תכנון ובנייה",
      ],
      whatsappTopic: "מקרקעין ונדל״ן",
      ctaLabel: "שאלה בנושא נדל״ן",
    },
    {
      id: "torts",
      tabLabel: "נזיקין וביטוח",
      headline: "כשחברת הביטוח לא ממהרת להכיר בזכאות.",
      lead: "כסוכן ביטוח לשעבר, עו״ד שוקרון כהן מכיר את ההתנהלות בחברות הביטוח מבפנים, מהגשת ההצעה ועד התביעה.",
      services: [
        "דחיית תביעות ביטוח",
        "מחלוקות על הכיסוי ופרשנות הפוליסה",
        "מחלוקות על היקף הנזק והפיצוי",
        "תאונות ונזקי גוף",
      ],
      whatsappTopic: "נזיקין וביטוח",
      ctaLabel: "שאלה בנושא ביטוח",
    },
    {
      id: "civil",
      tabLabel: "משפט אזרחי ומסחרי",
      headline: "לא כל מחלוקת חייבת להגיע לבית המשפט.",
      lead: "קודם בודקים אם אפשר להגיע להסכמה, במשא ומתן או בגישור. כשאין ברירה, ייצוג מלא לאורך כל ההליך.",
      services: [
        "הפרת חוזים והסכמים",
        "מחלוקות כספיות ועסקיות",
        "ניסוח ובדיקת הסכמים",
        "ליטיגציה אזרחית ומסחרית",
        "גישור ויישוב סכסוכים",
      ],
      whatsappTopic: "משפט אזרחי ומסחרי",
      ctaLabel: "שאלה בנושא עסקי",
    },
    {
      id: "notary",
      tabLabel: "נוטריון",
      headline: "אישור נוטריוני, באותו משרד ובאותה שיחה.",
      lead: "אימותים, תרגומים וייפויי כוח, כולל ייפוי כוח מתמשך, בלי לחפש משרד נוסף.",
      services: ["אימות חתימה", "העתק נאמן למקור", "תרגום נוטריוני", "ייפוי כוח נוטריוני", "ייפוי כוח מתמשך"],
      whatsappTopic: "שירותי נוטריון",
      ctaLabel: "תיאום אישור נוטריוני",
      servicesNote: "[placeholder: רשימה לאישור יוסי]",
    },
  ],

  reviewsHead: {
    eyebrow: "המלצות",
    heading: "מה אומרים לקוחות.",
    note: "המלצות שנבחרו על ידי המשרד ומתפרסמות בהסכמת הלקוחות.",
    empty: "היו הראשונים לשתף איך היה לעבוד איתנו.",
    carouselLabel: "המלצות לקוחות",
    roleDescription: "קרוסלה",
    prev: "ההמלצות הקודמות",
    next: "ההמלצות הבאות",
    readMore: "קראו עוד",
    readerTitle: "המלצה",
    close: "סגירה",
  },

  // Approved reviews, newest first, added by hand from the submission email (spec 18, option A).
  // The first three came from Yossi (2026-10-08), published in full as the clients wrote them (only dashes became
  // commas). Open with Yossi: full or trimmed wording (Bar advertising rules), each review's area, and the third
  // reviewer's name.
  reviews: [
    {
      quote:
        "הריני להצהיר כי בשנים האחרונות אני מלווה בביטחה ע״י עו״ד מר יוסי שוקרון החשוב! ובכל ענין שטופל על ידו. ובשכר טירחה \"הוגן\" סיימנו \"בנצחון\" \"ובהישגים\"!! ממליץ בכל לב!!",
      clientName: "ב״י, חדרה",
      consentConfirmed: true,
    },
    {
      quote:
        "אין לי מספיק מילים כדי להמליץ על העורך הדין יוסי שוקרון, שמלווה אותי במסירות כבר שנים רבות. הגעתי ליוסי אחרי שעורך דין אחר כבר הרים ידיים ולא נתן לי הרבה תקווה שאצליח להשיג את מה שמגיע לי. יוסי, לעומת זאת, האמין בי ובמקרה שלי, לא ויתר ולא הרים ידיים. הוא פעל עבורי בדרך ישרה, מקצועית ונחושה, ובסופו של דבר הצליח להשיג עבורי את המקסימום שיכולתי לבקש. יוסי הוא קודם כול בן אדם עם לב ענק, אכפתי, קשוב, סבלני, דייקן ומקצועי מאוד. בכל פעם שהייתי צריכה אותו, הוא היה שם בשבילי, נתן לי ביטחון והרגשתי שאני בידיים הכי טובות שיש. הוא עושה את העבודה שלו מכל הלב, יורד לפרטים הקטנים ולא מוותר עד שהוא עושה הכול כדי להשיג עבורי את התוצאה הטובה ביותר. מבחינתי, יוסי הוא לא רק עורך הדין שלי. הוא אדם שאני סומכת עליו באמת. ההצלחה שלי היא ההצלחה שלו, וזה משהו שמרגישים בכל צעד ובכל טיפול. אחרי שנים של ליווי, אני יכולה לומר בלב שלם, זכיתי בעורך דין שהוא גם מקצוען אמיתי וגם אדם מדהים. ממליצה עליו מכל הלב!",
      clientName: "דליה אריאלי",
      consentConfirmed: true,
    },
    {
      quote:
        "אני רוצה להמליץ מכל הלב על עו״ד יוסי שוקרון, שליווה אותי וטיפל בענייני במקצועיות, במסירות ובנחישות. מדובר בתחום מורכב ורגיש מאוד, ויוסי ידע לשלב בין מקצועיות ויסודיות לבין יחס אישי, סבלנות והבנה של המצב שבו הייתי. הוא היה זמין, קשוב, הסביר לי כל שלב בצורה ברורה והשקיע מאמץ רב כדי לקדם את הדברים ולפעול לטובתי. הרגשתי לאורך כל הדרך שיש לי עורך דין שנלחם עבורי, לא מוותר על הפרטים הקטנים ובאמת אכפת לו מהתוצאה. אני ממליצה עליו בחום לכל מי שנמצא בהליך משפטי ומחפש עורך דין מקצועי, יסודי, נחוש ואנושי.",
      clientName: "[placeholder: שם הממליץ, לאישור יוסי]",
      consentConfirmed: true,
    },
  ],

  processHead: {
    eyebrow: "איך מתחילים",
    heading: "שלושה צעדים, והראשון לוקח דקה.",
  },

  process: [
    {
      title: "שולחים הודעה או מתקשרים",
      body: "כמה משפטים על מה שקרה מספיקים. בשיחה קצרה תדעו בדיוק אילו מסמכים להביא.",
    },
    {
      title: "נפגשים במשרד",
      body: `פגישה אישית בתיאום מראש, ב${office.address}, שבה עוברים על המצב ועל האפשרויות.`,
    },
    {
      title: "ליווי עד סוף הטיפול",
      body: "אותו עורך דין לאורך כל הדרך, עם עדכונים ותשובות ישירות.",
    },
  ],

  about: {
    eyebrow: "אודות",
    heading: ["עו״ד יוסי", "שוקרון כהן"],
    factLabels: {
      experience: "ניסיון",
      license: "הסמכה",
      office: "משרד",
      education: "השכלה",
      years: "שנה",
      licenseValue: "עו״ד {lawyer} · נוטריון {notary}",
    },
    // Same portrait as the hero for now (decorative, so no alt). An office or at-work photo is an open item.
    photoAlt: "",
    // First person (owner decision, 2026-10-04); the rest of the site stays neutral. No signature (owner decision).
    paragraphs: [
      "העיקרון שמנחה אותי הוא שאין שני תיקים זהים ואין שני לקוחות זהים. לכן כל מקרה מתחיל בהיכרות עם האדם שמאחורי הבעיה: העובדות, המטרות, הצרכים והחששות. רק אחר כך בוחנים את כל האפשרויות, המשפטיות והמעשיות, ובוחרים יחד את הדרך המתאימה.",
      "לא בכל מחלוקת חייבים להגיע לבית המשפט. לעיתים הדרך הנכונה היא פתרון מוסכם, במשא ומתן או בגישור, שחוסך זמן, עלויות והליך ממושך. כשפתרון בהסכמה אינו אפשרי, אני מעניק ייצוג משפטי מלא לאורך כל ההליך.",
    ],
  },

  a11y: {
    open: "תפריט נגישות",
    title: "נגישות",
    close: "סגירת תפריט הנגישות",
    textSize: "גודל טקסט",
    smaller: "הקטנת טקסט",
    larger: "הגדלת טקסט",
    reset: "איפוס הגדרות",
    options: {
      contrast: "ניגודיות גבוהה",
      gray: "גווני אפור",
      links: "הדגשת קישורים",
      font: "גופן קריא",
      still: "עצירת אנימציות",
      cursor: "סמן גדול",
    },
  },

  visit: {
    eyebrow: "הגעה למשרד",
    heading: "איפה אנחנו",
    whatsappCta: "לתיאום פגישה בוואטסאפ",
    mapLabel: "מפת המיקום של המשרד, פתיחה ב-Google Maps",
  },

  faqHead: {
    eyebrow: "שאלות נפוצות",
    heading: "לפני שפונים.",
    intro: "לא מצאתם תשובה? שלחו את השאלה בוואטסאפ.",
  },

  // Answers come from Yossi. An answer still marked "[placeholder...]" shows on previews only;
  // the live site leaves that question out (spec 10).
  faq: [
    {
      question: "איך קובעים פגישה?",
      answer: `שולחים הודעה בוואטסאפ או מתקשרים ל-${office.phoneDisplay}. כמה משפטים על מה שקרה מספיקים כדי להתחיל.`,
    },
    // Never a price on the site (owner decision).
    {
      question: "כמה עולה פגישת הייעוץ הראשונה?",
      answer: "את עלות הפגישה הראשונה אפשר לברר מראש, בשיחת הטלפון הקצרה שלפני הפגישה, כך שמגיעים בלי הפתעות.",
    },
    {
      question: "מה כדאי להביא לפגישה?",
      answer:
        "לפני הפגישה מתקיימת שיחת טלפון קצרה. מספרים בה בכמה משפטים על המקרה, ועו״ד שוקרון כהן אומר בדיוק אילו מסמכים להביא.",
    },
    {
      question: "האם מה שאני מספר בפגישה נשאר חסוי?",
      answer:
        "כן. הדברים שנאמרים לעורך דין במסגרת הייעוץ מוגנים בחיסיון עורך דין ולקוח. [placeholder: לאישור נוסח עם יוסי]",
    },
    { question: "אפשר לקבל אישור נוטריוני בלי תיק במשרד?", answer: "[placeholder: תשובה של יוסי]" },
    { question: "האם המשרד מטפל בלקוחות מחוץ לחדרה?", answer: "כן. המשרד מלווה לקוחות גם מחוץ לחדרה." },
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
    termsPath: "/terms",
    accessibilityLabel: "הצהרת נגישות",
    privacyLabel: "מדיניות פרטיות",
    termsLabel: "תקנון האתר",
    backLabel: "חזרה לאתר",
    updatedLabel: "עודכן לאחרונה",
    tocLabel: "תוכן העניינים",
    contactLabels: { phone: "טלפון", email: "דוא״ל", address: "כתובת" },
  },

  reviewForm: {
    open: "השאירו המלצה",
    title: "השאירו המלצה",
    note: "ההמלצה תפורסם באתר רק אחרי אישור המשרד.",
    close: "סגירה",
    labels: { name: "שם לפרסום", area: "תחום הטיפול", review: "ההמלצה", phone: "טלפון (לא יפורסם)" },
    hints: {
      name: "אפשר גם שם פרטי ואות ראשונה",
      review: "ספרו איך היה לעבוד עם המשרד. בלי פרטים מזהים או פרטים על התיק.",
      phone: "רשות. רק כדי שהמשרד יוכל לאמת את ההמלצה",
    },
    areaPlaceholder: "בחירה",
    consent: "אני מאשר/ת לפרסם את ההמלצה באתר בשם שכתבתי. ידוע לי שהמשרד רשאי לקצר אותה או לא לפרסם אותה.",
    submit: "שליחת ההמלצה",
    sending: "שולח...",
    errors: {
      name: "נא לכתוב שם לפרסום, בין 2 ל-40 תווים.",
      area: "נא לבחור את תחום הטיפול.",
      reviewShort: "ההמלצה קצרה מדי. נא לכתוב לפחות 40 תווים.",
      reviewLong: "ההמלצה ארוכה מדי. אפשר עד 600 תווים.",
      phone: "מספר הטלפון לא תקין. אפשר גם להשאיר את השדה ריק.",
      consent: "כדי לשלוח, נא לאשר את פרסום ההמלצה.",
      server: "השליחה לא הצליחה. מה שכתבתם נשאר בטופס, ואפשר לנסות שוב.",
    },
    serverFallback: "או לשלוח את ההמלצה בוואטסאפ",
    whatsappMessage: "שלום עו״ד שוקרון כהן, אני רוצה להשאיר המלצה:",
    doneTitle: "תודה רבה",
    doneBody: "ההמלצה התקבלה ותפורסם אחרי אישור המשרד.",
  },

  seo: {
    // From the approved prototype; the contract caps it at 155 characters.
    description: `${office.name}, ${office.title} ב${office.city}, ${office.yearsOfPractice} שנות ניסיון. דיני משפחה וירושה, מקרקעין ונדל״ן, נזיקין וביטוח, משפט אזרחי ומסחרי, גישור ושירותי נוטריון.`,
    ogImageAlt: `${office.name}, ${office.title} ב${office.city}`,
  },
} satisfies z.input<typeof Site>;
