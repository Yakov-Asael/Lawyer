import { Phone } from "lucide-react";
import { site } from "@content";
import { WhatsAppIcon } from "@/components/icons";
import { ButtonLink, type ButtonVariantProps } from "@/components/ui/button";
import { telLink, waLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

type ContactButtonsProps = {
  /** Ground the pair sits on: brass + ghost on dark, ink + line on light. */
  tone: "dark" | "light";
  /** Practice-area topic for the pre-filled WhatsApp message. */
  topic?: string;
  /** WhatsApp button text. Defaults to the site-wide call to action. */
  label?: React.ReactNode;
  size?: ButtonVariantProps["size"];
  className?: string;
};

/**
 * The contact pattern used across the site (spec 01): WhatsApp button, then a round call button.
 * The number is never button text; it is the call button's accessible name.
 */
export function ContactButtons({ tone, topic, label, size = "default", className }: ContactButtonsProps) {
  const callName = site.ui.callLabel.replace("{phone}", site.office.phoneDisplay);
  const dark = tone === "dark";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <ButtonLink href={waLink(topic)} variant={dark ? "brass" : "ink"} size={size}>
        <WhatsAppIcon />
        <span>{label ?? site.ui.whatsappCta}</span>
      </ButtonLink>
      <ButtonLink
        href={telLink()}
        variant={dark ? "ghost" : "line"}
        shape="icon"
        size={size}
        aria-label={callName}
        title={site.office.phoneDisplay}
      >
        <Phone strokeWidth={1.8} aria-hidden="true" />
      </ButtonLink>
    </div>
  );
}
