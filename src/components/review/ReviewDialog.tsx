"use client";

import { PenLine, X } from "lucide-react";
import { useRef, useState } from "react";
import { site } from "@content/data";
import { useMotion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./ReviewForm";

/**
 * "Leave a review" (spec 18): an opener button and a native modal <dialog>. The browser provides the focus trap,
 * Esc, the inert page behind and the top layer; we add the backdrop click, scroll lock and focus return.
 * Phones get a bottom sheet, 700px+ a centred panel. A typed draft survives closing; a sent form starts fresh.
 */
export function ReviewDialog() {
  const copy = site.reviewForm;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const sentRef = useRef(false);
  const [formKey, setFormKey] = useState(0);
  const { stopScroll, startScroll } = useMotion();

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    stopScroll();
    dialog.querySelector<HTMLElement>("input:not([tabindex='-1']), select, textarea")?.focus();
  }

  const close = () => dialogRef.current?.close();

  // Native "close" fires for Esc, the close buttons and the backdrop alike.
  function onClose() {
    startScroll();
    openerRef.current?.focus();
    if (sentRef.current) {
      sentRef.current = false;
      setFormKey((k) => k + 1);
    }
  }

  return (
    <>
      <Button ref={openerRef} variant="ghost" aria-haspopup="dialog" onClick={open} className="min-h-12">
        <PenLine strokeWidth={1.8} aria-hidden="true" />
        {copy.open}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="review-dialog-title"
        aria-describedby="review-dialog-note"
        onClose={onClose}
        // A click that lands on the dialog itself (not the panel) is a click on the backdrop.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="review-dialog m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink open:grid open:items-end open:justify-items-center min-[700px]:open:items-center min-[700px]:p-6"
      >
        <div
          data-lenis-prevent
          className="review-sheet relative max-h-[92svh] w-full max-w-[560px] overflow-y-auto rounded-t-lg bg-paper px-[22px] pt-[26px] pb-[calc(22px+env(safe-area-inset-bottom,0px))] shadow-sheet min-[700px]:rounded-lg min-[700px]:px-[34px] min-[700px]:pt-[34px] min-[700px]:pb-[30px]"
        >
          <div className="mb-[22px] flex items-start justify-between gap-4">
            <div>
              <h2 id="review-dialog-title" className="font-serif text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.1] font-bold">
                {copy.title}
              </h2>
              <p id="review-dialog-note" className="mt-2 text-[15px] text-muted">
                {copy.note}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={copy.close}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-stone text-ink transition-colors hover:bg-bark"
            >
              <X className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>

          <ReviewForm
            key={formKey}
            onSent={() => (sentRef.current = true)}
            doneAction={
              <Button variant="line" onClick={close}>
                {copy.close}
              </Button>
            }
          />
        </div>
      </dialog>
    </>
  );
}
