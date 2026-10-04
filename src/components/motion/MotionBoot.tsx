import { MOTION_BOOT_SCRIPT } from "@/lib/motion";

/** Inline, render-blocking on purpose: it must run before first paint. Keep it first in <body>. */
export function MotionBoot() {
  return <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />;
}
