import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 07: process steps. */

const SECTION = "section[aria-labelledby=process-title]";

const fill = (page: Page) =>
  page.locator(`${SECTION} .track-fill`).evaluate((el) => {
    const t = getComputedStyle(el).transform;
    if (t === "none") return 1;
    return Math.round(Number(/matrix\(([-\d.e]+)/.exec(t)?.[1] ?? 1) * 100) / 100;
  });

async function placeSteps(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const ol = document.querySelector("section[aria-labelledby=process-title] ol")!;
    const r = ol.getBoundingClientRect();
    window.scrollTo({ top: r.top + window.scrollY + r.height / 2 - window.innerHeight * f, behavior: "instant" });
  }, fraction);
  await page.waitForTimeout(300);
}

test("an ordered list of three steps from content", async ({ page }) => {
  await page.goto("/");
  const steps = page.locator(`${SECTION} ol > li`);
  await expect(steps).toHaveCount(3);
  await expect(steps.locator("h3")).toHaveText(["שולחים הודעה או מתקשרים", "נפגשים במשרד", "ליווי עד סוף הטיפול"]);
  await expect(steps.locator("[data-step-number]")).toHaveText(["1", "2", "3"]);
});

test("each circle is centred in its column (offset 0)", async ({ page }) => {
  await page.goto("/");
  await placeSteps(page, 0.5);
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
  const offsets = await page.locator(`${SECTION} ol > li`).evaluateAll((items) =>
    items.map((li) => {
      const col = li.getBoundingClientRect();
      const n = li.querySelector("[data-step-number]")!.getBoundingClientRect();
      return Math.abs(n.left + n.width / 2 - (col.left + col.width / 2));
    }),
  );
  for (const o of offsets) expect(o).toBeLessThanOrEqual(0.5);
});

test("desktop: the track runs exactly from the first circle centre to the last", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop only");
  await page.goto("/");
  await placeSteps(page, 0.5);
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
  const g = await page.evaluate(() => {
    const track = document.querySelector("section[aria-labelledby=process-title] [data-track]")!.getBoundingClientRect();
    const centres = [...document.querySelectorAll("section[aria-labelledby=process-title] [data-step-number]")].map((n) => {
      const r = n.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    return { track, centres };
  });
  const xs = g.centres.map((c) => c.x);
  expect(Math.abs(g.track.left - Math.min(...xs))).toBeLessThanOrEqual(0.5);
  expect(Math.abs(g.track.right - Math.max(...xs))).toBeLessThanOrEqual(0.5);
  // The track passes through the circle centres vertically too.
  expect(Math.abs(g.track.top + g.track.height / 2 - g.centres[0]!.y)).toBeLessThanOrEqual(1);
});

test("phones: steps stack and the track is hidden", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone only");
  await page.goto("/");
  await expect(page.locator(`${SECTION} [data-track]`)).toBeHidden();
  const xs = await page.locator(`${SECTION} ol > li`).evaluateAll((items) => items.map((li) => Math.round(li.getBoundingClientRect().left)));
  expect(new Set(xs).size).toBe(1);
});

test("desktop: the line fills from the first step to the last as you scroll", async ({ page, isMobile }) => {
  test.skip(isMobile, "the track is desktop only");
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await placeSteps(page, 1.5);
  expect(await fill(page)).toBe(0);
  await placeSteps(page, 0.75);
  const part = await fill(page);
  expect(part).toBeGreaterThan(0);
  expect(part).toBeLessThan(1);
  await placeSteps(page, 0.2);
  await expect.poll(() => fill(page)).toBe(1);
  // Grows from the inline start: the right edge in RTL.
  const origin = await page.locator(`${SECTION} .track-fill`).evaluate((el) => ({
    x: parseFloat(getComputedStyle(el).transformOrigin),
    width: (el as HTMLElement).offsetWidth,
  }));
  expect(Math.abs(origin.x - origin.width)).toBeLessThanOrEqual(1);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("track is fully drawn", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    await page.goto("/");
    await placeSteps(page, 1.5);
    expect(await fill(page)).toBe(1);
  });
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await page.evaluate(() => {
    const s = document.querySelector("section[aria-labelledby=process-title]")!;
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 40, behavior: "instant" });
  });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `test-results/screens/process-${info.project.name}.png` });
});
