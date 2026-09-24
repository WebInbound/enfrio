import "server-only";
import type { Metadata } from "next";
import { getCollection, getContent, itemImage, itemMeta } from "@/lib/kiwi";
import { pageMetadata } from "@/lib/seo";
import { GLOBAL } from "@/content/global";
import type { CollectionDef, CollectionItemDef } from "@/content/collections";
import type { Content } from "@/content/types";
import { IT_COLLECTIONS } from "@/content/it";
import { IT_SLUG_PREFIX, type Lang } from "@/lib/i18n";

export type GlobalContent = Content<typeof GLOBAL>;

/** Company identity strings, composed once from the "Dati aziendali" blocks. */
export function companyInfo(g: GlobalContent) {
  const c = g.company;
  const cityLine = `${c.postal_code} ${c.city} (${c.province}), ${c.country}`;
  return {
    name: c.name,
    email: c.email,
    vat: c.vat,
    street: c.street,
    cityLine,
    /** "Via Cascina Nuova 27, 13875 Ponderano (BI), Italy" */
    addressLine: `${c.street}, ${cityLine}`,
  };
}

export async function getGlobal(lang: Lang = "en"): Promise<GlobalContent> {
  return getContent(GLOBAL, lang);
}

/**
 * Italian version public: language menu, hreflang, sitemap and indexing.
 * Until then (panel "Globale › Lingue") the /it pages open only by link, for
 * the proofreading (proposal art. 9), and are noindex. Previews always show
 * it, so it can be reviewed before it goes public.
 */
export function italianPublished(g: GlobalContent): boolean {
  return g.i18n.it_published.trim() === "1" || process.env.VERCEL_ENV === "preview";
}

/** Plain text from a collection body (Kiwi stores it as sanitised HTML). */
function plainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Items of a Kiwi collection (photo gallery / project list), mapped to the
 * site's shape. Falls back to the original list when Kiwi is unavailable or
 * the collection is empty; items without a usable image are skipped.
 */
export async function getList(def: CollectionDef, lang: Lang = "en"): Promise<CollectionItemDef[]> {
  // Italian: its own list in the panel ("it_…"), seeded with the translated
  // captions; the original items (translated) while Kiwi has none.
  const slug = lang === "it" ? IT_SLUG_PREFIX + def.slug : def.slug;
  const fallback =
    lang === "it"
      ? def.items.map((it, i) => ({ ...it, ...(IT_COLLECTIONS[def.slug]?.[i] ?? {}) }))
      : def.items;
  return getCollection<CollectionItemDef>(slug, fallback, (item) => {
    const image = itemImage(item);
    if (!image) return null;
    return {
      title: item.title ?? "",
      image,
      alt: itemMeta(item, "alt", ""),
      body: plainText(item.body ?? item.subtitle ?? ""),
    };
  });
}

/** Per-page metadata (canonical + OG/Twitter + languages) from the page's SEO blocks. */
export async function pageSeo(
  path: string,
  seo: { title: string; description: string },
  lang: Lang = "en",
): Promise<Metadata> {
  const g = await getGlobal(lang);
  return pageMetadata({
    path,
    lang,
    bilingual: italianPublished(g),
    title: seo.title,
    description: seo.description,
    image: g.seo.og_image,
    imageAlt: g.seo.og_image_alt,
  });
}
