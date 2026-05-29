import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL ?? "https://www.enfrio.it";

const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/tower-m", priority: 0.95, changeFrequency: "monthly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/industries", priority: 0.85, changeFrequency: "monthly" },
  { path: "/technology", priority: 0.85, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
  { path: "/company", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/qhse", priority: 0.4, changeFrequency: "yearly" },
  { path: "/legal", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-05-29");
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
