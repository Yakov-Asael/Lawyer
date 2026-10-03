/**
 * The in-page hash a link points to, or null. Both "#faq" and "/#faq" (footer links that must also work from other
 * pages) count when they target the current page.
 */
export function inPageHash(href: string, current: Pick<Location, "href" | "origin" | "pathname">): string | null {
  if (href.startsWith("#")) return href;
  const url = new URL(href, current.href);
  if (url.origin !== current.origin || url.pathname !== current.pathname || !url.hash) return null;
  return url.hash;
}
