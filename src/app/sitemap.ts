import type { MetadataRoute } from "next";
import { localePath } from "@/lib/i18n";
import { languageAlternates } from "@/lib/seo";
import { getGlobal, italianPublished } from "@/lib/site-content";

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

const absolute = (languages: Record<string, string>) =>
  Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, `${SITE_URL}${v === "/" ? "" : v}`]));

// The Italian pages (and the hreflang pairs) are listed only once the Italian
// version is public (panel "Globale › Lingue").
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date("2026-05-29");
  const bilingual = italianPublished(await getGlobal());
  return ROUTES.flatMap(({ path, priority, changeFrequency }) => {
    const en = {
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    };
    if (!bilingual) return [en];
    const alternates = { languages: absolute(languageAlternates(path)) };
    return [
      { ...en, alternates },
      { ...en, url: `${SITE_URL}${localePath("it", path)}`, alternates },
    ];
  });
}
