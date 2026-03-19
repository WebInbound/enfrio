import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/solutions", destination: "/solutions.html" },
      { source: "/technology", destination: "/technology.html" },
      { source: "/industries", destination: "/industries.html" },
      { source: "/company", destination: "/company.html" },
      { source: "/contact", destination: "/contact.html" },
      { source: "/services", destination: "/services.html" },
      { source: "/case-studies", destination: "/case-studies.html" },
      { source: "/tower-m", destination: "/tower-m.html" },
      { source: "/legal", destination: "/legal.html" }
    ];
  }
};

export default nextConfig;
