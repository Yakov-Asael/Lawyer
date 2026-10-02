"use client";

import { useEffect, useState, type RefObject } from "react";
import { observeOnce } from "@/lib/motion";
import { useMotion } from "./MotionProvider";

/** True once the element has entered the viewport. Always true when motion is off. */
export function useInViewOnce(ref: RefObject<Element | null>): boolean {
  const { enabled } = useMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || seen || !el) return;
    return observeOnce(el, () => setSeen(true));
  }, [enabled, seen, ref]);

  return seen || !enabled;
}
