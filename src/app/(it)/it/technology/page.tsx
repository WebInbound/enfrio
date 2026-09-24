import type { Metadata } from "next";
import TechnologyPage, { metadata } from "@/views/TechnologyPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <TechnologyPage lang="it" />;
}
