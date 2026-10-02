import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Minimal browser stand-ins: a manual rAF queue and a hideable document. */
function setupBrowser() {
  let queue = new Map<number, FrameRequestCallback>();
  let nextId = 1;
  const listeners = new Set<() => void>();
  const doc = {
    hidden: false,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
  };
  vi.stubGlobal("document", doc);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    queue.set(nextId, cb);
    return nextId++;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => queue.delete(id));
  return {
    pending: () => queue.size,
    flush(time = 16) {
      const current = queue;
      queue = new Map();
      current.forEach((cb) => cb(time));
    },
    setHidden(hidden: boolean) {
      doc.hidden = hidden;
      listeners.forEach((fn) => fn());
    },
  };
}

describe("scroll loop", () => {
  let browser: ReturnType<typeof setupBrowser>;
  let onFrame: typeof import("./scroll-loop").onFrame;

  beforeEach(async () => {
    vi.resetModules();
    browser = setupBrowser();
    ({ onFrame } = await import("./scroll-loop"));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shares one frame request between subscribers", () => {
    const a = vi.fn();
    const b = vi.fn();
    onFrame(a);
    onFrame(b);
    expect(browser.pending()).toBe(1);
    browser.flush(100);
    expect(a).toHaveBeenCalledWith(100);
    expect(b).toHaveBeenCalledWith(100);
    expect(browser.pending()).toBe(1);
  });

  it("stops when the last subscriber leaves", () => {
    const off = onFrame(vi.fn());
    off();
    expect(browser.pending()).toBe(0);
  });

  it("pauses while the tab is hidden and resumes when visible", () => {
    const cb = vi.fn();
    onFrame(cb);
    browser.setHidden(true);
    expect(browser.pending()).toBe(0);
    browser.setHidden(false);
    expect(browser.pending()).toBe(1);
    browser.flush();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
