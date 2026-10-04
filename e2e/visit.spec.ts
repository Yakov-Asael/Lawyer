import { expect, test } from "./fixtures";

/** Spec 11: visit. */

const SECTION = "#visit";
const QUERY = "הרברט סמואל 27 חדרה";

test("address, floor and hours from content; times are isolated LTR runs", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#visit-title")).toHaveText("איפה אנחנו");
  await expect(page.locator(SECTION)).toContainText("הרברט סמואל 27, חדרה");
  await expect(page.getByTestId("visit-access")).toContainText("קומה 1.");
  const hours = page.getByTestId("visit-hours");
  await expect(hours).toHaveText("קבלת קהל בתיאום מראש, חמישה ימים בשבוע בין 8:00 ל-18:00, ולפי הצורך גם מחוץ לשעות האלה.");
  await expect(hours.locator(".num")).toHaveText(["8:00", "18:00"]);
});

test("Waze and Maps open the office address in a new tab", async ({ page }) => {
  await page.goto("/");
  const waze = page.locator(SECTION).getByRole("link", { name: "ניווט למשרד ב-Waze" });
  const maps = page.locator(SECTION).getByRole("link", { name: "המשרד ב-Google Maps" });
  const wazeUrl = new URL((await waze.getAttribute("href"))!);
  const mapsUrl = new URL((await maps.getAttribute("href"))!);
  expect(wazeUrl.host).toBe("waze.com");
  expect(wazeUrl.searchParams.get("q")).toBe(QUERY);
  expect(mapsUrl.searchParams.get("query")).toBe(QUERY);
  for (const link of [waze, maps]) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
});

test("WhatsApp button uses the generic greeting", async ({ page }) => {
  await page.goto("/");
  const wa = page.locator(SECTION).getByRole("link", { name: "לתיאום פגישה בוואטסאפ" });
  expect(new URL((await wa.getAttribute("href"))!).searchParams.get("text")).toBe("שלום עו״ד שוקרון כהן, אשמח להתייעץ.");
});

test("static map: one labelled link to Google Maps, pin tip on the centre, nothing overlaid", async ({ page }) => {
  await page.goto("/");
  const map = page.locator(`${SECTION} [data-map]`);
  await expect(map).toHaveAttribute("aria-label", "מפת המיקום של המשרד, פתיחה ב-Google Maps");
  expect(new URL((await map.getAttribute("href"))!).searchParams.get("query")).toBe(QUERY);
  await map.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
  const g = await map.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const pin = el.querySelector("svg")!.getBoundingClientRect();
    return {
      dx: Math.abs(pin.left + pin.width / 2 - (box.left + box.width / 2)),
      tip: Math.abs(pin.bottom - (box.top + box.height / 2)),
      text: el.textContent?.trim() ?? "",
      children: el.children.length,
    };
  });
  expect(g.dx).toBeLessThanOrEqual(0.5);
  expect(g.tip).toBeLessThanOrEqual(1);
  expect(g.text).toBe("");
  expect(g.children).toBe(2); // streets + pin, no overlay card
  expect(await page.locator(`${SECTION} iframe`).count()).toBe(0);
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await page.locator(SECTION).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  await page.locator(SECTION).screenshot({ path: `test-results/screens/visit-${info.project.name}.png` });
});
