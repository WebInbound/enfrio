import type { Metadata } from "next";

// Shared per-page metadata builder. Next.js merges metadata SHALLOWLY, so a
// page that declares its own `openGraph` would otherwise drop the root
// og:image / siteName entirely. This helper rebuilds the full OG + Twitter
// block per page (with a unique canonical) so every route is self-describing
// for search engines and social cards. The home page keeps the root metadata
// in layout.tsx (canonical "/").
const OG_IMAGE = "/assets/images/site/hero-main.jpg";
const OG_ALT = "Enfrio — engineering aluminium cooling systems";

export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Enfrio",
      locale: "en_US",
      url: path,
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1536, height: 1024, alt: OG_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
