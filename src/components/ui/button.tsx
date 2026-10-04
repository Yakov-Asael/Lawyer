import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button, with the site's variants (spec 01).
 * No Radix Slot: links use <ButtonLink> (or buttonVariants on an <a>), which keeps the dependency list as approved.
 */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2.5 rounded-pill border-[1.5px] border-transparent",
    "text-[15px] font-bold whitespace-nowrap text-trim no-underline tablet:text-base",
    "transition-[background-color,color,border-color,transform] duration-[250ms,250ms,250ms,350ms] ease-out",
    "hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Primary action on dark grounds. */
        brass: "bg-brass text-ink hover:bg-brass-hover",
        /** Primary action on light grounds. */
        ink: "bg-ink text-stone hover:bg-field",
        /** Secondary on dark grounds. */
        ghost: "border-on-dark/45 text-on-dark hover:border-on-dark hover:bg-on-dark/8",
        /** Secondary on light grounds. */
        line: "border-ink text-ink hover:bg-ink hover:text-stone",
      },
      shape: {
        pill: "",
        /** Round, icon only. Needs an aria-label. */
        icon: "p-0",
      },
      size: {
        default: "h-[52px] [&_svg]:size-5",
        /** Hero on phones: 48px, tighter padding. */
        hero: "h-12 tablet:h-[52px] [&_svg]:size-[18px] tablet:[&_svg]:size-5",
      },
    },
    compoundVariants: [
      { shape: "pill", size: "default", className: "px-[26px]" },
      { shape: "pill", size: "hero", className: "px-3 tablet:px-[26px]" },
      { shape: "icon", size: "default", className: "w-[52px] [&_svg]:size-[22px]" },
      { shape: "icon", size: "hero", className: "w-12 tablet:w-[52px] [&_svg]:size-5 tablet:[&_svg]:size-[22px]" },
    ],
    defaultVariants: { variant: "ink", shape: "pill", size: "default" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  shape,
  size,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button"> & ButtonVariantProps) {
  return <button type={type} data-slot="button" className={cn(buttonVariants({ variant, shape, size }), className)} {...props} />;
}

/** True for anything that leaves the page: other origins, wa.me, tel:, mailto:. */
export function isExternalHref(href: string): boolean {
  return /^(https?:|tel:|mailto:)/.test(href);
}

/**
 * A link styled as a button. External targets (wa.me, tel:, Waze, Maps) always open with
 * target="_blank" rel="noopener" (spec 01).
 */
export function ButtonLink({
  className,
  variant,
  shape,
  size,
  href,
  ...props
}: ComponentPropsWithoutRef<"a"> & ButtonVariantProps & { href: string }) {
  const external = isExternalHref(href) ? { target: "_blank", rel: "noopener" } : {};
  return (
    <a href={href} data-slot="button" {...external} {...props} className={cn(buttonVariants({ variant, shape, size }), className)} />
  );
}
