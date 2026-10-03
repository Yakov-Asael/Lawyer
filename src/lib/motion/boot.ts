/**
 * Runs inline in <body>, before first paint (see MotionBoot). It decides two things the server cannot:
 * - `motion`: arm the hidden start states now, so above-the-fold content never shows, vanishes and re-animates
 *   at hydration. Skipped under prefers-reduced-motion. Without JS this never runs, so content stays visible.
 * - `intro`: play the intro curtain (spec 03) only on the first page load of the session.
 *
 * It must stay self-contained (no imports, no closures): it is serialized with Function.prototype.toString.
 * With "stop animations" (spec 15) it is called as reduced: no motion, no curtain.
 */
export function motionBoot(root: HTMLElement, storage: Pick<Storage, "getItem" | "setItem"> | null, reduced: boolean) {
  const KEY = "shc-intro-seen";
  let seen = true;
  try {
    seen = storage?.getItem(KEY) === "1";
    storage?.setItem(KEY, "1");
  } catch {
    // Storage blocked (private mode, policies): treat as seen, never replay on every page.
  }
  if (reduced) return;
  root.classList.add("motion");
  root.classList.add(seen ? "intro-seen" : "intro");
}

/**
 * Applies the saved accessibility-menu choices (spec 15) before first paint, so a returning visitor never sees a
 * flash of the default page. Returns true when "stop animations" is on. Self-contained like motionBoot; its parsing
 * mirrors parseA11y in src/lib/a11y.ts (kept in step by a parity test).
 */
export function a11yBoot(root: HTMLElement, storage: Pick<Storage, "getItem"> | null): boolean {
  const OPTIONS = ["contrast", "gray", "links", "font", "still", "cursor"];
  const SIZES = [1, 1.1, 1.2, 1.35];
  let size = 0;
  let on: string[] = [];
  try {
    const data = JSON.parse(storage?.getItem("shc-a11y") || "null");
    if (data && Number.isInteger(data.size)) size = Math.min(SIZES.length - 1, Math.max(0, data.size));
    if (data && Array.isArray(data.on)) on = OPTIONS.filter((o) => data.on.includes(o));
  } catch {
    // Malformed or blocked storage: defaults.
  }
  on.forEach((o) => root.classList.add("a11y-" + o));
  if (size > 0) root.style.setProperty("--a11y-zoom", String(SIZES[size]));
  return on.includes("still");
}

/** The inline script source: accessibility choices first, then motion (stopped animations count as reduced). */
export const MOTION_BOOT_SCRIPT = `(function(){var root=document.documentElement;var local=null,session=null;try{local=window.localStorage}catch(e){}try{session=window.sessionStorage}catch(e){}var still=(${a11yBoot.toString()})(root,local);(${motionBoot.toString()})(root,session,still||window.matchMedia("(prefers-reduced-motion: reduce)").matches);})();`;
