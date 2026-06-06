import type { Metadata, Viewport } from "next";
import BackToTop from "@/components/BackToTop";
import MagneticButtons from "@/components/MagneticButtons";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const SITE_URL = process.env.SITE_URL ?? "https://www.enfrio.it";
const OG_IMAGE = "/assets/images/site/hero-main.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Enfrio | Cooling Engineered to Perform",
    // Pass-through template: per-page titles already include "Enfrio" so
    // we don't want to double-suffix it. Pages without their own title
    // fall back to `default`.
    template: "%s",
  },
  description:
    "Enfrio designs and manufactures aluminium engine cooling systems for power generation and datacenter applications — 5P delivery model from concept to serial production.",
  keywords: [
    "engine cooling",
    "power generation cooling",
    "datacenter cooling",
    "M Tower",
    "modular heat rejection",
    "aluminium radiators",
    "Enfrio",
  ],
  authors: [{ name: "Enfrio Srl" }],
  creator: "Enfrio Srl",
  publisher: "Enfrio Srl",
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
    title: "Enfrio | Cooling Engineered to Perform",
    description:
      "Aluminium engine cooling systems for power generation and datacenter — modular, scalable, mission-critical.",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1536,
        height: 1024,
        alt: "Enfrio — engineering aluminium cooling systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enfrio | Cooling Engineered to Perform",
    description:
      "Aluminium engine cooling systems for power generation and datacenter — modular, scalable, mission-critical.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* JSON-LD organisation schema — helps search engines understand
            who Enfrio is and surfaces sitelinks / knowledge panels. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Enfrio Srl",
              url: SITE_URL,
              logo: `${SITE_URL}/assets/images/logo-enfrio.png`,
              description:
                "Italian manufacturer of aluminium engine cooling systems for power generation and datacenter applications.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Cascina Nuova 27",
                postalCode: "13875",
                addressLocality: "Ponderano",
                addressRegion: "BI",
                addressCountry: "IT",
              },
              vatID: "IT02553940020",
              email: "info@enfrio.eu",
              sameAs: [],
            }),
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
