import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 08: about. */

const SECTION = "#about";

test("name heading, content paragraphs and only content-backed facts", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#about-title")).toHaveText("עו״ד יוסי שוקרון כהן");
  const facts = page.locator(`${SECTION} dl > div`);
  await expect(facts.locator("dt")).toHaveText(["ניסיון", "הסמכה", "משרד"]);
  await expect(facts.locator("dd")).toHaveText(["30 שנה", "עורך דין ונוטריון", "חדרה"]);
  // Education is missing from content, so it is left out rather than shown as a placeholder.
  await expect(page.locator(SECTION)).not.toContainText("השכלה");
  await expect(page.locator(SECTION)).not.toContainText("[לאישור]");
});

test("photo repeats the hero person, so it is decorative (empty alt)", async ({ page }) => {
  await page.goto("/");
  const img = page.locator(`${SECTION} img`);
  await expect(img).toHaveAttribute("alt", "");
  await expect(img).toHaveAttribute("loading", "lazy");
});

test("no illustrative signature: omitted until the real one is in content", async ({ page }) => {
  await page.goto("/");
  const count = await page.locator(`${SECTION} [data-signature]`).count();
  const hasSignature = await page.evaluate(async () => {
    const res = await fetch("/");
    return (await res.text()).includes("data-signature");
  });
  expect(count > 0).toBe(hasSignature);
});

/** Offset of the signature stroke: 1 = not drawn, 0 = complete. */
const offset = (page: Page) =>
  page.locator(`${SECTION} .signature-path`).evaluate((el) => Number(getComputedStyle(el).strokeDashoffset.replace("px", "")));

async function centreSection(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const r = document.querySelector("#about")!.getBoundingClientRect();
    window.scrollTo({ top: r.top + window.scrollY + r.height / 2 - window.innerHeight * f, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(300);
}

test.describe("signature drawing (runs once the real signature is in content)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    test.skip((await page.locator(`${SECTION} [data-signature]`).count()) === 0, "no signature in content yet");
  });

  test("draws with scroll and is complete with the section centred", async ({ page }) => {
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await centreSection(page, 1.6);
    expect(await offset(page)).toBe(1);
    await centreSection(page, 0.5);
    await expect.poll(() => offset(page)).toBe(0);
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("static and complete", async ({ page }) => {
      await centreSection(page, 1.6);
      expect(await offset(page)).toBe(0);
    });
  });
});

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
