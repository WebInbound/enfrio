import type { Metadata } from "next";
import ProjectsPage, { metadata } from "@/views/ProjectsPage";

export function generateMetadata(): Promise<Metadata> {
  return metadata("en");
}

export default function Page() {
  return <ProjectsPage lang="en" />;
}
