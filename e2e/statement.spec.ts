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
    return words.filter((w) => w.classList.contains("is-lit")).length / words.length;
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
  // Read once lit: unlit words are muted by design.
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await placeParagraph(page, 0.1);
  await expect(hl.first()).toHaveClass(/is-lit/);
  await page.waitForTimeout(300); // the 0.25s colour transition
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
  test("every word in its full colour from the start", async ({ page }) => {
    await page.goto("/");
    await placeParagraph(page, 0.95);
    const colours = await page.locator(`${SECTION} p`).evaluate((p) => {
      const base = getComputedStyle(p).color;
      return [...p.querySelectorAll(".scrub-word:not(.text-brass-deep)")].map((w) => getComputedStyle(w).color === base);
    });
    expect(colours.length).toBeGreaterThan(0);
    expect(colours.every(Boolean)).toBe(true);
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

test("unlit words stay readable: at least 4.5:1 against the page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await placeParagraph(page, 0.95);
  const ratios = await page.locator(`${SECTION} .scrub-word:not(.is-lit)`).evaluateAll((words) => {
    const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })!;
    const rgb = (css: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r!, g!, b!];
    };
    const lum = (c: number[]) => {
      const [r, g, b] = c.map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
    };
    const bg = lum(rgb(getComputedStyle(document.body).backgroundColor));
    return words.map((w) => {
      const s = getComputedStyle(w);
      const fg = lum(rgb(s.color));
      return { ratio: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05), opacity: Number(s.opacity) };
    });
  });
  expect(ratios.length).toBeGreaterThan(0);
  for (const r of ratios) {
    expect(r.opacity).toBe(1);
    expect(r.ratio).toBeGreaterThanOrEqual(4.5);
  }
});
