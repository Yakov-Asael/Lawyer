import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 15: accessibility menu. */

const FAB = 'button[aria-label="תפריט נגישות"]';
const PANEL = '[role="dialog"][aria-label="נגישות"]';

async function openMenu(page: Page) {
  await page.locator(FAB).click();
  await expect(page.locator(PANEL)).toBeVisible();
}

const tile = (page: Page, name: string) => page.locator(PANEL).getByRole("button", { name, exact: true });
const htmlHas = (page: Page, cls: string) => page.evaluate((c) => document.documentElement.classList.contains(c), cls);

test("opens with focus on close; Esc closes and returns focus to the button", async ({ page }) => {
  await page.goto("/");
  await openMenu(page);
  await expect(page.locator(PANEL).getByRole("button", { name: "סגירת תפריט הנגישות" })).toBeFocused();
  await expect(page.locator(FAB)).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator(PANEL)).toBeHidden();
  await expect(page.locator(FAB)).toBeFocused();
});

test("a click outside closes it", async ({ page }) => {
  await page.goto("/");
  await openMenu(page);
  // The panel opens at the inline start (the right); click well clear of it, near the left edge.
  await page.mouse.click(8, 300);
  await expect(page.locator(PANEL)).toBeHidden();
});

test("every option visibly changes the page, and survives a reload", async ({ page }) => {
  await page.goto("/");
  const before = await page.evaluate(() => ({
    muted: getComputedStyle(document.documentElement).getPropertyValue("--muted").trim(),
    h2Font: getComputedStyle(document.querySelector("#faq-title")!).fontFamily,
  }));
  await openMenu(page);
  for (const name of ["ניגודיות גבוהה", "גווני אפור", "הדגשת קישורים", "גופן קריא", "עצירת אנימציות", "סמן גדול"]) {
    await tile(page, name).click();
    await expect(tile(page, name)).toHaveAttribute("aria-pressed", "true");
    await expect(tile(page, name)).toBeFocused(); // focus never lost
  }
  await page.locator(PANEL).getByRole("button", { name: "הגדלת טקסט" }).click();
  await expect(page.locator(`${PANEL} output`)).toHaveText("110%");

  const check = () =>
    page.evaluate(() => {
      const root = document.documentElement;
      const main = document.querySelector("main")!;
      return {
        muted: getComputedStyle(root).getPropertyValue("--muted").trim(),
        gray: getComputedStyle(main).filter,
        underline: getComputedStyle(document.querySelector("footer ul:last-of-type a")!).textDecorationLine,
        h2Font: getComputedStyle(document.querySelector("#faq-title")!).fontFamily,
        motion: root.classList.contains("motion"),
        cursor: getComputedStyle(document.body).cursor,
        zoom: getComputedStyle(main).zoom,
      };
    });

  const after = await check();
  expect(after.muted).not.toBe(before.muted);
  expect(after.gray).toContain("grayscale(1)");
  expect(after.underline).toContain("underline");
  expect(after.h2Font).not.toBe(before.h2Font);
  expect(after.h2Font).toMatch(/assistant/i);
  expect(after.motion).toBe(false);
  expect(after.cursor).toContain("url(");
  expect(after.zoom).toBe("1.1");

  await page.reload();
  const reloaded = await check();
  expect(reloaded).toEqual(after);
  await openMenu(page);
  await expect(tile(page, "ניגודיות גבוהה")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(`${PANEL} output`)).toHaveText("110%");
});

test("reset returns to defaults and clears storage", async ({ page }) => {
  await page.goto("/");
  await openMenu(page);
  await tile(page, "גווני אפור").click();
  await page.locator(PANEL).getByRole("button", { name: "הגדלת טקסט" }).click();
  await page.locator(PANEL).getByRole("button", { name: "איפוס הגדרות" }).click();
  await expect(tile(page, "גווני אפור")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(`${PANEL} output`)).toHaveText("100%");
  expect(await htmlHas(page, "a11y-gray")).toBe(false);
  expect(await page.evaluate(() => localStorage.getItem("shc-a11y"))).toBeNull();
});

test("fully keyboard operable", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow on desktop");
  await page.goto("/");
  await page.locator(FAB).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(PANEL).getByRole("button", { name: "סגירת תפריט הנגישות" })).toBeFocused();
  // Tab to the first option tile and toggle it with Space.
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    if (await tile(page, "ניגודיות גבוהה").evaluate((el) => el === document.activeElement)) break;
  }
  await page.keyboard.press("Space");
  await expect(tile(page, "ניגודיות גבוהה")).toHaveAttribute("aria-pressed", "true");
  expect(await htmlHas(page, "a11y-contrast")).toBe(true);
});

test.describe("first visit with stop animations already chosen", () => {
  test.use({ intro: true });
  test("content shows at once: no curtain, no motion", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("shc-a11y", JSON.stringify({ size: 0, on: ["still"] })));
    await page.goto("/");
    const state = await page.evaluate(() => ({
      curtain: getComputedStyle(document.querySelector(".curtain")!).display,
      motion: document.documentElement.classList.contains("motion"),
      still: document.documentElement.classList.contains("a11y-still"),
      h1: getComputedStyle(document.querySelector("h1 .hero-line > span")!).transform,
    }));
    expect(state).toEqual({ curtain: "none", motion: false, still: true, h1: "none" });
    await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  });
});

test("screenshots", async ({ page }, info) => {
  await page.goto("/");
  await openMenu(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `test-results/screens/a11y-${info.project.name}.png` });
});
