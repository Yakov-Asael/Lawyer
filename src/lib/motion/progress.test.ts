import { describe, expect, it } from "vitest";
import { clamp01, remap, viewportProgress } from "./progress";

describe("clamp01", () => {
  it("clamps to the unit range", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(3)).toBe(1);
  });
});

describe("viewportProgress", () => {
  const vh = 800;
  it("is 0 when the element sits just below the viewport", () => {
    expect(viewportProgress({ top: 800, height: 400 }, vh)).toBe(0);
  });
  it("is 0.5 when the element is centered in its travel", () => {
    expect(viewportProgress({ top: 200, height: 400 }, vh)).toBe(0.5);
  });
  it("is 1 once the element has left through the top", () => {
    expect(viewportProgress({ top: -400, height: 400 }, vh)).toBe(1);
    expect(viewportProgress({ top: -2000, height: 400 }, vh)).toBe(1);
  });
});

describe("remap", () => {
  it("runs the effect only inside its window", () => {
    expect(remap(0.1, 0.25, 0.35)).toBe(0);
    expect(remap(0.425, 0.25, 0.35)).toBeCloseTo(0.5);
    expect(remap(0.9, 0.25, 0.35)).toBe(1);
  });
  it("acts as a step for a zero-length window", () => {
    expect(remap(0.2, 0.3, 0)).toBe(0);
    expect(remap(0.3, 0.3, 0)).toBe(1);
  });
});
