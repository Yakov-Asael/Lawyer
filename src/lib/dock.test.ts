import { describe, expect, it } from "vitest";
import { dockVisible } from "./dock";

describe("dockVisible", () => {
  const vh = 844;
  it("stays hidden while most of the hero is on screen", () => {
    expect(dockVisible(844, vh)).toBe(false);
    expect(dockVisible(vh * 0.4, vh)).toBe(false);
  });
  it("shows once the hero's bottom passes 40% of the viewport", () => {
    expect(dockVisible(vh * 0.4 - 1, vh)).toBe(true);
    expect(dockVisible(-200, vh)).toBe(true);
  });
  it("always shows on pages without a hero", () => {
    expect(dockVisible(null, vh)).toBe(true);
  });
});
