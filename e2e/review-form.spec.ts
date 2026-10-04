import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

/** Spec 18: review submission (dialog on the home page, /review page, Netlify Forms post). */

const REVIEW = "המשרד ליווה אותי בסבלנות ובמקצועיות לאורך כל הדרך, תמיד זמין ותמיד ענייני.";

/** Stand in for Netlify Forms (the container has no Netlify). Returns the posted bodies. */
async function mockForms(page: Page, status = 200) {
  const posts: URLSearchParams[] = [];
  await page.route("**/__forms.html", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    posts.push(new URLSearchParams(route.request().postData() ?? ""));
    await new Promise((r) => setTimeout(r, 300)); // long enough to see "שולח..."
    await route.fulfill({ status, body: "" });
  });
  return posts;
}

async function openDialog(page: Page) {
  await page.goto("/");
  const opener = page.locator("#reviews").getByRole("button", { name: "השאירו המלצה" });
  await opener.scrollIntoViewIfNeeded();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "השאירו המלצה" });
  await expect(dialog).toBeVisible();
  return { opener, dialog };
}

async function fill(scope: ReturnType<Page["locator"]>, phone = "") {
  await scope.getByLabel("שם לפרסום").fill("דנה כ.");
  await scope.getByLabel("תחום הטיפול").selectOption("torts");
  await scope.getByLabel("ההמלצה", { exact: true }).fill(REVIEW);
  if (phone) await scope.getByLabel("טלפון (לא יפורסם)").fill(phone);
  await scope.getByLabel(/אני מאשר\/ת לפרסם/).check();
}

