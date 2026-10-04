"use client";

import { CirclePause, Contrast, Link, Minus, MousePointer2, Palette, Plus, Type, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { site } from "@content/data";
import { AccessibilityIcon } from "@/components/icons";
import {
  A11Y_OPTIONS,
  a11yClasses,
  DEFAULT_A11Y,
  parseA11y,
  serializeA11y,
  SIZE_STEPS,
  STORAGE_KEY,
  stepSize,
  toggleOption,
  zoomFor,
  type A11yOption,
  type A11yState,
} from "@/lib/a11y";
import { cn } from "@/lib/utils";

const ICONS: Record<A11yOption, ReactNode> = {
  contrast: <Contrast strokeWidth={1.8} aria-hidden="true" />,
  gray: <Palette strokeWidth={1.8} aria-hidden="true" />,
  links: <Link strokeWidth={1.8} aria-hidden="true" />,
  font: <Type strokeWidth={1.8} aria-hidden="true" />,
  still: <CirclePause strokeWidth={1.8} aria-hidden="true" />,
  cursor: <MousePointer2 strokeWidth={1.8} aria-hidden="true" />,
};

/** Same-tab change signal; the native "storage" event only fires in other tabs. */
const CHANGE_EVENT = "shc-a11y-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Raw stored value (a string, so React can compare snapshots). In-memory fallback when storage is blocked. */
let memory: string | null = null;
function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return memory;
  }
}

/** Write a state to <html> (classes and zoom) and to storage, then notify the menu. */
function applyA11y(state: A11yState) {
  const root = document.documentElement;
  const classes = a11yClasses(state);
  A11Y_OPTIONS.forEach((o) => root.classList.toggle(`a11y-${o}`, classes.includes(`a11y-${o}`)));
  if (state.size > 0) root.style.setProperty("--a11y-zoom", String(zoomFor(state)));
  else root.style.removeProperty("--a11y-zoom");
  const raw = state.size === 0 && state.on.length === 0 ? null : serializeA11y(state);
  memory = raw;
  try {
    if (raw === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Storage blocked: the choice holds for this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Accessibility menu (spec 15): a convenience layer on top of an accessible site, not the source of compliance.
 * A floating button opens a non-modal panel; Esc, the close button or a click outside closes it and returns focus.
 */
export function A11yMenu() {
  const copy = site.a11y;
  const [open, setOpen] = useState(false);
  // The boot script applied the saved choices before paint; the menu reads the same stored value.
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const state = useMemo(() => parseA11y(raw), [raw]);
  const panelId = useId();
  const fab = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const update = useCallback((next: A11yState) => applyA11y(next), []);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) fab.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panel.current?.contains(target) && !fab.current?.contains(target)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  const percent = `${Math.round((SIZE_STEPS[state.size] ?? 1) * 100)}%`;
  const roundButton =
    "grid size-10 place-items-center rounded-full border-[1.5px] border-ink disabled:opacity-35 [&_svg]:size-[18px]";

  return (
    <>
      <button
        ref={fab}
        type="button"
        aria-label={copy.open}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        className={cn(
          "fixed start-4 bottom-[calc(86px+env(safe-area-inset-bottom))] z-[110] grid size-[52px] place-items-center rounded-full",
          "border-2 border-ink bg-brass text-ink shadow-fab transition-transform duration-[350ms] ease-out hover:scale-[1.06]",
          "desk:start-6 desk:bottom-6 [&_svg]:size-[26px]",
        )}
      >
        <AccessibilityIcon />
      </button>

      <div
        ref={panel}
        id={panelId}
        role="dialog"
        aria-label={copy.title}
        inert={!open}
        data-open={open ? "" : undefined}
        className={cn(
          "fixed start-4 bottom-[calc(148px+env(safe-area-inset-bottom))] z-[111] max-h-[calc(100svh-180px)] w-[min(340px,calc(100vw-32px))] overflow-y-auto",
          "rounded-[22px] border border-bark bg-paper p-5 text-ink shadow-panel desk:start-6 desk:bottom-[88px]",
          // Visibility flips at once on open (so the panel can take focus) and only after the fade on close.
          "invisible translate-y-3 opacity-0 [transition:opacity_.3s_var(--ease-out),transform_.35s_var(--ease-out),visibility_0s_linear_.3s]",
          "data-[open]:visible data-[open]:translate-y-0 data-[open]:opacity-100 data-[open]:[transition:opacity_.3s_var(--ease-out),transform_.35s_var(--ease-out),visibility_0s]",
        )}
      >
        <div className="mb-3.5 flex items-center justify-between">
          <p className="font-serif text-[22px] font-bold">{copy.title}</p>
          <button
            ref={closeButton}
            type="button"
            aria-label={copy.close}
            onClick={() => close()}
            className="grid size-10 place-items-center rounded-full bg-stone [&_svg]:size-[18px]"
          >
            <X strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="mb-2.5 flex items-center justify-between gap-2.5 rounded-[14px] bg-stone px-3 py-2.5">
          <span className="font-semibold">{copy.textSize}</span>
          {/* Prototype order: minus at the start (right), plus towards the reading direction (left). */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={copy.smaller}
              disabled={state.size === 0}
              onClick={() => update(stepSize(state, -1))}
              className={roundButton}
            >
              <Minus strokeWidth={2} aria-hidden="true" />
            </button>
            <output aria-live="polite" className="num min-w-[3.2em] text-center">
              {percent}
            </output>
            <button
              type="button"
              aria-label={copy.larger}
              disabled={state.size === SIZE_STEPS.length - 1}
              onClick={() => update(stepSize(state, 1))}
              className={roundButton}
            >
              <Plus strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {A11Y_OPTIONS.map((option) => {
            const pressed = state.on.includes(option);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={pressed}
                onClick={() => update(toggleOption(state, option))}
                className={cn(
                  "flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] p-2.5 text-center text-sm font-semibold transition-colors duration-200 [&_svg]:size-6",
                  pressed ? "border-ink bg-ink text-stone" : "border-bark bg-paper text-ink",
                )}
              >
                {ICONS[option]}
                {copy.options[option]}
              </button>
            );
          })}
        </div>

        <div className="mt-3.5 grid gap-1 text-sm">
          <button
            type="button"
            onClick={() => update(DEFAULT_A11Y)}
            className="justify-self-start py-2 font-bold text-brass-deep underline underline-offset-4"
          >
            {copy.reset}
          </button>
          <ul className="flex flex-wrap gap-x-4 border-t border-bark pt-1.5">
            {[
              { href: site.legal.accessibilityStatementPath, label: site.legal.accessibilityLabel },
              { href: site.legal.privacyPath, label: site.legal.privacyLabel },
              { href: site.legal.termsPath, label: site.legal.termsLabel },
            ].map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-block py-2 text-ink underline underline-offset-4">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
