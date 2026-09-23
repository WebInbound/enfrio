import type { Metadata, Viewport } from "next";
import { Rajdhani, Urbanist } from "next/font/google";
import BackToTop from "@/components/BackToTop";
import MagneticButtons from "@/components/MagneticButtons";
import SmoothScroll from "@/components/SmoothScroll";
import { lines } from "@/lib/content-format";
import { getGlobal } from "@/lib/site-content";
import "./globals.css";

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

// Pages are static and are refreshed by the Kiwi panel through
// /api/revalidate. This periodic regeneration only retries content that
// could not be read from Kiwi (every other read is a cache hit).
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const g = await getGlobal();
  const { seo, company } = g;
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
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Enfrio",
      title: seo.default_title,
      description: seo.social_description,
      url: SITE_URL,
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
export const viewport: Viewport = {
  themeColor: "#d3d8de",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { company, images } = await getGlobal();
  const logo = images.logo.startsWith("/") ? `${SITE_URL}${images.logo}` : images.logo;

  return (
    <html lang="en" className={`${urbanist.variable} ${rajdhani.variable}`}>
      <body>
        {/* JSON-LD organisation schema — helps search engines understand
            who Enfrio is and surfaces sitelinks / knowledge panels. Company
            data comes from the Kiwi panel ("Globale › Dati aziendali"). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }).replace(/</g, "\u003c"),
          }}
        />
        <SmoothScroll />
        <MagneticButtons />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
