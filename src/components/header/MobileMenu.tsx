"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { site } from "@content/data";
import { WhatsAppIcon } from "@/components/icons";
import { useMotion } from "@/components/motion";
import { Ruled } from "@/components/shared";
import { ButtonLink } from "@/components/ui/button";
import { telLink, waLink } from "@/lib/contact";
import { menuLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Brand } from "./Brand";

/** Two animation frames: the overlay is visible before focus moves into it (spec 02). */
const afterPaint = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

/** Everything in <body> except the menu becomes inert while the menu is open. */
function setPageInert(menu: HTMLElement, inert: boolean) {
  for (const el of Array.from(document.body.children)) {
    if (el !== menu && el instanceof HTMLElement) el.inert = inert;
  }
}

const subscribeNoop = () => () => {};

/** Burger button + full-screen menu dialog for widths below 1000px (spec 02). */
export function MobileMenu({ hasReviews }: { hasReviews: boolean }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const { stopScroll, startScroll, goToHash } = useMotion();
  const menuId = useId();
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  /** Where to go once the menu has closed (a menu link was used). */
  const pendingHash = useRef<string | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const menu = menuRef.current;
    const burger = burgerRef.current;
    if (!menu || !open) return;

    setPageInert(menu, true);
    document.documentElement.classList.add("menu-lock");
    stopScroll();
    afterPaint(() => firstLinkRef.current?.focus({ preventScroll: true }));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Widening past the nav breakpoint hides the burger, so the menu has no reason to stay open.
    const wide = window.matchMedia("(min-width: 62.5rem)");
    wide.addEventListener("change", close);

    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", close);
      setPageInert(menu, false);
      document.documentElement.classList.remove("menu-lock");
      startScroll();
      const hash = pendingHash.current;
      pendingHash.current = null;
      if (hash) goToHash(hash);
      else burger?.focus({ preventScroll: true });
    };
  }, [open, close, stopScroll, startScroll, goToHash]);

  const onLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    pendingHash.current = href;
    close();
  };

  const callName = site.ui.callLabel.replace("{phone}", site.office.phoneDisplay);

  const menu = (
    <div
      ref={menuRef}
      id={menuId}
      role="dialog"
      aria-modal="true"
      aria-label={site.ui.menuLabel}
      inert={!open}
      data-open={open ? "" : undefined}
      className={cn(
        "group on-dark fixed inset-0 z-[120] isolate flex flex-col overflow-y-auto bg-ink text-on-dark",
        "px-gutter pt-[22px] pb-[calc(26px+env(safe-area-inset-bottom))]",
        "invisible opacity-0 transition-[opacity,visibility] duration-[450ms] ease-out",
        "data-[open]:visible data-[open]:opacity-100",
      )}
    >
      <Ruled />
      <div className="flex items-center justify-between">
        <Brand />
        <button
          type="button"
          onClick={close}
          aria-label={site.ui.closeMenu}
          className={cn(
            "relative size-12 rounded-full border border-line-dark bg-on-dark/8 transition-transform duration-[450ms] ease-out hover:rotate-90",
            // inset-0 + m-auto centers the bars without a physical offset, so RTL cannot shift them.
            "before:absolute before:inset-0 before:m-auto before:h-[1.5px] before:w-[18px] before:rotate-45 before:bg-on-dark",
            "after:absolute after:inset-0 after:m-auto after:h-[1.5px] after:w-[18px] after:-rotate-45 after:bg-on-dark",
          )}
        />
      </div>

      <ul className="my-auto grid gap-1.5 py-10">
        {menuLinks(site.navigation.menu, hasReviews).map((link, i) => (
          <li key={link.href}>
            <a
              ref={i === 0 ? firstLinkRef : undefined}
              href={link.href}
              onClick={(e) => onLink(e, link.href)}
              style={{ "--d": `${80 + i * 80}ms` } as CSSProperties}
              className={cn(
                "block py-2 font-serif text-[1.9rem] leading-[1.1] font-bold no-underline tablet:text-[clamp(2.1rem,9vw,3.2rem)]",
                "translate-y-[26px] opacity-0 transition-[opacity,transform,color] duration-[600ms,600ms,200ms] ease-out hover:text-brass",
                "group-data-[open]:translate-y-0 group-data-[open]:opacity-100 group-data-[open]:delay-(--d)",
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "grid gap-2.5 border-t border-line-dark pt-[22px]",
          "translate-y-4 opacity-0 transition-[opacity,transform] delay-[350ms] duration-[600ms] ease-out",
          "group-data-[open]:translate-y-0 group-data-[open]:opacity-100",
        )}
      >
        <ButtonLink href={waLink()} variant="brass" className="w-full">
          <WhatsAppIcon />
          <span>{site.ui.whatsappCta}</span>
        </ButtonLink>
        <ButtonLink href={telLink()} variant="ghost" className="w-full" aria-label={callName}>
          <span>{site.ui.callShort}</span>
        </ButtonLink>
        <p className="mt-1.5 text-center text-sm text-on-dark-soft">
          {site.office.address}, {site.office.city} · <span className="num">{site.office.phoneDisplay}</span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={site.ui.openMenu}
        aria-expanded={open}
        aria-controls={menuId}
        className="grid size-12 place-content-center gap-1.5 rounded-full border border-line-dark bg-on-dark/8 text-on-dark nav:hidden"
      >
        <i className="block h-[1.5px] w-[18px] rounded-sm bg-current" />
        <i className="ms-auto block h-[1.5px] w-3 rounded-sm bg-current" />
      </button>
      {mounted && createPortal(menu, document.body)}
    </>
  );
}
