import type { PropsWithChildren } from "react";
import KiwiHiddenFieldsMount from "@/components/KiwiHiddenFieldsMount";
import SiteShellClient, { type NavKey, type ShellContent, type ShellLanguages } from "@/components/SiteShellClient";
import { localePath, type Lang } from "@/lib/i18n";
import { getEditForClient, getEditorFields, isEditing } from "@/lib/kiwi-edit";
import { companyInfo, getGlobal, italianPublished } from "@/lib/site-content";
import { COMPANY } from "@/content/company";
import { CONTACT, CONTACT_FORM } from "@/content/contact";
import { GLOBAL } from "@/content/global";
import { HOME } from "@/content/home";
import { INDUSTRIES } from "@/content/industries";
import { LEGAL } from "@/content/legal";
import { PROJECTS_PAGE } from "@/content/projects";
import { QHSE } from "@/content/qhse";
import { SOLUTIONS } from "@/content/solutions";
import { TECHNOLOGY } from "@/content/technology";
import { QUOTE, SIZER, TOWER_M } from "@/content/tower-m";
import type { PageDef } from "@/content/types";

/** Blocks listed in the Kiwi editor's "other texts" panel, per page. */
const PAGE_BLOCKS: Record<NavKey, PageDef[]> = {
  home: [HOME],
  solutions: [SOLUTIONS],
  technology: [TECHNOLOGY],
  "tower-m": [TOWER_M, SIZER, QUOTE],
  industries: [INDUSTRIES],
  projects: [PROJECTS_PAGE],
  company: [COMPANY],
  contact: [CONTACT, CONTACT_FORM],
  legal: [LEGAL],
  qhse: [QHSE],
};

/** English path of each page (the language menu links to the same page). */
const PAGE_PATH: Record<NavKey, string> = {
  home: "/",
  solutions: "/solutions",
  technology: "/technology",
  "tower-m": "/tower-m",
  industries: "/industries",
  projects: "/projects",
  company: "/company",
  contact: "/contact",
  legal: "/legal",
  qhse: "/qhse",
};

/**
 * Server wrapper of the site chrome (menu + footer): resolves the shell
 * texts from the Kiwi panel and hands them to the interactive client shell.
 * Pages keep using <SiteShell active="...">. Inside the Kiwi editor it also
 * adds the edit markers and the "other texts" panel (`blocks` overrides the
 * page's block list, e.g. for the 404 page).
 */
export default async function SiteShell({
  lang = "en",
  active,
  blocks,
  children,
}: PropsWithChildren<{ lang?: Lang; active: NavKey; blocks?: PageDef[] }>) {
  const [g, edit, editing] = await Promise.all([getGlobal(lang), getEditForClient(GLOBAL, lang), isEditing()]);
  const co = companyInfo(g);
  const fields = editing ? await getEditorFields([...(blocks ?? PAGE_BLOCKS[active]), GLOBAL], lang) : null;

  // Language menu only once the Italian version is public (panel "Globale ›
  // Lingue"): until then the English pages are exactly as before. Inside the
  // Kiwi editor it is always there, so the Italian texts can be proofread.
  const path = PAGE_PATH[active];
  const languages: ShellLanguages | null = italianPublished(g) || editing
    ? {
        label: g.i18n.switch_label,
        items: [
          { lang: "en", label: g.i18n.switch_en, href: localePath("en", path) },
          { lang: "it", label: g.i18n.switch_it, href: localePath("it", path) },
        ],
      }
    : null;

  const content: ShellContent = {
    nav: {
      home: g.nav.home,
      solutions: g.nav.solutions,
      technology: g.nav.technology,
      "tower-m": g.nav.tower_m,
      industries: g.nav.industries,
      projects: g.nav.projects,
      company: g.nav.company,
      contact: g.nav.contact,
    },
    logo: g.images.logo,
    logoAlt: g.images.logo_alt,
    footer: {
      companyName: co.name,
      tagline: g.footer.tagline,
      hqTitle: g.footer.hq_title,
      address: co.addressLine,
      vatLine: `${g.company.vat_label} ${co.vat}`,
      contactTitle: g.footer.contact_title,
      email: co.email,
      contactLink: g.footer.contact_link,
      complianceTitle: g.footer.compliance_title,
      isoUrl: g.documents.iso_certificate_url,
      isoLink: g.footer.iso_link,
      privacyLink: g.footer.privacy_link,
      qhseLink: g.footer.qhse_link,
      copyright: g.footer.copyright,
    },
  };

  return (
    <>
      <SiteShellClient
        lang={lang}
        languages={languages}
        active={active}
        content={content}
        edit={edit}
        editing={editing || undefined}
      >
        {children}
      </SiteShellClient>
      {fields && <KiwiHiddenFieldsMount fields={fields} />}
    </>
  );
}
