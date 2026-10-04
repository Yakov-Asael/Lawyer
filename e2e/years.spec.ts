import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 05: years of practice. */

const SECTION = "section[aria-labelledby=years-title]";

/** Scroll so the section's centre sits at `fraction` of the viewport height. */
async function placeCentre(page: Page, fraction: number) {
  await page.evaluate(
    ([sel, f]) => {
      const r = document.querySelector(sel as string)!.getBoundingClientRect();
      const centre = r.top + window.scrollY + r.height / 2;
      window.scrollTo({ top: centre - window.innerHeight * (f as number), behavior: "instant" });
    },
    [SECTION, fraction],
  );
  await page.waitForTimeout(300);
}

/** How much of the numeral is filled, 0..1, from the clip-path top inset. */
const filled = (page: Page) =>
  page.locator(`${SECTION} .years-fill`).evaluate((el) => {
    const clip = getComputedStyle(el).clipPath;
    if (clip === "none") return 1;
    const top = Number(/inset\(([\d.]+)%/.exec(clip)?.[1] ?? 0);
    return Math.round((1 - top / 100) * 100) / 100;
  });

test("numeral is decorative, LTR, from content; heading carries the fact", async ({ page }) => {
  await page.goto("/");
  const numeral = page.locator(`${SECTION} [aria-hidden=true][dir=ltr]`);
  await expect(numeral.locator(".years-outline")).toHaveText("23");
  await expect(page.locator("#years-title")).toHaveText("עשרים ושלוש שנה של ייעוץ וייצוג משפטי");
  await expect(page.locator(SECTION)).toMatchAriaSnapshot(`
    - heading "עשרים ושלוש שנה של ייעוץ וייצוג משפטי" [level=2]
    - paragraph: ניסיון מעשי בייעוץ, במשא ומתן, בגישור ובניהול הליכים בבתי המשפט, בתחומי המשפט האזרחי והמסחרי. עורך דין משנת 2003, נוטריון משנת 2015.
  `);
});

test("fills from bottom to top, full when the section centre reaches the viewport centre", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);

  // Section entirely below the fold: empty.
  await placeCentre(page, 1.6);
  expect(await filled(page)).toBe(0);

  // On the way in: partly filled.
  await placeCentre(page, 0.85);
  const part = await filled(page);
  expect(part).toBeGreaterThan(0);
  expect(part).toBeLessThan(1);

  // Centre at centre: full.
  await placeCentre(page, 0.5);
  await expect.poll(() => filled(page)).toBe(1);
});

test("the body states the licensing years; education lives in About, not here", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section[aria-labelledby=years-title]");
  await expect(section).toContainText("עורך דין משנת 2003, נוטריון משנת 2015.");
  await expect(section).not.toContainText("המכללה האקדמית נתניה");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("numeral is fully filled", async ({ page }) => {
    await page.goto("/");
    await placeCentre(page, 1.6);
    expect(await filled(page)).toBe(1);
  });
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await placeCentre(page, 0.75);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `test-results/screens/years-mid-${info.project.name}.png` });
  await placeCentre(page, 0.5);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test-results/screens/years-${info.project.name}.png` });
});
