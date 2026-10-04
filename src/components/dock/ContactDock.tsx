"use client";

import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@content";
import { WhatsAppIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { telLink, waLink } from "@/lib/contact";
import { dockVisible, isTextEntry } from "@/lib/dock";
import { onFrame } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Phone contact dock (spec 14): WhatsApp and call, one tap away once the visitor has left the hero.
 * Below 900px only. While hidden it is inert, so keyboard and screen-reader users never land on off-screen buttons.
 * The footer reserves its height (`dock-clearance`). It also steps aside while a text field has focus (spec 18).
 */
export function ContactDock() {
  const { ui, office } = site;
  const [shown, setShown] = useState(false);
  const [typing, setTyping] = useState(false);
  const last = useRef<boolean | null>(null);

  useEffect(() => {
    const hero = document.querySelector("section[aria-labelledby=hero-title]");
    let lastY = Number.NaN;
    let lastH = Number.NaN;
    const update = () => {
      // Only measure when the page actually moved or resized.
      if (window.scrollY === lastY && window.innerHeight === lastH) return;
      lastY = window.scrollY;
      lastH = window.innerHeight;
      const next = dockVisible(hero ? hero.getBoundingClientRect().bottom : null, window.innerHeight);
      if (next !== last.current) {
        last.current = next;
        setShown(next);
      }
    };
    update();
    return onFrame(update);
  }, []);

  useEffect(() => {
    const onFocus = () => setTyping(isTextEntry(document.activeElement));
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onFocus);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onFocus);
    };
  }, []);

  const visible = shown && !typing;

  const callName = ui.callLabel.replace("{phone}", office.phoneDisplay);

  return (
    <nav
      aria-label={ui.dockLabel}
      inert={!visible}
      data-shown={visible ? "" : undefined}
      className={cn(
        "on-dark fixed inset-x-0 bottom-0 z-50 grid grid-cols-[1.3fr_1fr] gap-2 px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] desk:hidden",
        "bg-ink/94 backdrop-blur-[10px] transition-transform duration-500 ease-out",
        visible ? "translate-y-0" : "translate-y-[110%]",
      )}
    >
      <ButtonLink href={waLink()} variant="brass" className="h-[50px] min-w-0 px-3 text-[15px]">
        <WhatsAppIcon />
        <span>{ui.whatsappShort}</span>
      </ButtonLink>
      <ButtonLink href={telLink()} variant="ghost" aria-label={callName} className="h-[50px] min-w-0 px-3 text-[15px]">
        <Phone strokeWidth={1.8} aria-hidden="true" />
        <span>{ui.callShort}</span>
      </ButtonLink>
    </nav>
  );
}
