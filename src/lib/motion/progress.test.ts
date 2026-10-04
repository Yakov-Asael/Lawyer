import { describe, expect, it } from "vitest";
import { clamp01, foldHidden, foldProgress, overlapRatio, readingProgress, remap, viewportProgress } from "./progress";

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

describe("readingProgress", () => {
  const vh = 1000;
  it("starts when the block top reaches 82% of the viewport", () => {
    expect(readingProgress({ top: 820, height: 300 }, vh)).toBe(0);
    expect(readingProgress({ top: 900, height: 300 }, vh)).toBe(0);
  });
  it("spans the block height plus 25% of the viewport", () => {
    // span = 300 + 250 = 550; halfway = 275px of travel
    expect(readingProgress({ top: 820 - 275, height: 300 }, vh)).toBeCloseTo(0.5);
    expect(readingProgress({ top: 820 - 550, height: 300 }, vh)).toBe(1);
  });
  it("is complete while the block is still fully in view", () => {
    // Block of 300px finishes at top = 270, i.e. its bottom at 570: well inside a 1000px viewport.
    const top = 820 - 550;
    expect(top + 300).toBeLessThan(vh);
    expect(readingProgress({ top, height: 300 }, vh)).toBe(1);
  });
});

describe("overlapRatio", () => {
  const card = { bottom: 500, height: 400 };
  it("is 0 while the next card sits below", () => {
    expect(overlapRatio(card, { top: 520 })).toBe(0);
    expect(overlapRatio(card, { top: 500 })).toBe(0);
  });
  it("grows as the next card slides over", () => {
    expect(overlapRatio(card, { top: 300 })).toBe(0.5);
  });
  it("caps at 1 and survives a zero-height card", () => {
    expect(overlapRatio(card, { top: 0 })).toBe(1);
    expect(overlapRatio({ bottom: 0, height: 0 }, { top: 0 })).toBe(0);
  });
});

describe("file stack fold (spec 06)", () => {
  it("lifts from 0 to 1 over the fold span as the next file reaches the stick line", () => {
    expect(foldProgress(128 + 220)).toBe(0);
    expect(foldProgress(128 + 110)).toBe(0.5);
    expect(foldProgress(128)).toBe(1);
    expect(foldProgress(900)).toBe(0);
  });

  it("hides a file once the file two later is near the stick line", () => {
    expect(foldHidden(undefined)).toBe(false);
    expect(foldHidden(400)).toBe(false);
    expect(foldHidden(150)).toBe(true);
  });
});
