import type { Metadata } from "next";
import { localePath, ogLocale, type Lang } from "@/lib/i18n";

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

/** hreflang alternates of an English path: English, Italian, x-default (English). */
export function languageAlternates(path: string): Record<string, string> {
  return { en: path, it: localePath("it", path), "x-default": path };
}

export function pageMetadata({
  path,
  lang = "en",
  bilingual = false,
  title,
  description,
  image = OG_IMAGE,
  imageAlt = OG_ALT,
}: {
  /** English path ("/tower-m"); the Italian one is derived. */
  path: string;
  lang?: Lang;
  /** Italian version public: add the hreflang alternates. */
  bilingual?: boolean;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const url = localePath(lang, path);
  return {
    title,
    description,
    alternates: { canonical: url, ...(bilingual ? { languages: languageAlternates(path) } : {}) },
    openGraph: {
      type: "website",
      siteName: "Enfrio",
      locale: ogLocale(lang),
      url,
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
