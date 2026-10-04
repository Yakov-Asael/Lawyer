import { describe, expect, it } from "vitest";
import { faqJsonLd, publishedFaq } from "./faq";
import { splitNumbers } from "./numbers";

const items = [
  { question: "איך קובעים פגישה?", answer: "שולחים הודעה." },
  { question: "כמה עולה?", answer: "[placeholder: תשובה של יוסי]" },
  { question: "חסוי?", answer: "כן. [placeholder: לאישור נוסח]" },
];

describe("publishedFaq", () => {
  it("keeps every item on previews", () => {
    expect(publishedFaq(items, false)).toHaveLength(3);
  });
  it("drops unanswered or unapproved items in production", () => {
    expect(publishedFaq(items, true).map((i) => i.question)).toEqual(["איך קובעים פגישה?"]);
  });
});

describe("faqJsonLd", () => {
  it("mirrors the given items exactly", () => {
    const ld = faqJsonLd(items.slice(0, 1));
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toEqual([
      { "@type": "Question", name: "איך קובעים פגישה?", acceptedAnswer: { "@type": "Answer", text: "שולחים הודעה." } },
    ]);
  });
});

describe("splitNumbers", () => {
  it("isolates a phone number inside Hebrew text", () => {
    expect(splitNumbers("מתקשרים ל-052-252-1127. כמה משפטים")).toEqual([
      { text: "מתקשרים ל-", number: false },
      { text: "052-252-1127", number: true },
      { text: ". כמה משפטים", number: false },
    ]);
  });
  it("leaves text without digits whole", () => {
    expect(splitNumbers("בלי מספרים")).toEqual([{ text: "בלי מספרים", number: false }]);
  });
});
