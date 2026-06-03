import type { Metadata, Viewport } from "next";
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
        width: 1200,
        height: 900,
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

/* themeColor tints iOS Safari's address-bar to match the body's TOP.
   The body has white radial highlights overlaid on a #c0c7ce base, so
   the actual painted top is brighter than #c0c7ce — averaging the
   radial influence at the corners lands around #c9cfd5. Using that
   makes the chrome bar visually disappear into the page. */
export const viewport: Viewport = {
  themeColor: "#c9cfd5",
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
      </body>
    </html>
  );
}
