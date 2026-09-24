import type { Metadata } from "next";
import CompanyPage, { metadata } from "@/views/CompanyPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("en");
}

export default function Page() {
  return <CompanyPage lang="en" />;
}
