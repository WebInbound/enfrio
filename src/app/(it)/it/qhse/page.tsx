import type { Metadata } from "next";
import QhsePage, { metadata } from "@/views/QhsePage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <QhsePage lang="it" />;
}
