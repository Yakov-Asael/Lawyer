import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 04: statement with scroll-lit words. */

const SECTION = 'section[aria-label="גישה אישית"]';
const TEXT =
  "כשמשפחה, נכס, כסף או זכות שלכם עומדים על הפרק, חשוב לדעת שיש לצידכם עורך דין שרואה את התמונה המלאה, מקשיב, ובונה יחד אתכם את הדרך הנכונה לפעול.";

/** Scroll so the paragraph's top sits at `fraction` of the viewport height, then let the frame loop catch up. */
async function placeParagraph(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const p = document.querySelector('section[aria-label="גישה אישית"] p')!;
    const top = p.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - window.innerHeight * f, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(400);
}

const litRatio = (page: Page) =>
  page.evaluate(() => {
    const words = [...document.querySelectorAll(".scrub-word")];
    return words.filter((w) => Number(getComputedStyle(w).opacity) > 0.9).length / words.length;
  });

test("words light up with reading progress, all lit before the paragraph leaves the upper half", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);

  await placeParagraph(page, 0.95);
  expect(await litRatio(page)).toBe(0);

  const height = await page.locator(`${SECTION} p`).evaluate((p) => p.getBoundingClientRect().height);
  const vh = page.viewportSize()!.height;
  // Halfway through the window: top = 0.82vh - (h + 0.25vh) / 2
  await placeParagraph(page, 0.82 - (height / vh + 0.25) / 2);
  const mid = await litRatio(page);
  expect(mid).toBeGreaterThan(0.3);
  expect(mid).toBeLessThan(0.7);

  // End of the window: the paragraph's bottom at 57% of the viewport, fully in view.
  await placeParagraph(page, 0.57 - height / vh - 0.01);
  await expect.poll(() => litRatio(page)).toBe(1);
  const box = (await page.locator(`${SECTION} p`).boundingBox())!;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(vh);
});

test("highlight is exactly the content phrase, in brass-deep", async ({ page }) => {
  await page.goto("/");
  const hl = page.locator(`${SECTION} .scrub-word.text-brass-deep`);
  expect((await hl.allTextContents()).join(" ")).toBe("חשוב לדעת");
  const [color, expected] = await hl.first().evaluate((el) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--brass-deep)";
    document.body.append(probe);
    const want = getComputedStyle(probe).color;
    probe.remove();
    return [getComputedStyle(el).color, want];
  });
  expect(color).toBe(expected);
});

test("assistive tech gets the sentence as one text, not word by word", async ({ page }) => {
  await page.goto("/");
  const p = page.locator(`${SECTION} p`);
  await expect(p).toMatchAriaSnapshot(`- paragraph: "${TEXT}"`);
  await expect(p.locator('[aria-hidden="true"]')).toHaveCount(1);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("all words at full opacity", async ({ page }) => {
    await page.goto("/");
    await placeParagraph(page, 0.95);
    expect(await litRatio(page)).toBe(1);
  });
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  const vh = page.viewportSize()!.height;
  const height = await page.locator(`${SECTION} p`).evaluate((p) => p.getBoundingClientRect().height);
  await placeParagraph(page, 0.82 - (height / vh + 0.25) / 2);
  await page.screenshot({ path: `test-results/screens/statement-mid-${info.project.name}.png` });
  await placeParagraph(page, 0.57 - height / vh - 0.01);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `test-results/screens/statement-${info.project.name}.png` });
});
