import "server-only";
import type { Metadata } from "next";
import { getCollection, getContent, itemImage, itemMeta } from "@/lib/kiwi";
import { pageMetadata } from "@/lib/seo";
import { GLOBAL } from "@/content/global";
import type { CollectionDef, CollectionItemDef } from "@/content/collections";
import type { Content } from "@/content/types";

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

export async function getGlobal(): Promise<GlobalContent> {
  return getContent(GLOBAL);
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
export async function getList(def: CollectionDef): Promise<CollectionItemDef[]> {
  return getCollection<CollectionItemDef>(def.slug, def.items, (item) => {
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

/** Per-page metadata (canonical + OG/Twitter) from the page's SEO blocks. */
export async function pageSeo(path: string, seo: { title: string; description: string }): Promise<Metadata> {
  const g = await getGlobal();
  return pageMetadata({
    path,
    title: seo.title,
    description: seo.description,
    image: g.seo.og_image,
    imageAlt: g.seo.og_image_alt,
  });
}
