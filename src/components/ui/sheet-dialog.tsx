"use client";

import { X } from "lucide-react";
import { useImperativeHandle, useRef, type ReactNode, type Ref } from "react";
import { useMotion } from "@/components/motion";
import { cn } from "@/lib/utils";

export type SheetDialogHandle = {
  /** Opens the dialog; focus returns to `opener` (or whatever had focus) when it closes. */
  open: (opener?: HTMLElement | null) => void;
  close: () => void;
};

type SheetDialogProps = {
  ref?: Ref<SheetDialogHandle>;
  /** Accessible name: the id of the title element inside `header`. */
  labelledBy: string;
  describedBy?: string;
  /** Title area beside the close button. */
  header: ReactNode;
  closeLabel: string;
  /** Focus target on open: "close" (reading dialogs) or "first-field" (forms). */
  initialFocus?: "close" | "first-field";
  onClosed?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * The site's modal panel (specs 09, 18): a native <dialog>, so the browser gives the focus trap, Esc and the inert
 * page behind. We add the backdrop click, the scroll lock and focus return. Phones get a bottom sheet, 700px+ a
 * centred panel at most 560px. It rises in under html.motion only (globals.css: .sheet-dialog / .sheet-panel).
 */
export function SheetDialog({
  ref,
  labelledBy,
  describedBy,
  header,
  closeLabel,
  initialFocus = "close",
  onClosed,
  children,
  className,
}: SheetDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const { stopScroll, startScroll } = useMotion();

  useImperativeHandle(ref, () => ({
    open(opener) {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      returnTo.current = opener ?? (document.activeElement as HTMLElement | null);
      dialog.showModal();
      stopScroll();
      const field = dialog.querySelector<HTMLElement>("input:not([tabindex='-1']), select, textarea");
      (initialFocus === "first-field" && field ? field : closeRef.current)?.focus();
    },
    close: () => dialogRef.current?.close(),
  }));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      // Native "close" fires for Esc, the close button and the backdrop alike.
      onClose={() => {
        startScroll();
        returnTo.current?.focus({ preventScroll: true });
        onClosed?.();
      }}
      // A click that lands on the dialog itself (not the panel) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      className="sheet-dialog m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink open:grid open:items-end open:justify-items-center min-[700px]:open:items-center min-[700px]:p-6"
    >
      <div
        data-lenis-prevent
        className={cn(
          "sheet-panel relative max-h-[92svh] w-full max-w-[560px] overflow-y-auto rounded-t-lg bg-paper px-[22px] pt-[26px] pb-[calc(22px+env(safe-area-inset-bottom,0px))] shadow-sheet",
          "min-[700px]:rounded-lg min-[700px]:px-[34px] min-[700px]:pt-[34px] min-[700px]:pb-[30px]",
          className,
        )}
      >
        <div className="mb-[22px] flex items-start justify-between gap-4">
          <div>{header}</div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={closeLabel}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-stone text-ink transition-colors hover:bg-bark"
          >
            <X className="size-5" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
