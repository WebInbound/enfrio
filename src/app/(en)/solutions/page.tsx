import type { Metadata } from "next";
import SolutionsPage, { metadata } from "@/views/SolutionsPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("en");
}

export default function Page() {
  return <SolutionsPage lang="en" />;
}
