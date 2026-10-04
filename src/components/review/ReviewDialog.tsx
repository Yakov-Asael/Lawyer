"use client";

import { PenLine } from "lucide-react";
import { useRef, useState } from "react";
import { site } from "@content/data";
import { Button } from "@/components/ui/button";
import { SheetDialog, type SheetDialogHandle } from "@/components/ui/sheet-dialog";
import { ReviewForm } from "./ReviewForm";

/**
 * "Leave a review" (spec 18): an opener button and the shared modal panel (SheetDialog: native <dialog>, bottom sheet
 * on phones, centred from 700px, focus return). A typed draft survives closing; a sent form starts fresh.
 */
export function ReviewDialog() {
  const copy = site.reviewForm;
  const dialog = useRef<SheetDialogHandle>(null);
  const sentRef = useRef(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <>
      <Button
        variant="ghost"
        aria-haspopup="dialog"
        onClick={(e) => dialog.current?.open(e.currentTarget)}
        className="min-h-12"
      >
        <PenLine strokeWidth={1.8} aria-hidden="true" />
        {copy.open}
      </Button>

      <SheetDialog
        ref={dialog}
        labelledBy="review-dialog-title"
        describedBy="review-dialog-note"
        closeLabel={copy.close}
        initialFocus="first-field"
        onClosed={() => {
          if (sentRef.current) {
            sentRef.current = false;
            setFormKey((k) => k + 1);
          }
        }}
        header={
          <>
            <h2 id="review-dialog-title" className="font-serif text-[clamp(1.6rem,3vw,2.1rem)] leading-[1.1] font-bold">
              {copy.title}
            </h2>
            <p id="review-dialog-note" className="mt-2 text-[15px] text-muted">
              {copy.note}
            </p>
          </>
        }
      >
        <ReviewForm
          key={formKey}
          onSent={() => (sentRef.current = true)}
          doneAction={
            <Button variant="line" onClick={() => dialog.current?.close()}>
              {copy.close}
            </Button>
          }
        />
      </SheetDialog>
    </>
  );
}
