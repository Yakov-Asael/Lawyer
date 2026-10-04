"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { onFrame } from "@/lib/motion";

/**
 * Motion state for the whole page (spec 00).
 * Motion runs only when the visitor allows it: no prefers-reduced-motion and no "stop animations"
 * from the accessibility menu. When it runs, <html> gets the `motion` class, which is the only
 * thing that arms hidden initial states, so content is readable before JS and without motion.
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
};

const noop = () => {};

const MotionContext = createContext<MotionContextValue>({
  enabled: false,
  stilled: false,
  setStilled: noop,
  stopScroll: noop,
  startScroll: noop,
});

export const useMotion = () => useContext(MotionContext);

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

/** Same-page anchor links scroll through Lenis and still move focus, like native anchors. */
function scrollToAnchor(lenis: Lenis, event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  const hash = link?.getAttribute("href");
  if (!link || !hash) return;

  event.preventDefault();
  if (hash === "#") {
    lenis.scrollTo(0);
    return;
  }
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  lenis.scrollTo(target, { offset: -12 });
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.pushState(null, "", hash);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [stilled, setStilled] = useState(false);
  const enabled = !reduced && !stilled;
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("motion", enabled);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    lenisRef.current = lenis;
    const stopLoop = onFrame((time) => lenis.raf(time));
    const onClick = (e: MouseEvent) => scrollToAnchor(lenis, e);
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

  const value = useMemo(
    () => ({ enabled, stilled, setStilled, stopScroll, startScroll }),
    [enabled, stilled, stopScroll, startScroll],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
