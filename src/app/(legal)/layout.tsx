import { LegalHeader } from "@/components/legal/LegalHeader";

/** Legal pages (specs 16, 17): slim header, no intro curtain, no scroll animations. */
export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <LegalHeader />
      <main id="content" tabIndex={-1} className="page-frame">
        {children}
      </main>
    </>
  );
}
