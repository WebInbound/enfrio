import type { Metadata } from "next";
import IndustriesPage, { metadata } from "@/views/IndustriesPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <IndustriesPage lang="it" />;
}
