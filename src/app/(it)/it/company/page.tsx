import type { Metadata } from "next";
import CompanyPage, { metadata } from "@/views/CompanyPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <CompanyPage lang="it" />;
}
