/**
 * Runs inline in <body>, before first paint (see MotionBoot). It decides two things the server cannot:
 * - `motion`: arm the hidden start states now, so above-the-fold content never shows, vanishes and re-animates
 *   at hydration. Skipped under prefers-reduced-motion. Without JS this never runs, so content stays visible.
 * - `intro`: play the intro curtain (spec 03) only on the first page load of the session.
 *
 * It must stay self-contained (no imports, no closures): it is serialized with Function.prototype.toString.
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

/** The inline script source. */
export const MOTION_BOOT_SCRIPT = `(${motionBoot.toString()})(document.documentElement,(function(){try{return window.sessionStorage}catch(e){return null}})(),window.matchMedia("(prefers-reduced-motion: reduce)").matches);`;
