import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 06: practice areas as stacked court files. */

const FILES = "#areas article[data-file]";
const AREAS = [
  { tab: "דיני משפחה ומעמד אישי", topic: "דיני משפחה", cta: "שאלה בנושא משפחה" },
  { tab: "נזיקין וביטוח", topic: "נזיקין וביטוח", cta: "שאלה בנושא נזיקין" },
  { tab: "מקרקעין, נדל״ן וחוזים", topic: "מקרקעין וחוזים", cta: "שאלה בנושא נדל״ן" },
  { tab: "נוטריון", topic: "שירותי נוטריון", cta: "תיאום אישור נוטריוני" },
];

const geometry = (page: Page) =>
  page.locator(FILES).evaluateAll((files) =>
    files.map((f) => {
      const [tab, body] = [f.children[0]!, f.children[1]!].map((el) => el.getBoundingClientRect());
      return { tab: { top: tab!.top, bottom: tab!.bottom, right: tab!.right }, body: { top: body!.top, left: body!.left, right: body!.right } };
    }),
  );

test("four files in order, each an article with an h3 and a content-driven service list", async ({ page }) => {
  await page.goto("/");
  const files = page.locator(FILES);
  await expect(files).toHaveCount(4);
  for (const [i, area] of AREAS.entries()) {
    const file = files.nth(i);
    await expect(file.locator("> div").first()).toHaveText(area.tab);
    await expect(file.getByRole("heading", { level: 3 })).toHaveCount(1);
    await expect(file.locator("ul > li")).not.toHaveCount(0);
  }
  await expect(files.first().locator("ul > li")).toHaveText([
    "גירושין והסכמי גירושין",
    "משמורת והסדרי שהות",
    "מזונות",
    "הסכמי ממון וידועים בציבור",
    "ירושות וצוואות",
  ]);
});

test("each CTA opens WhatsApp with its own topic", async ({ page }) => {
  await page.goto("/");
  for (const [i, area] of AREAS.entries()) {
    const cta = page.locator(FILES).nth(i).getByRole("link", { name: area.cta });
    const url = new URL((await cta.getAttribute("href"))!);
    expect(url.origin + url.pathname).toBe("https://wa.me/972522521127");
    expect(url.searchParams.get("text")).toBe(`שלום עו״ד שוקרון כהן, אשמח להתייעץ בנושא ${area.topic}.`);
    await expect(cta).toHaveAttribute("target", "_blank");
  }
});

test("tab and body touch with no gap; tab edge flush with the body's start edge", async ({ page }) => {
  await page.goto("/");
  for (const g of await geometry(page)) {
    expect(Math.abs(g.body.top - g.tab.bottom)).toBeLessThanOrEqual(1); // 1px overlap by design (-1px margin)
    expect(g.body.top).toBeLessThanOrEqual(g.tab.bottom);
    expect(Math.abs(g.tab.right - g.body.right)).toBeLessThanOrEqual(0.5); // RTL: start edge is the right edge
  }
});

test("scrolling stacks all four tabs 44px apart, labels readable, bodies aligned", async ({ page }) => {
  await page.goto("/");
  // Scroll until the last file is pinned.
  await page.evaluate(() => {
    const last = document.querySelectorAll("#areas article[data-file]")[3]!;
    const top = last.getBoundingClientRect().top + window.scrollY;
    // The last file is the end of the stack: it arrives at its slot rather than sticking there.
    window.scrollTo({ top: top - (84 + 3 * 44), behavior: "instant" });
  });
  await page.waitForTimeout(400);

  const g = await geometry(page);
  for (let i = 0; i < 4; i++) expect(Math.round(g[i]!.tab.top)).toBe(84 + i * 44);
  // Labels readable: each tab fully visible, not covered by the next file's body.
  for (const [i, area] of AREAS.entries()) {
    const tab = page.locator(FILES).nth(i).locator("> div").first();
    const box = (await tab.boundingBox())!;
    const hit = await page.evaluate(
      ([x, y]) => document.elementFromPoint(x!, y!)?.textContent ?? "",
      [box.x + box.width / 2, box.y + box.height / 2],
    );
    expect(hit).toContain(area.tab);
  }
  // Same left and right edges for every body.
  const lefts = new Set(g.map((f) => Math.round(f.body.left)));
  const rights = new Set(g.map((f) => Math.round(f.body.right)));
  expect(lefts.size).toBe(1);
  expect(rights.size).toBe(1);

  // Covered files dim; the top one does not.
  const filters = await page.locator(FILES).evaluateAll((files) => files.map((f) => (f as HTMLElement).style.filter));
  expect(filters[0]).toMatch(/brightness\(0\.\d+\)/);
  expect(filters[3]).toBe("");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("stacking stays, dimming is off", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const last = document.querySelectorAll("#areas article[data-file]")[3]!;
      window.scrollTo({ top: last.getBoundingClientRect().top + window.scrollY - 200, behavior: "instant" });
    });
    await page.waitForTimeout(300);
    const g = await geometry(page);
    expect(Math.round(g[0]!.tab.top)).toBe(84);
    const filters = await page.locator(FILES).evaluateAll((files) => files.map((f) => getComputedStyle(f).filter));
    expect(filters.every((f) => f === "none")).toBe(true);
  });
});

test("text on every file meets 4.5:1", async ({ page }) => {
  await page.goto("/");
  const ratios = await page.locator(FILES).evaluateAll((files) => {
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
    return files.flatMap((f) => {
      const body = f.children[1]!;
      const bg = lum(rgb(getComputedStyle(body).backgroundColor));
      return [...body.querySelectorAll("h3, p, li")].map((el) => {
        const fg = lum(rgb(getComputedStyle(el).color));
        return { text: el.textContent!.slice(0, 20), ratio: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) };
      });
    });
  });
  for (const r of ratios) expect(r.ratio, r.text).toBeGreaterThanOrEqual(4.5);
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await page.locator("#areas").scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const s = document.querySelector("#areas")!;
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `test-results/screens/areas-head-${info.project.name}.png` });
  await page.evaluate(() => {
    const last = document.querySelectorAll("#areas article[data-file]")[3]!;
    window.scrollTo({ top: last.getBoundingClientRect().top + window.scrollY - (84 + 3 * 44), behavior: "instant" });
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `test-results/screens/areas-stack-${info.project.name}.png` });
});
