import type { Metadata } from "next";
import ContactPage, { metadata } from "@/views/ContactPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("it");
}

export default function Page() {
  return <ContactPage lang="it" />;
}
