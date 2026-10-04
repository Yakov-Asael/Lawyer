"use client";

import { useEffect, useState, type RefObject } from "react";
import { observeOnce } from "@/lib/motion";
import { useMotion } from "./MotionProvider";

/**
 * True once the element has entered the viewport while motion runs.
 * Never true on the server or during hydration, so the markup carries no revealed state that hydration would undo.
 * With motion off the value does not matter: without html.motion nothing is hidden.
 */
export function useInViewOnce(ref: RefObject<Element | null>): boolean {
  const { enabled } = useMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || seen || !el) return;
    return observeOnce(el, () => setSeen(true));
  }, [enabled, seen, ref]);

  return seen;
}
