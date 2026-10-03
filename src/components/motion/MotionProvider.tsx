"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { inPageHash } from "@/lib/in-page-hash";
import { onFrame } from "@/lib/motion";

/**
 * Motion state for the whole page (spec 00).
 * Motion runs only when the visitor allows it: no prefers-reduced-motion and no "stop animations"
 * from the accessibility menu. The `motion` class on <html> is the only thing that arms hidden initial states.
 * MotionBoot sets it before first paint; this provider keeps it in sync afterwards.
 */

type MotionContextValue = {
  /** True when reveals, scrubbing and smooth scroll may run. */
  enabled: boolean;
  /** "Stop animations" from the accessibility menu (spec 15). */
  stilled: boolean;
  setStilled: (stilled: boolean) => void;
  /** Freeze page scroll (open menus and dialogs) and release it again. */
  stopScroll: () => void;
  startScroll: () => void;
  /** Scroll to "#id" (smooth through Lenis when motion runs), move focus there and update the URL. */
  goToHash: (hash: string) => void;
};

const noop = () => {};

const MotionContext = createContext<MotionContextValue>({
  enabled: false,
  stilled: false,
  setStilled: noop,
  stopScroll: noop,
  startScroll: noop,
  goToHash: noop,
});

export const useMotion = () => useContext(MotionContext);

const subscribeNever = () => () => {};

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Server and hydration render as "reduced", so the first paint never hides content. */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => true,
  );
}

/** Scroll to an in-page target like a native anchor would, but through Lenis when it runs. */
function goToHash(hash: string, lenis: Lenis | null) {
  if (hash === "#") {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
    history.pushState(null, "", window.location.pathname + window.location.search);
    return;
  }
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  if (lenis) lenis.scrollTo(target, { offset: -12 });
  else target.scrollIntoView();
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.pushState(null, "", hash);
}

/** Same-page anchor links scroll through Lenis and still move focus, like native anchors. */
function handleAnchorClick(lenis: Lenis, event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
  const href = link?.getAttribute("href");
  if (!link || !href || link.target === "_blank") return;
  const hash = inPageHash(href, window.location);
  if (!hash) return;
  event.preventDefault();
  goToHash(hash, lenis);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [stilled, setStilled] = useState(false);
  const enabled = !reduced && !stilled;
  const lenisRef = useRef<Lenis | null>(null);

  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);

  // MotionBoot arms html.motion before first paint. From hydration on, React owns the class: it drops it when
  // motion gets switched off, and marks `motion-ready` so the no-JS failsafe in globals.css stands down.
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("motion", enabled);
    root.classList.toggle("motion-ready", enabled);
  }, [enabled, hydrated]);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    lenisRef.current = lenis;
    const stopLoop = onFrame((time) => lenis.raf(time));
    const onClick = (e: MouseEvent) => handleAnchorClick(lenis, e);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      stopLoop();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  const stopScroll = useCallback(() => lenisRef.current?.stop(), []);
  const startScroll = useCallback(() => lenisRef.current?.start(), []);
  const goTo = useCallback((hash: string) => goToHash(hash, lenisRef.current), []);

  const value = useMemo(
    () => ({ enabled, stilled, setStilled, stopScroll, startScroll, goToHash: goTo }),
    [enabled, stilled, stopScroll, startScroll, goTo],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
