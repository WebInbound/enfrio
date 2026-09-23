// Shape of the content registry (src/content/*.ts).
//
// Every visible text / main image of the site is declared here once, with
// the label and group the client sees in the Kiwi panel and a default that
// is the exact text the site shipped with. The registry is the single source
// for three things:
//   1. what the pages render when Kiwi is slow, down or not configured
//      (the default is the fallback);
//   2. the seed of the `web_static_blocks` rows for the Enfrio company
//      (scripts/kiwi-seed-sql.mjs builds the SQL from these files);
//   3. the slug of each block: `${page.id}_${sectionKey}_${blockKey}`.
//
// Files in this folder must stay free of runtime imports (type-only imports
// are fine) so the seed script can load them with plain Node.

export type BlockType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "url"
  | "email"
  | "tel";

export type BlockDef = {
  /** Italian label shown to the client in the Kiwi panel. */
  label: string;
  /** Current text of the site = fallback when Kiwi is unavailable. */
  default: string;
  /** Panel input type. Defaults to "text". */
  type?: BlockType;
};

export type SectionDef = {
  /** Panel group, e.g. "Home › 1. Hero". */
  group: string;
  blocks: Record<string, BlockDef>;
};

export type PageDef = {
  /** Slug prefix, snake_case. */
  id: string;
  sections: Record<string, SectionDef>;
};

/** Resolved content: same keys as the definition, string values. */
export type Content<P extends PageDef> = {
  [S in keyof P["sections"]]: {
    [B in keyof P["sections"][S]["blocks"]]: string;
  };
};
