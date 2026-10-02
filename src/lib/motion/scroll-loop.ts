/**
 * The single requestAnimationFrame loop for the whole page (spec 00).
 * Lenis and every scroll-driven effect subscribe here instead of running their own loops.
 * The loop runs only while it has subscribers and pauses while the tab is hidden.
 */

export type FrameCallback = (time: number) => void;

const subscribers = new Set<FrameCallback>();
let frameId = 0;
let listening = false;

function tick(time: number) {
  frameId = 0;
  subscribers.forEach((cb) => cb(time));
  schedule();
}

function schedule() {
  if (frameId !== 0 || subscribers.size === 0 || document.hidden) return;
  frameId = requestAnimationFrame(tick);
}

function cancel() {
  if (frameId === 0) return;
  cancelAnimationFrame(frameId);
  frameId = 0;
}

function onVisibilityChange() {
  if (document.hidden) cancel();
  else schedule();
}

/** Run `cb` on every frame until the returned function is called. */
export function onFrame(cb: FrameCallback): () => void {
  if (!listening) {
    document.addEventListener("visibilitychange", onVisibilityChange);
    listening = true;
  }
  subscribers.add(cb);
  schedule();
  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0) cancel();
  };
}
