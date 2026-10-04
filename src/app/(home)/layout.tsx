import { Header } from "@/components/header/Header";
import { IntroCurtain } from "@/components/hero/IntroCurtain";

/** The landing page frame: intro curtain (first visit), the header over the hero card, then the sections. */
export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <IntroCurtain />
      <Header />
      <main id="content" tabIndex={-1} className="page-frame">
        {children}
      </main>
    </>
  );
}
