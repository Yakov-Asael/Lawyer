// Renders the brand rasters from /dev/brand (spec 16) with the site's real fonts and tokens.
// Usage: ENABLE_DEV_PREVIEWS=1 pnpm dev --port 3100   then   pnpm brand-assets
// Writes public/og.png (1200x630), src/app/icon.png (512), src/app/apple-icon.png (180), src/app/favicon.ico (48).
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";

/** A one-image .ico wrapping a PNG (valid since Windows Vista; read by every current browser). */
function pngIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // image offset
  return Buffer.concat([header, png]);
}

const base = process.env.BASE_URL ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });

async function shoot(selector, file, scale) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1400 }, deviceScaleFactor: scale });
  await page.goto(`${base}/dev/brand`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(selector).screenshot({ path: file, animations: "disabled" });
  await page.close();
}

await shoot('[data-asset="og"]', "public/og.png", 1);
await shoot('[data-asset="icon"]', "src/app/icon.png", 1);
await shoot('[data-asset="icon"]', "src/app/apple-icon.png", 180 / 512);
const tmp = join(mkdtempSync(join(tmpdir(), "brand-")), "icon-48.png");
await shoot('[data-asset="icon"]', tmp, 48 / 512);
// Next's .ico decoder needs an RGBA PNG; Chromium writes opaque shots as RGB.
const rgba = tmp.replace(".png", "-rgba.png");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-pix_fmt", "rgba", rgba]);
writeFileSync("src/app/favicon.ico", pngIco(readFileSync(rgba), 48));
await browser.close();
console.log("Brand assets written.");
