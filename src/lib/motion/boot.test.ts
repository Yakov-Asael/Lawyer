import { describe, expect, it } from "vitest";
import { MOTION_BOOT_SCRIPT, motionBoot } from "./boot";

function fakeRoot() {
  const classes = new Set<string>();
  return { classes, root: { classList: { add: (c: string) => classes.add(c) } } as unknown as HTMLElement };
}

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
}

describe("motionBoot", () => {
  it("first visit: arms motion and plays the intro, then remembers it", () => {
    const { root, classes } = fakeRoot();
    const storage = fakeStorage();
    motionBoot(root, storage, false);
    expect([...classes]).toEqual(["motion", "intro"]);
    expect(storage.getItem("shc-intro-seen")).toBe("1");
  });

  it("later loads in the session: motion without the intro", () => {
    const { root, classes } = fakeRoot();
    motionBoot(root, fakeStorage({ "shc-intro-seen": "1" }), false);
    expect([...classes]).toEqual(["motion", "intro-seen"]);
  });

  it("reduced motion: nothing is armed and no intro", () => {
    const { root, classes } = fakeRoot();
    motionBoot(root, fakeStorage(), true);
    expect(classes.size).toBe(0);
  });

  it("blocked storage: no intro replay loop", () => {
    const { root, classes } = fakeRoot();
    const throwing = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
    motionBoot(root, throwing, false);
    expect([...classes]).toEqual(["motion", "intro-seen"]);
  });

  it("serializes into a self-contained script", () => {
    expect(MOTION_BOOT_SCRIPT).toContain("shc-intro-seen");
    expect(() => new Function(MOTION_BOOT_SCRIPT)).not.toThrow();
  });
});
