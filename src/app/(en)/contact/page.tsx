import type { Metadata } from "next";
import ContactPage, { metadata } from "@/views/ContactPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("en");
}

export default function Page() {
  return <ContactPage lang="en" />;
}
