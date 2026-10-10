import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 09: reviews. The live page shows the approved reviews; /dev/reviews renders sample data and the empty state. */

const REGION = '[role="region"][aria-label="המלצות לקוחות"]';

test.describe("live page", () => {
  test("shows the approved reviews in the slider", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#reviews");
    await expect(section.locator("#reviews-title")).toHaveText("מה אומרים לקוחות.");
    await expect(page.locator(REGION)).toHaveCount(1);
    await expect(page.locator(REGION)).toContainText("דליה אריאלי");
  });

  test("menu links to the reviews", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the reviews link lives in the mobile menu");
    await page.goto("/");
    await page.getByRole("button", { name: "פתיחת תפריט" }).click();
    const dialog = page.getByRole("dialog", { name: "תפריט" });
    await expect(dialog.getByRole("link", { name: "המלצות" })).toHaveAttribute("href", "#reviews");
  });
});

test("no reviews: compact invitation instead of the slider", async ({ page }) => {
  await page.goto("/dev/reviews?empty=1");
  const section = page.locator("#reviews");
  await expect(section).toContainText("היו הראשונים לשתף איך היה לעבוד איתנו.");
  await expect(page.locator(REGION)).toHaveCount(0);
});

/** Index (1-based, from aria-label "n / 6") of the slides fully inside the viewport, in visual order right to left. */
const visibleSlides = (page: Page) =>
  page.locator(`${REGION} [role=group]`).evaluateAll((slides) => {
    const vw = window.innerWidth;
    return slides
      .map((s) => ({ n: Number(s.getAttribute("aria-label")!.split(" / ")[0]), r: s.getBoundingClientRect() }))
      .filter(({ r }) => r.left >= -1 && r.right <= vw + 1)
      .sort((a, b) => b.r.right - a.r.right)
      .map(({ n }) => n);
  });

