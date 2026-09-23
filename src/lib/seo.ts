import type { Metadata } from "next";

// Shared per-page metadata builder. Next.js merges metadata SHALLOWLY, so a
// page that declares its own `openGraph` would otherwise drop the root
// og:image / siteName entirely. This helper rebuilds the full OG + Twitter
// block per page (with a unique canonical) so every route is self-describing
// for search engines and social cards. The home page keeps the root metadata
// in layout.tsx (canonical "/").
//
// Title, description and the social image come from the Kiwi panel ("SEO"
// group); see pageSeo() in src/lib/site-content.ts.
const OG_IMAGE = "/assets/images/site/hero-main.jpg";
const OG_ALT = "Enfrio — engineering aluminium cooling systems";

export function pageMetadata({
  path,
  title,
  description,
  image = OG_IMAGE,
  imageAlt = OG_ALT,
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
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
      images: [{ url: image, width: 1536, height: 1024, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
