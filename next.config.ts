import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML rewrites removed: every route is now served by its own
  // Next.js page component under src/app/<route>/page.tsx.
  images: {
    // Serve AVIF when supported, fall back to WebP, fall back to source.
    // On hero photos this typically cuts payload 40-60% vs JPG.
    formats: ["image/avif", "image/webp"],
    // The site's `next/image` callers commonly hit these widths through
    // .focus-* / cluster classes. Pre-bake the breakpoints.
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Images replaced from the Kiwi panel live in the Kiwi Supabase storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qvswzthlruowjjlxioas.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // The quote request (server action of /tower-m) builds the PDF summary on
  // the server: brand fonts and the default logo/render must travel with the
  // function (public/ is served by the CDN, not bundled).
  outputFileTracingIncludes: {
    "/tower-m": [
      "./src/assets/pdf/*.ttf",
      "./public/assets/images/logo-enfrio.png",
      "./public/assets/images/site/mtower-render.png",
    ],
  },
  // Strict mode catches double-effects and cleanup bugs during dev.
  reactStrictMode: true,
  // Powered-By header leaks the framework; not a security risk but no
  // reason to advertise either.
  poweredByHeader: false,
};

export default nextConfig;
