import { site } from "@content";
import * as links from "./contact-links";

/** Contact links bound to the office content. Components use these, never build URLs themselves. */
export const waLink = (topic?: string) => links.waLink(site.office, site.whatsapp, topic);
export const telLink = () => links.telLink(site.office);
export const mailLink = () => links.mailLink(site.office);
export const wazeLink = () => links.wazeLink(site.office);
export const mapsLink = () => links.mapsLink(site.office);
