import { describe, expect, it } from "vitest";
import { menuLinks } from "./navigation";

const links = [
  { label: "אודות", href: "#about" },
  { label: "המלצות", href: "#reviews" },
  { label: "שאלות נפוצות", href: "#faq" },
];

describe("menuLinks", () => {
  it("hides the reviews link while there are no reviews", () => {
    expect(menuLinks(links, false).map((l) => l.href)).toEqual(["#about", "#faq"]);
  });
  it("keeps it, in place, once reviews exist", () => {
    expect(menuLinks(links, true)).toEqual(links);
  });
});
