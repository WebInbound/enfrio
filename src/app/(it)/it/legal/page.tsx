import type { Metadata } from "next";
import LegalPage, { metadata } from "@/views/LegalPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <LegalPage lang="it" />;
}
