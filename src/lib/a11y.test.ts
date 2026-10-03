import { describe, expect, it } from "vitest";
import { a11yClasses, DEFAULT_A11Y, isDefault, parseA11y, serializeA11y, stepSize, toggleOption, zoomFor } from "./a11y";
import { a11yBoot } from "./motion/boot";

describe("a11y preferences", () => {
  it("round-trips through storage", () => {
    const state = { size: 2, on: ["contrast", "still"] as const };
    expect(parseA11y(serializeA11y({ size: 2, on: [...state.on] }))).toEqual({ size: 2, on: ["contrast", "still"] });
  });

  it("falls back to defaults on anything malformed", () => {
    expect(parseA11y(null)).toEqual(DEFAULT_A11Y);
    expect(parseA11y("{oops")).toEqual(DEFAULT_A11Y);
    expect(parseA11y('{"size":9,"on":["contrast","rm -rf",3]}')).toEqual({ size: 3, on: ["contrast"] });
    expect(parseA11y('{"size":-2}')).toEqual({ size: 0, on: [] });
  });

  it("toggles options in a stable order and clamps size", () => {
    let s = toggleOption(DEFAULT_A11Y, "still");
    s = toggleOption(s, "contrast");
    expect(s.on).toEqual(["contrast", "still"]);
    expect(toggleOption(s, "contrast").on).toEqual(["still"]);
    expect(stepSize(stepSize(stepSize(stepSize(DEFAULT_A11Y, 1), 1), 1), 1).size).toBe(3);
    expect(stepSize(DEFAULT_A11Y, -1).size).toBe(0);
  });

  it("maps to classes and zoom", () => {
    expect(a11yClasses({ size: 1, on: ["gray", "links"] })).toEqual(["a11y-gray", "a11y-links"]);
    expect(zoomFor({ size: 3, on: [] })).toBe(1.35);
    expect(isDefault(DEFAULT_A11Y)).toBe(true);
  });
});

describe("boot parity", () => {
  const cases = [null, "{oops", '{"size":2,"on":["contrast","still"]}', '{"size":9,"on":["gray","nope"]}'];
  for (const raw of cases) {
    it(`boot applies what the menu computes for ${raw}`, () => {
      const classes = new Set<string>();
      const style = new Map<string, string>();
      const root = {
        classList: { add: (c: string) => classes.add(c) },
        style: { setProperty: (k: string, v: string) => style.set(k, v) },
      } as unknown as HTMLElement;
      const still = a11yBoot(root, { getItem: () => raw });
      const state = parseA11y(raw);
      expect([...classes]).toEqual(a11yClasses(state));
      expect(Number(style.get("--a11y-zoom") ?? 1)).toBe(zoomFor(state));
      expect(still).toBe(state.on.includes("still"));
    });
  }
});