test("dialog: opens with focus on the first field; Esc and the backdrop close it and focus returns", async ({ page, isMobile }) => {
  const { opener, dialog } = await openDialog(page);
  await expect(dialog.getByLabel("שם לפרסום")).toBeFocused();
  await expect(dialog).toContainText("ההמלצה תפורסם באתר רק אחרי אישור המשרד.");
  // Phones: a bottom sheet flush with the bottom edge. 700px+: a centred panel, at most 560px.
  const sheet = await dialog.locator(".review-sheet").boundingBox();
  const vp = page.viewportSize()!;
  if (isMobile) {
    expect(Math.round(sheet!.y + sheet!.height)).toBe(vp.height);
    expect(Math.round(sheet!.width)).toBe(vp.width);
  } else {
    expect(sheet!.width).toBeLessThanOrEqual(560);
    expect(Math.abs(sheet!.x + sheet!.width / 2 - vp.width / 2)).toBeLessThan(2);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await opener.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5); // the scrim above the panel
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("empty submit: four field errors and the consent error, focus on the first invalid field", async ({ page }) => {
  const posts = await mockForms(page);
  const { dialog } = await openDialog(page);
  await dialog.getByRole("button", { name: "שליחת ההמלצה" }).click();
  for (const text of [
    "נא לכתוב שם לפרסום, בין 2 ל-40 תווים.",
    "נא לבחור את תחום הטיפול.",
    "ההמלצה קצרה מדי. נא לכתוב לפחות 40 תווים.",
    "כדי לשלוח, נא לאשר את פרסום ההמלצה.",
  ])
    await expect(dialog.getByText(text)).toBeVisible();
  const name = dialog.getByLabel("שם לפרסום");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAccessibleDescription(/נא לכתוב שם לפרסום/);
  await expect(dialog.locator('[aria-invalid="true"]')).toHaveCount(4);
  // Errors clear live once fixed.
  await name.fill("דנה כ.");
  await expect(name).not.toHaveAttribute("aria-invalid");
  // A malformed phone is the fifth possible field error; the phone stays optional.
  await dialog.getByLabel("טלפון (לא יפורסם)").fill("12345");
  await expect(dialog.getByText("מספר הטלפון לא תקין. אפשר גם להשאיר את השדה ריק.")).toBeVisible();
  expect(posts).toHaveLength(0);
});

test("valid submit posts to Netlify Forms and shows the thank-you; nothing appears on the site", async ({ page }) => {
  const posts = await mockForms(page);
  const { opener, dialog } = await openDialog(page);
  await expect(dialog.getByText("0 / 600")).toBeVisible();
  await fill(dialog, "+972 52 252 1127");
  await expect(dialog.getByText(`${[...REVIEW].length} / 600`)).toBeVisible();
  const submit = dialog.getByRole("button", { name: "שליחת ההמלצה" });
  await submit.click();
  await expect(dialog.getByRole("button", { name: "שולח..." })).toBeDisabled();
  await expect(dialog.getByRole("heading", { name: "תודה רבה" })).toBeVisible();
  await expect(dialog).toContainText("ההמלצה התקבלה ותפורסם אחרי אישור המשרד.");

  expect(posts).toHaveLength(1);
  const body = posts[0]!;
  expect(body.get("form-name")).toBe("review");
  expect(body.get("bot-field")).toBe("");
  expect(body.get("name")).toBe("דנה כ.");
  expect(body.get("area")).toBe("נזיקין וביטוח");
  expect(body.get("review")).toBe(REVIEW);
  expect(body.get("phone")).toBe("0522521127");
  expect(body.get("consent")).toMatch(/^אני מאשר\/ת/);

  await dialog.getByRole("button", { name: "סגירה" }).last().click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.locator("#reviews")).not.toContainText(REVIEW);
  // A sent form starts fresh next time.
  await opener.click();
  await expect(dialog.getByLabel("שם לפרסום")).toHaveValue("");
});

test("server error keeps the form filled and offers WhatsApp", async ({ page }) => {
  await mockForms(page, 500);
  const { dialog } = await openDialog(page);
  await fill(dialog);
  await dialog.getByRole("button", { name: "שליחת ההמלצה" }).click();
  const alert = dialog.getByRole("alert");
  await expect(alert).toContainText("השליחה לא הצליחה");
  await expect(dialog.getByLabel("ההמלצה", { exact: true })).toHaveValue(REVIEW);
  const wa = alert.getByRole("link", { name: "או לשלוח את ההמלצה בוואטסאפ" });
  const href = (await wa.getAttribute("href"))!;
  expect(href).toMatch(/^https:\/\/wa\.me\/972522521127\?text=/);
  expect(decodeURIComponent(href.split("text=")[1]!)).toContain(REVIEW);
  await expect(dialog.getByRole("button", { name: "שליחת ההמלצה" })).toBeEnabled();
});

test("honeypot: present for bots, hidden from people and assistive tech", async ({ page }) => {
  const { dialog } = await openDialog(page);
  const trap = dialog.locator('input[name="bot-field"]');
  await expect(trap).toHaveAttribute("tabindex", "-1");
  await expect(trap.locator("xpath=ancestor::*[@aria-hidden='true']")).toHaveCount(1);
  expect((await page.request.get("/__forms.html")).status()).toBe(200);
});

test("opener sits in the slider foot when there are reviews", async ({ page }) => {
  await page.goto("/dev/reviews");
  await expect(page.locator("#reviews").getByRole("button", { name: "השאירו המלצה" })).toBeVisible();
});

test.describe("/review page", () => {
  test("?area=torts preselects נזיקין וביטוח; unknown values are ignored", async ({ page }) => {
    await page.goto("/review?area=torts");
    await expect(page.locator("h1")).toHaveText("השאירו המלצה");
    const area = page.getByLabel("תחום הטיפול");
    await expect(area).toHaveValue("torts");
    await expect(area.locator("option:checked")).toHaveText("נזיקין וביטוח");
    await page.goto("/review?area=bogus");
    await expect(page.getByLabel("תחום הטיפול")).toHaveValue("");
  });

  test("phones: the contact dock steps aside while a field has focus", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the dock exists below 900px only");
    await page.goto("/review");
    const dock = page.getByRole("navigation", { name: "יצירת קשר מהירה" });
    await expect(dock).toHaveAttribute("data-shown", "");
    await page.getByLabel("שם לפרסום").focus();
    await expect(dock).not.toHaveAttribute("data-shown");
    await page.getByRole("checkbox").focus();
    await expect(dock).toHaveAttribute("data-shown", "");
  });

  test("kept out of search: noindex, not in the sitemap", async ({ page, request }) => {
    await page.goto("/review");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/review<");
  });

  test("keyboard only: fill, consent and submit; the thank-you takes focus", async ({ page }) => {
    const posts = await mockForms(page);
    await page.goto("/review?area=family");
    await page.getByLabel("שם לפרסום").focus();
    await page.keyboard.type("משה ל.");
    await page.keyboard.press("Tab"); // area (preselected)
    await expect(page.getByLabel("תחום הטיפול")).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.type(REVIEW);
    await page.keyboard.press("Tab"); // phone, optional
    await page.keyboard.press("Tab");
    await expect(page.getByRole("checkbox")).toBeFocused();
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "שליחת ההמלצה" })).toBeFocused();
    await page.keyboard.press("Enter");
    const heading = page.getByRole("heading", { name: "תודה רבה", level: 2 });
    await expect(heading).toBeVisible();
    await expect(heading.locator("xpath=..")).toBeFocused();
    expect(posts[0]!.get("area")).toBe("דיני משפחה ומעמד אישי");
    await expect(page.getByRole("link", { name: "חזרה לאתר" }).last()).toHaveAttribute("href", "/");
  });

  test("errors and hints pass 4.5:1 contrast; no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" || /hydrat/i.test(m.text())) errors.push(m.text());
    });
    await page.goto("/review", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "שליחת ההמלצה" }).click();
    const low = await page.evaluate(() => {
      const ctx = Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", {
        willReadFrequently: true,
      })!;
      const rgba = (css: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return { r: r!, g: g!, b: b!, a: a! / 255 };
      };
      const bgOf = (el: Element) => {
        for (let n: Element | null = el; n; n = n.parentElement) {
          const c = rgba(getComputedStyle(n).backgroundColor);
          if (c.a > 0.99) return c;
        }
        return rgba(getComputedStyle(document.body).backgroundColor);
      };
      const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
        const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      return [...document.querySelectorAll("main form :is(label, p, span)")]
        .filter((el) => el.checkVisibility() && el.textContent?.trim() && !el.closest("[aria-hidden]"))
        .map((el) => {
          const fg = lum(rgba(getComputedStyle(el).color));
          const bg = lum(bgOf(el));
          return { text: el.textContent!.trim().slice(0, 30), ratio: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) };
        })
        .filter((r) => r.ratio < 4.5);
    });
    expect(low).toEqual([]);
    expect(errors).toEqual([]);
  });
});

test("screenshots", async ({ page }, info) => {
  await mockForms(page);
  const { dialog } = await openDialog(page);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `test-results/screens/review-dialog-${info.project.name}.png` });
  await dialog.getByRole("button", { name: "שליחת ההמלצה" }).click();
  await page.screenshot({ path: `test-results/screens/review-dialog-errors-${info.project.name}.png` });
  await page.goto("/review?area=notary");
  await page.screenshot({ path: `test-results/screens/review-page-${info.project.name}.png`, fullPage: true });
});
