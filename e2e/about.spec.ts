import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 08: about. */

const SECTION = "#about";

test("name heading, content paragraphs and only content-backed facts", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#about-title")).toHaveText("עו״ד יוסי שוקרון כהן");
  const facts = page.locator(`${SECTION} dl > div`);
  await expect(facts.locator("dt")).toHaveText(["ניסיון", "הסמכה", "משרד", "השכלה"]);
  await expect(facts.locator("dd")).toHaveText([
    "23 שנה",
    "עו״ד 2003 · נוטריון 2015",
    "חדרה",
    "משפטים ומנהל עסקים, המכללה האקדמית נתניה",
  ]);
  await expect(page.locator(SECTION)).not.toContainText("[לאישור]");
  // About is the one first-person section (owner decision).
  await expect(page.locator(SECTION)).toContainText("העיקרון שמנחה אותי");
});

test("photo repeats the hero person, so it is decorative (empty alt)", async ({ page }) => {
  await page.goto("/");
  const img = page.locator(`${SECTION} img`);
  await expect(img).toHaveAttribute("alt", "");
  await expect(img).toHaveAttribute("loading", "lazy");
});

test("no signature at all (owner decision)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(`${SECTION} svg path`)).toHaveCount(0);
});

async function centreSection(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const r = document.querySelector("#about")!.getBoundingClientRect();
    window.scrollTo({ top: r.top + window.scrollY + r.height / 2 - window.innerHeight * f, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(300);
}

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await centreSection(page, 0.5);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `test-results/screens/about-${info.project.name}.png` });
});

test("facts grid has no half-empty last row: a lone fact spans the row", async ({ page }) => {
  await page.goto("/");
  const widths = await page.locator(`${SECTION} dl`).evaluate((dl) => {
    const items = [...dl.children];
    return { dl: dl.getBoundingClientRect().width, last: items.at(-1)!.getBoundingClientRect().width, count: items.length };
  });
  if (widths.count % 2 === 1) expect(Math.abs(widths.last - widths.dl)).toBeLessThanOrEqual(1);
});
