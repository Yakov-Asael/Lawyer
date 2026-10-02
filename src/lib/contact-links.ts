import type { Office, WhatsappCopy } from "@content/schema";

/**
 * Pure builders for every outbound contact link (specs/content-contract.md, "Derived values").
 * They take their data as arguments so they stay testable; src/lib/contact.ts binds them to the site content.
 */

type WaOffice = Pick<Office, "whatsappE164">;
type TelOffice = Pick<Office, "phoneE164">;
type PlaceOffice = Pick<Office, "address" | "city">;

/** The pre-filled WhatsApp text, with the practice-area topic when one is given. */
export function whatsappMessage(copy: WhatsappCopy, topic?: string): string {
  const t = topic?.trim();
  return t ? copy.topicMessage.replaceAll("{topic}", t) : copy.message;
}

/** https://wa.me/<number>?text=<encoded greeting> */
export function waLink(office: WaOffice, copy: WhatsappCopy, topic?: string): string {
  return `https://wa.me/${office.whatsappE164}?text=${encodeURIComponent(whatsappMessage(copy, topic))}`;
}

/** tel:+972... */
export function telLink(office: TelOffice): string {
  return `tel:${office.phoneE164}`;
}

/** mailto: link for the secondary email channel. */
export function mailLink(office: Pick<Office, "email">): string {
  return `mailto:${office.email}`;
}

function placeQuery(office: PlaceOffice): string {
  return encodeURIComponent(`${office.address} ${office.city}`);
}

/** Waze navigation to the office address. */
export function wazeLink(office: PlaceOffice): string {
  return `https://waze.com/ul?q=${placeQuery(office)}&navigate=yes`;
}

/** Google Maps search for the office address (no API key). */
export function mapsLink(office: PlaceOffice): string {
  return `https://www.google.com/maps/search/?api=1&query=${placeQuery(office)}`;
}
