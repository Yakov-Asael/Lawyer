import type { Metadata } from "next";
import { LEGAL_PATHS, legalPage } from "@content";
import { LegalDocument } from "@/components/legal/LegalDocument";

const page = legalPage("privacy");

export const metadata: Metadata = {
  title: page.title,
  alternates: { canonical: LEGAL_PATHS.privacy },
};

export default function Page() {
  return <LegalDocument page={page} />;
}
