import type { PropsWithChildren } from "react";
import KiwiHiddenFieldsMount from "@/components/KiwiHiddenFieldsMount";
import SiteShellClient, { type NavKey, type ShellContent } from "@/components/SiteShellClient";
import { getEditForClient, getEditorFields, isEditing } from "@/lib/kiwi-edit";
import { companyInfo, getGlobal } from "@/lib/site-content";
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

/**
 * Server wrapper of the site chrome (menu + footer): resolves the shell
 * texts from the Kiwi panel and hands them to the interactive client shell.
 * Pages keep using <SiteShell active="...">. Inside the Kiwi editor it also
 * adds the edit markers and the "other texts" panel (`blocks` overrides the
 * page's block list, e.g. for the 404 page).
 */
export default async function SiteShell({
  active,
  blocks,
  children,
}: PropsWithChildren<{ active: NavKey; blocks?: PageDef[] }>) {
  const [g, edit, editing] = await Promise.all([getGlobal(), getEditForClient(GLOBAL), isEditing()]);
  const co = companyInfo(g);
  const fields = editing ? await getEditorFields([...(blocks ?? PAGE_BLOCKS[active]), GLOBAL]) : null;

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
      <SiteShellClient active={active} content={content} edit={edit} editing={editing || undefined}>
        {children}
      </SiteShellClient>
      {fields && <KiwiHiddenFieldsMount fields={fields} />}
    </>
  );
}
