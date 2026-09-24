import type { Metadata, Viewport } from "next";
import RootDocument, { ROOT_VIEWPORT, rootMetadata } from "@/components/RootDocument";
import NotFoundPage, { metadata } from "@/views/NotFoundPage";

// The 404 of every unknown URL (English and /it). With two root layouts
// (app/(en), app/(it)) Next needs an app-wide not-found that brings its own
// document: same RootDocument and page as before the Italian version, so the
// 404 stays a static page with the site's menu and footer. Italian URLs get
// the English 404 (it links back to the home page).

export const viewport: Viewport = ROOT_VIEWPORT;

// As a normal 404 did: the site's metadata, then the page's own on top.
export async function generateMetadata(): Promise<Metadata> {
  const [root, page] = await Promise.all([rootMetadata("en"), metadata("en")]);
  return { ...root, ...page };
}

export default function GlobalNotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundPage lang="en" />
    </RootDocument>
  );
}
