import type { Metadata } from "next";
import TowerMPage, { metadata } from "@/views/TowerMPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <TowerMPage lang="it" />;
}