test.describe("slider (sample data)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dev/reviews");
    await expect(page.locator(REGION)).toBeVisible();
  });

  test("each real review once, no clones; carousel semantics", async ({ page }) => {
    await expect(page.locator(REGION)).toHaveAttribute("aria-roledescription", "קרוסלה");
    await expect(page.locator(`${REGION} [role=group]`)).toHaveCount(6);
    await expect(page.locator(`${REGION} [aria-hidden=true] blockquote`)).toHaveCount(0);
  });

  test("desktop: three cards; 8 forward and 8 back cycle with no dead end", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    const next = page.getByRole("button", { name: "ההמלצות הבאות" });
    const prev = page.getByRole("button", { name: "ההמלצות הקודמות" });
    await expect.poll(() => visibleSlides(page).then((s) => s.length)).toBe(3);
    const start = await visibleSlides(page);
    expect(start[0]).toBe(1);

    const seen = new Set<number>();
    for (let i = 0; i < 8; i++) {
      await expect(next).toBeEnabled();
      await next.click();
      await page.waitForTimeout(450);
      const v = await visibleSlides(page);
      expect(v).toHaveLength(3);
      v.forEach((n) => seen.add(n));
    }
    expect(seen.size).toBe(6); // every review came round
    // 8 steps forward on 6 slides lands two past the start.
    expect((await visibleSlides(page))[0]).toBe(((start[0]! - 1 + 8) % 6) + 1);

    for (let i = 0; i < 8; i++) {
      await expect(prev).toBeEnabled();
      await prev.click();
      await page.waitForTimeout(450);
      expect(await visibleSlides(page)).toHaveLength(3);
    }
    expect(await visibleSlides(page)).toEqual(start);
  });

  test("desktop: next arrow points left (RTL)", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    const [prevX, nextX] = await Promise.all(
      ["ההמלצות הקודמות", "ההמלצות הבאות"].map(async (name) => (await page.getByRole("button", { name }).boundingBox())!.x),
    );
    expect(nextX).toBeLessThan(prevX!);
  });

  test("phone: no arrows, endless swipe, peeks on both sides", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone only");
    await expect(page.locator(`${REGION} [data-arrows]`)).toBeHidden();
    const viewport = (await page.locator(`${REGION} > div`).first().boundingBox())!;
    const y = viewport.y + viewport.height / 2;

    const centred = () =>
      page.locator(`${REGION} [role=group]`).evaluateAll((slides) => {
        const mid = window.innerWidth / 2;
        const hit = slides.find((s) => {
          const r = s.getBoundingClientRect();
          return r.left < mid && r.right > mid;
        });
        return Number(hit?.getAttribute("aria-label")?.split(" / ")[0]);
      });

    const order: number[] = [await centred()];
    for (let i = 0; i < 7; i++) {
      // Swipe towards the right: in RTL that brings the next card in from the left.
      await page.mouse.move(viewport.x + 60, y);
      await page.mouse.down();
      await page.mouse.move(viewport.x + 300, y, { steps: 8 });
      await page.mouse.up();
      await page.waitForTimeout(600);
      order.push(await centred());
    }
    expect(new Set(order).size).toBe(6);
    expect(order.at(-1)).toBe(order[1]); // wrapped round: 7 swipes on 6 cards

    const peeks = await page.locator(`${REGION} [role=group]`).evaluateAll((slides) => {
      const vw = window.innerWidth;
      return {
        left: slides.some((s) => { const r = s.getBoundingClientRect(); return r.right > 0 && r.right < vw * 0.3; }),
        right: slides.some((s) => { const r = s.getBoundingClientRect(); return r.left < vw && r.left > vw * 0.7; }),
      };
    });
    expect(peeks).toEqual({ left: true, right: true });
  });

  test("read more only on clamped quotes; opens the full review in a reader dialog", async ({ page }) => {
    const cards = page.locator(`${REGION} figure`);
    const long = cards.nth(0);
    await expect(cards.nth(1).getByRole("button")).toHaveCount(0);
    const heights = () => cards.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
    const before = await heights();

    const more = long.getByRole("button", { name: "קראו עוד" });
    await expect(more).toHaveAttribute("aria-haspopup", "dialog");
    await more.click();
    const reader = page.getByRole("dialog", { name: "המלצה" });
    await expect(reader).toBeVisible();
    await expect(reader.locator("blockquote")).toHaveText((await long.locator("blockquote").textContent())!);
    await expect(reader.locator("figcaption")).toContainText((await long.locator("figcaption").textContent())!.slice(0, 8));
    await expect(reader.getByRole("button", { name: "סגירה" })).toBeFocused();
    // Cards never change height, so the carousel row stays even.
    expect(await heights()).toEqual(before);

    await page.keyboard.press("Escape");
    await expect(reader).toBeHidden();
    await expect(more).toBeFocused();
  });

  test("desktop: arrows sit on both sides of the cards, vertically centred on them", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    const track = (await page.locator(`${REGION} [role=group]`).first().boundingBox())!;
    const cards = await page.locator(`${REGION} figure`).evaluateAll((els) => {
      const rs = els.map((e) => e.getBoundingClientRect()).filter((r) => r.left >= 0 && r.right <= window.innerWidth);
      return { left: Math.min(...rs.map((r) => r.left)), right: Math.max(...rs.map((r) => r.right)) };
    });
    const prev = (await page.getByRole("button", { name: "ההמלצות הקודמות" }).boundingBox())!;
    const next = (await page.getByRole("button", { name: "ההמלצות הבאות" }).boundingBox())!;
    expect(prev.x).toBeGreaterThanOrEqual(cards.right); // previous: right side (RTL)
    expect(next.x + next.width).toBeLessThanOrEqual(cards.left);
    const mid = track.y + track.height / 2;
    for (const b of [prev, next]) expect(Math.abs(b.y + b.height / 2 - mid)).toBeLessThan(track.height * 0.1);
  });

  test("screenshots", async ({ page }, info) => {
    await page.waitForTimeout(800);
    await page.screenshot({ path: `test-results/screens/reviews-${info.project.name}.png`, fullPage: true });
  });
});

test("screenshot of the empty state", async ({ page }, info) => {
  await page.goto("/");
  await page.locator("#reviews").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.locator("#reviews").screenshot({ path: `test-results/screens/reviews-empty-${info.project.name}.png` });
});
