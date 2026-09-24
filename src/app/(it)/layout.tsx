import type { Metadata, Viewport } from "next";
import RootDocument, { ROOT_VIEWPORT, rootMetadata } from "@/components/RootDocument";

// Root layout of the Italian site (URLs under /it); the document is
// shared with the other language (src/components/RootDocument.tsx).

// Pages are static and are refreshed by the Kiwi panel through
// /api/revalidate. The periodic regeneration only retries content that
// could not be read from Kiwi and replaces, within a minute, a deploy built
// from an older build cache (every other read is a cache hit, no Kiwi call).
export const revalidate = 60;

export const viewport: Viewport = ROOT_VIEWPORT;

export function generateMetadata(): Promise<Metadata> {
  return rootMetadata("it");
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="it">{children}</RootDocument>;
}
