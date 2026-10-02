import { describe, expect, it } from "vitest";
import { mailLink, mapsLink, telLink, waLink, wazeLink, whatsappMessage } from "./contact-links";

const office = {
  whatsappE164: "972522521127",
  phoneE164: "+972522521127",
  email: "office@example.co.il",
  address: "הרברט סמואל 27",
  city: "חדרה",
};
const copy = {
  message: "שלום עו״ד שוקרון כהן, אשמח להתייעץ.",
  topicMessage: "שלום עו״ד שוקרון כהן, אשמח להתייעץ בנושא {topic}.",
};

const textOf = (url: string) => new URL(url).searchParams.get("text");

describe("whatsappMessage", () => {
  it("uses the plain greeting without a topic", () => {
    expect(whatsappMessage(copy)).toBe(copy.message);
  });
  it("inserts the topic", () => {
    expect(whatsappMessage(copy, "דיני משפחה")).toBe("שלום עו״ד שוקרון כהן, אשמח להתייעץ בנושא דיני משפחה.");
  });
  it("treats a blank topic as no topic", () => {
    expect(whatsappMessage(copy, "   ")).toBe(copy.message);
  });
});

describe("waLink", () => {
  it("targets wa.me with the number and no plus", () => {
    const url = new URL(waLink(office, copy));
    expect(url.origin + url.pathname).toBe("https://wa.me/972522521127");
  });
  it("round-trips the Hebrew greeting through the text param", () => {
    expect(textOf(waLink(office, copy))).toBe(copy.message);
    expect(textOf(waLink(office, copy, "מקרקעין וחוזים"))).toBe(
      "שלום עו״ד שוקרון כהן, אשמח להתייעץ בנושא מקרקעין וחוזים.",
    );
  });
  it("encodes characters that would break the query string", () => {
    const link = waLink(office, copy, "a&b=c?#");
    expect(link).not.toMatch(/[&#]b=/);
    expect(textOf(link)).toContain("a&b=c?#");
  });
});

describe("telLink", () => {
  it("uses E.164", () => {
    expect(telLink(office)).toBe("tel:+972522521127");
  });
});

describe("mailLink", () => {
  it("builds a mailto link", () => {
    expect(mailLink(office)).toBe("mailto:office@example.co.il");
  });
});

describe("wazeLink / mapsLink", () => {
  it("navigates Waze to the encoded address", () => {
    const url = new URL(wazeLink(office));
    expect(url.host).toBe("waze.com");
    expect(url.searchParams.get("q")).toBe("הרברט סמואל 27 חדרה");
    expect(url.searchParams.get("navigate")).toBe("yes");
  });
  it("searches Google Maps for the encoded address", () => {
    const url = new URL(mapsLink(office));
    expect(url.origin + url.pathname).toBe("https://www.google.com/maps/search/");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("query")).toBe("הרברט סמואל 27 חדרה");
  });
  it("matches the links approved in the prototype", () => {
    expect(wazeLink(office)).toBe(
      "https://waze.com/ul?q=%D7%94%D7%A8%D7%91%D7%A8%D7%98%20%D7%A1%D7%9E%D7%95%D7%90%D7%9C%2027%20%D7%97%D7%93%D7%A8%D7%94&navigate=yes",
    );
  });
});
