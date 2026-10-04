import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 06: practice areas as stacked court files. */

const FILES = "#areas article[data-file]";
const AREAS = [
  { tab: "דיני משפחה וירושה", topic: "דיני משפחה וירושה", cta: "שאלה בנושא משפחה" },
  { tab: "מקרקעין ונדל״ן", topic: "מקרקעין ונדל״ן", cta: "שאלה בנושא נדל״ן" },
  { tab: "נזיקין וביטוח", topic: "נזיקין וביטוח", cta: "שאלה בנושא ביטוח" },
  { tab: "משפט אזרחי ומסחרי", topic: "משפט אזרחי ומסחרי", cta: "שאלה בנושא עסקי" },
  { tab: "נוטריון", topic: "שירותי נוטריון", cta: "תיאום אישור נוטריוני" },
];

/** Scroll so file `index` (in flow order) has just reached the stick line at 128px. */
async function arriveAt(page: Page, index: number) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.evaluate((i) => {
    const file = document.querySelectorAll("#areas article[data-file]")[i]!;
    window.scrollTo({ top: file.getBoundingClientRect().top + window.scrollY - 128, behavior: "instant" });
  }, index);
  await page.waitForTimeout(400);
}

const visibility = (page: Page) =>
  page.locator(FILES).evaluateAll((files) => files.map((f) => getComputedStyle(f).visibility));

const geometry = (page: Page) =>
  page.locator(FILES).evaluateAll((files) =>
    files.map((f) => {
      const [tab, body] = [f.children[0]!, f.children[1]!].map((el) => el.getBoundingClientRect());
      return { tab: { top: tab!.top, bottom: tab!.bottom, right: tab!.right }, body: { top: body!.top, left: body!.left, right: body!.right } };
    }),
  );

test("five files in order, each an article with an h3 and a content-driven service list", async ({ page }) => {
  await page.goto("/");
  const files = page.locator(FILES);
  await expect(files).toHaveCount(5);
  for (const [i, area] of AREAS.entries()) {
    const file = files.nth(i);
    await expect(file.locator("> div").first()).toHaveText(area.tab);
    await expect(file.getByRole("heading", { level: 3 })).toHaveCount(1);
    await expect(file.locator("ul > li")).not.toHaveCount(0);
  }
  await expect(files.first().locator("ul > li")).toHaveText([
    "גירושין וחלוקת רכוש",
    "מחלוקות בין בני משפחה",
    "צוואות, ירושות ועיזבונות",
    "צווי ירושה",
    "צווי הורות פסיקתיים",
    "העברות במתנה",
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

test("the stack folds to two tabs: previous at 84px, current at 128px, older files hidden", async ({ page }) => {
  await page.goto("/");
  await arriveAt(page, 3);

  const g = await geometry(page);
  expect(Math.round(g[2]!.tab.top)).toBe(84);
  expect(Math.round(g[3]!.tab.top)).toBe(128);
  const vis = await visibility(page);
  expect(vis.slice(0, 2)).toEqual(["hidden", "hidden"]);
  expect(vis.slice(2, 4)).toEqual(["visible", "visible"]);
  // Labels readable: both visible tabs are on top at their centre.
  for (const i of [2, 3]) {
    const box = (await page.locator(FILES).nth(i).locator("> div").first().boundingBox())!;
    const hit = await page.evaluate(
      ([x, y]) => document.elementFromPoint(x!, y!)?.textContent ?? "",
      [box.x + box.width / 2, box.y + box.height / 2],
    );
    expect(hit).toContain(AREAS[i]!.tab);
  }
  // Same left and right edges for every body (no scaling).
  const lefts = new Set(g.map((f) => Math.round(f.body.left)));
  const rights = new Set(g.map((f) => Math.round(f.body.right)));
  expect(lefts.size).toBe(1);
  expect(rights.size).toBe(1);
  // The covered file dims; the current one does not.
  const filters = await page.locator(FILES).evaluateAll((files) => files.map((f) => (f as HTMLElement).style.filter));
  expect(filters[2]).toMatch(/brightness\(0\.\d+\)/);
  expect(filters[3]).toBe("");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("no lift and no dimming; covered files are hidden under the current one", async ({ page }) => {
    await page.goto("/");
    await arriveAt(page, 3);
    const g = await geometry(page);
    expect(Math.round(g[3]!.tab.top)).toBe(128);
    expect((await visibility(page)).slice(0, 3)).toEqual(["hidden", "hidden", "hidden"]);
    const styles = await page.locator(FILES).evaluateAll((files) => files.map((f) => getComputedStyle(f)).map((c) => c.filter + c.transform));
    expect(styles.every((s) => s === "nonenone")).toBe(true);
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
  await arriveAt(page, 3);
  await page.screenshot({ path: `test-results/screens/areas-stack-${info.project.name}.png` });
});
