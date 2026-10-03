import { describe, expect, it } from "vitest";
import { inPageHash } from "./in-page-hash";

const at = (href: string) => new URL(href);

describe("inPageHash", () => {
  const home = at("https://example.co.il/");
  it("accepts plain hash links", () => {
    expect(inPageHash("#faq", home)).toBe("#faq");
  });
  it("accepts /#hash when it targets the current page", () => {
    expect(inPageHash("/#faq", home)).toBe("#faq");
  });
  it("leaves links to other pages to the browser", () => {
    expect(inPageHash("/#faq", at("https://example.co.il/terms"))).toBeNull();
    expect(inPageHash("/terms", home)).toBeNull();
    expect(inPageHash("https://wa.me/972522521127", home)).toBeNull();
  });
});
