import type { Metadata } from "next";
import HomePage, { metadata } from "@/views/HomePage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <HomePage lang="it" />;
}
