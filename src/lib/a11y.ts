/**
 * Accessibility menu preferences (spec 15). Each option is a class on <html>; text size is a zoom step.
 * Stored in localStorage under STORAGE_KEY and applied before first paint by the boot script (src/lib/motion/boot.ts),
 * which carries its own copy of this parsing: a parity test keeps the two in step.
 */

export const STORAGE_KEY = "shc-a11y";
export const A11Y_OPTIONS = ["contrast", "gray", "links", "font", "still", "cursor"] as const;
export type A11yOption = (typeof A11Y_OPTIONS)[number];
/** Zoom per text-size step: 100 / 110 / 120 / 135%. */
export const SIZE_STEPS = [1, 1.1, 1.2, 1.35] as const;

export type A11yState = { size: number; on: A11yOption[] };
export const DEFAULT_A11Y: A11yState = { size: 0, on: [] };

/** Parse whatever is stored; anything malformed falls back to the defaults. */
export function parseA11y(raw: string | null): A11yState {
  if (!raw) return DEFAULT_A11Y;
  try {
    const data = JSON.parse(raw) as { size?: unknown; on?: unknown };
    const size = Number.isInteger(data.size) ? Math.min(SIZE_STEPS.length - 1, Math.max(0, data.size as number)) : 0;
    const on = Array.isArray(data.on) ? A11Y_OPTIONS.filter((o) => (data.on as unknown[]).includes(o)) : [];
    return { size, on };
  } catch {
    return DEFAULT_A11Y;
  }
}

export const serializeA11y = (state: A11yState) => JSON.stringify(state);

/** The <html> classes for a state, e.g. "a11y-contrast". */
export const a11yClasses = (state: A11yState) => state.on.map((o) => `a11y-${o}`);

export const zoomFor = (state: A11yState) => SIZE_STEPS[state.size] ?? 1;

export function toggleOption(state: A11yState, option: A11yOption): A11yState {
  const on = state.on.includes(option) ? state.on.filter((o) => o !== option) : [...state.on, option];
  return { ...state, on: A11Y_OPTIONS.filter((o) => on.includes(o)) };
}

export function stepSize(state: A11yState, delta: -1 | 1): A11yState {
  return { ...state, size: Math.min(SIZE_STEPS.length - 1, Math.max(0, state.size + delta)) };
}

export const isDefault = (state: A11yState) => state.size === 0 && state.on.length === 0;
