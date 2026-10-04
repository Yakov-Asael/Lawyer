import type { LegalContact } from "@content/data";
import { site } from "@content/data";
import { mailLink, telLink } from "@/lib/contact-links";

/** The contact block closing a legal page (e.g. the accessibility coordinator). Phone and email are live links. */
export function LegalContactCard({ contact }: { contact: LegalContact }) {
  const labels = site.legal.contactLabels;
  const rows = [
    { label: labels.phone, value: contact.phoneDisplay, href: telLink(contact), ltr: true },
    { label: labels.email, value: contact.email, href: mailLink(contact), ltr: true },
    ...(contact.address ? [{ label: labels.address, value: contact.address }] : []),
  ];

  return (
    <div className="mt-7 max-w-[34rem] rounded-lg border border-bark bg-paper px-6 py-5 shadow-file">
      <p className="font-serif text-[1.2rem] font-bold text-ink">{contact.name}</p>
      <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2.5 text-[16px]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-muted">{row.label}</dt>
            <dd className="min-w-0 break-words">
              {"href" in row && row.href ? (
                <a
                  href={row.href}
                  dir={row.ltr ? "ltr" : undefined}
                  className="text-ink underline decoration-bark underline-offset-[5px] transition-colors hover:decoration-brass-deep"
                >
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
