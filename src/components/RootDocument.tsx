import type { Metadata, Viewport } from "next";
import { Rajdhani, Urbanist } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import { I18nProvider } from "@/components/I18nProvider";
import KiwiEditMount from "@/components/KiwiEditMount";
import MagneticButtons from "@/components/MagneticButtons";
import SmoothScroll from "@/components/SmoothScroll";
import { lines } from "@/lib/content-format";
import { localePath, ogLocale, type Lang } from "@/lib/i18n";
import { isEditing } from "@/lib/kiwi-edit";
import { languageAlternates } from "@/lib/seo";
import { getGlobal, italianPublished } from "@/lib/site-content";
import "@/app/globals.css";

// The <html> document shared by the two root layouts: app/(en)/layout.tsx
// (English, at the root) and app/(it)/layout.tsx (Italian, under /it). Two
// root layouts give each language its own <html lang> with static pages and
// unchanged English URLs (no rewrites, no middleware for visitors).

// Self-hosted via next/font (replaces the render-blocking Google Fonts
// @import that used to sit at the top of globals.css). Exposed as CSS
// variables (--font-urbanist / --font-rajdhani) consumed throughout
// globals.css; display:swap keeps text visible during font load.
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-urbanist",
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-rajdhani",
});

const SITE_URL = process.env.SITE_URL ?? "https://www.enfrio.it";

/**
 * JSON for an inline <script>: company data comes from the Kiwi panel, and
 * a "</script" (or "<!--") in a value must not close the tag. <, >, & and
 * U+2028/2029 become \uXXXX escapes — still the same JSON for any parser.
 * The backslash is built from its char code on purpose: a literal escape
 * sequence here was once silently decoded back to "<" and escaped nothing.
 */
const BACKSLASH = String.fromCharCode(92);
function scriptSafeJson(data: unknown): string {
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (ch) => `${BACKSLASH}u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

export async function rootMetadata(lang: Lang): Promise<Metadata> {
  const g = await getGlobal(lang);
  const { seo, company } = g;
  const bilingual = italianPublished(g);
  // Italian not public yet: its pages are reachable for the proofreading
  // but stay out of search engines.
  const index = lang === "en" || bilingual;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.default_title,
      // Pass-through template: per-page titles already include "Enfrio" so
      // we don't want to double-suffix it. Pages without their own title
      // fall back to `default`.
      template: "%s",
    },
    description: seo.default_description,
    keywords: seo.keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    authors: [{ name: company.name }],
    creator: company.name,
    publisher: company.name,
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: localePath(lang, "/"),
      ...(bilingual ? { languages: languageAlternates("/") } : {}),
    },
    openGraph: {
      type: "website",
      locale: ogLocale(lang),
      siteName: "Enfrio",
      title: seo.default_title,
      description: seo.social_description,
      url: `${SITE_URL}${lang === "en" ? "" : localePath(lang, "/")}`,
      images: [
        {
          url: seo.og_image,
          width: 1536,
          height: 1024,
          alt: seo.og_image_alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.default_title,
      description: seo.social_description,
      images: [seo.og_image],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
  };
}

/* themeColor + html overscroll bg must equal the body's ACTUAL painted
   top — which is much lighter than the #c0c7ce gradient base because the
   body's white radial highlights sit near full strength across the top
   edge on a tall page, brightening it to ~#d3d8de. #c0c7ce / #c9cfd5
   both read as too dark vs the real top. */
export const ROOT_VIEWPORT: Viewport = {
  themeColor: "#d3d8de",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootDocument({
  lang,
  children,
}: Readonly<{
  lang: Lang;
  children: React.ReactNode;
}>) {
  const [{ company, images, a11y }, editing] = await Promise.all([getGlobal(lang), isEditing()]);
  const logo = images.logo.startsWith("/") ? `${SITE_URL}${images.logo}` : images.logo;

  return (
    <html lang={lang} className={`${urbanist.variable} ${rajdhani.variable}`}>
      <body>
        {/* JSON-LD organisation schema — helps search engines understand
            who Enfrio is and surfaces sitelinks / knowledge panels. Company
            data comes from the Kiwi panel ("Globale › Dati aziendali"). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: scriptSafeJson({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: company.name,
              url: SITE_URL,
              logo,
              description: company.description,
              address: {
                "@type": "PostalAddress",
                streetAddress: company.street,
                postalCode: company.postal_code,
                addressLocality: company.city,
                addressRegion: company.province,
                addressCountry: "IT",
              },
              vatID: company.vat,
              email: company.email,
              ...(company.phone.trim() ? { telephone: company.phone.trim() } : {}),
              sameAs: lines(company.social_links).filter((u) => /^https:\/\//i.test(u)),
            }),
          }}
        />
        <I18nProvider lang={lang} a11y={a11y}>
          <SmoothScroll />
          <MagneticButtons />
          {children}
          <BackToTop />
          {/* Kiwi editor only (draft mode + valid edit token): the click-to-edit overlay. */}
          {editing && <KiwiEditMount />}
        </I18nProvider>
      </body>
    </html>
  );
}
