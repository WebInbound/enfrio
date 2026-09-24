import type { Metadata } from "next";
import TechnologyPage, { metadata } from "@/views/TechnologyPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("en");
}

export default function Page() {
  return <TechnologyPage lang="en" />;
}
