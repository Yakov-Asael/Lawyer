"use client";

import { Check, ChevronDown } from "lucide-react";
import { useCallback, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { site, type PracticeAreaId } from "@content/data";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { waTextLink } from "@/lib/contact-links";
import {
  areaFromParam,
  charCount,
  EMPTY_REVIEW,
  encodeReview,
  firstInvalid,
  HONEYPOT_FIELD,
  LIMITS,
  REVIEW_FORM_ACTION,
  validateReview,
  type ReviewErrors,
  type ReviewValues,
} from "@/lib/review-form";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "error" | "done";

type ReviewFormProps = {
  /** Read ?area= from the address bar (the /review page); unknown values are ignored. */
  areaFromUrl?: boolean;
  /** Heading level of the thank-you state: h3 inside the dialog (its title is the h2), h2 on the page. */
  doneHeading?: "h2" | "h3";
  /** The thank-you state's action: close the dialog, or (on the page) go back to the site. */
  doneAction: ReactNode;
  /** Called once the review is sent, so the dialog can start fresh next time. */
  onSent?: () => void;
};

const noopSubscribe = () => () => {};
const readSearch = () => window.location.search;

const control = cn(
  "w-full rounded-sm border-[1.5px] border-control-edge bg-paper px-3.5 py-3 text-[16px] text-ink",
  "transition-[border-color] duration-200 hover:border-ink aria-invalid:border-danger",
);

/**
 * The review form (spec 18), shared by the dialog on the home page and the /review page.
 * Validation runs on submit (then live, so fixed errors clear); each error sits under its field and focus moves
 * to the first invalid one. Posts to Netlify Forms; a server error keeps everything typed and offers WhatsApp.
 */
export function ReviewForm({ areaFromUrl = false, doneHeading = "h3", doneAction, onSent }: ReviewFormProps) {
  const copy = site.reviewForm;
  const id = useId();
  const fieldId = (name: string) => `${id}-${name}`;

  const search = useSyncExternalStore(noopSubscribe, areaFromUrl ? readSearch : () => "", () => "");
  const urlArea = areaFromParam(new URLSearchParams(search).get("area"));

  const [values, setValues] = useState<ReviewValues>(EMPTY_REVIEW);
  // null until the visitor picks an area, so the ?area= preset applies after hydration without an effect.
  const [pickedArea, setPickedArea] = useState<PracticeAreaId | "" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  // Stable, so it runs once when the thank-you mounts and never pulls focus back on a later render.
  const focusOnMount = useCallback((el: HTMLElement | null) => el?.focus(), []);

  const current: ReviewValues = { ...values, area: pickedArea ?? urlArea };
  const errors: ReviewErrors = submitted ? validateReview(current) : {};

  const set = <K extends keyof ReviewValues>(key: K, value: ReviewValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);
    const invalid = firstInvalid(validateReview(current));
    if (invalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${invalid}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const areaLabel = site.practiceAreas.find((a) => a.id === current.area)?.tabLabel ?? "";
    try {
      const res = await fetch(REVIEW_FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeReview(current, areaLabel, copy.consent, honeypotRef.current?.value),
      });
      if (!res.ok) throw new Error(`Form post failed: ${res.status}`);
      setStatus("done");
      onSent?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    const Heading = doneHeading;
    return (
      // Focus moves to the thank-you as it mounts, so it is announced and keyboard users are not left on a removed
      // button. A ref callback runs on commit, unlike a timer that can fire before React renders this state.
      <div ref={focusOnMount} tabIndex={-1} className="grid justify-items-center gap-2.5 py-5 text-center outline-none">
        <span className="grid size-16 place-items-center rounded-full bg-ink text-stone">
          <Check className="size-[30px]" strokeWidth={2} aria-hidden="true" />
        </span>
        <Heading className="mt-1.5 font-serif text-[1.6rem] font-bold">{copy.doneTitle}</Heading>
        <p className="max-w-[26em] text-muted">{copy.doneBody}</p>
        <div className="mt-3">{doneAction}</div>
      </div>
    );
  }

  const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;
  const reviewCount = charCount(current.review);

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-4">
      {/* Honeypot: invisible and unreachable for people; Netlify drops any submission that fills it. */}
      <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
        <label>
          {HONEYPOT_FIELD}
          <input ref={honeypotRef} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 min-[700px]:grid-cols-2">
        <Field id={fieldId("name")} label={copy.labels.name} hint={copy.hints.name} error={errors.name && copy.errors.name}>
          {(aria) => (
            <input
              {...aria}
              name="name"
              autoComplete="name"
              maxLength={LIMITS.name.max + 10}
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              className={control}
            />
          )}
        </Field>
        <Field id={fieldId("area")} label={copy.labels.area} error={errors.area && copy.errors.area}>
          {(aria) => (
            <div className="relative">
              <select
                {...aria}
                name="area"
                value={current.area}
                onChange={(e) => setPickedArea(areaFromParam(e.target.value))}
                className={cn(control, "appearance-none pe-10")}
              >
                <option value="">{copy.areaPlaceholder}</option>
                {site.practiceAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.tabLabel}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute end-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>
          )}
        </Field>
      </div>

      <Field
        id={fieldId("review")}
        label={copy.labels.review}
        hint={copy.hints.review}
        error={errors.review && copy.errors[errors.review === "reviewLong" ? "reviewLong" : "reviewShort"]}
        counter={
          <span dir="ltr" className="num">
            {reviewCount} / {LIMITS.review.max}
          </span>
        }
      >
        {(aria) => (
          <textarea
            {...aria}
            name="review"
            maxLength={LIMITS.review.max}
            value={values.review}
            onChange={(e) => set("review", e.target.value)}
            className={cn(control, "min-h-[130px] resize-y leading-[1.6]")}
          />
        )}
      </Field>

      <Field id={fieldId("phone")} label={copy.labels.phone} hint={copy.hints.phone} error={errors.phone && copy.errors.phone}>
        {(aria) => (
          <input
            {...aria}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={cn(control, "text-end")}
          />
        )}
      </Field>

      <div>
        <div className="flex items-start gap-3 rounded-md bg-stone p-3.5">
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describedBy(errors.consent && `${fieldId("consent")}-err`)}
            className="mt-0.5 size-[22px] shrink-0 accent-ink"
          />
          <label htmlFor={fieldId("consent")} className="text-[14.5px] leading-[1.55]">
            {copy.consent}
          </label>
        </div>
        {errors.consent && (
          <p id={`${fieldId("consent")}-err`} className="mt-1.5 text-[13.5px] font-semibold text-danger">
            {copy.errors.consent}
          </p>
        )}
      </div>

      {status === "error" && (
        <div role="alert" className="rounded-md border-[1.5px] border-danger bg-paper p-3.5 text-[14.5px]">
          <p className="font-semibold text-danger">{copy.errors.server}</p>
          <a
            href={waTextLink(site.office, `${copy.whatsappMessage}\n\n${current.review.trim()}\n\n${current.name.trim()}`)}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-bark underline-offset-[5px] [&_svg]:size-[18px]"
          >
            <WhatsAppIcon />
            {copy.serverFallback}
          </a>
        </div>
      )}

      <Button type="submit" variant="ink" disabled={status === "sending"} className="w-full">
        {status === "sending" ? copy.sending : copy.submit}
      </Button>
    </form>
  );
}

type AriaProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

/** Label, control, hint, live counter and the error in words, wired with aria-describedby and aria-invalid. */
function Field({
  id,
  label,
  hint,
  error,
  counter,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | false;
  counter?: ReactNode;
  children: (aria: AriaProps) => ReactNode;
}) {
  const ids = [hint && `${id}-hint`, counter && `${id}-count`, error && `${id}-err`].filter(Boolean).join(" ");
  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-[14.5px] font-semibold">
        {label}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined })}
      {(hint || counter) && (
        <div className="flex items-start justify-between gap-3 text-[13px] text-muted">
          {hint && <span id={`${id}-hint`}>{hint}</span>}
          {counter && (
            <span id={`${id}-count`} className="ms-auto shrink-0 text-[12.5px]">
              {counter}
            </span>
          )}
        </div>
      )}
      {error && (
        <p id={`${id}-err`} className="text-[13.5px] font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
