import type { PropsWithChildren } from "react";
import SiteShellClient, { type NavKey, type ShellContent } from "@/components/SiteShellClient";
import { companyInfo, getGlobal } from "@/lib/site-content";

/**
 * Server wrapper of the site chrome (menu + footer): resolves the shell
 * texts from the Kiwi panel and hands them to the interactive client shell.
 * Pages keep using <SiteShell active="...">.
 */
export default async function SiteShell({ active, children }: PropsWithChildren<{ active: NavKey }>) {
  const g = await getGlobal();
  const co = companyInfo(g);

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
    <SiteShellClient active={active} content={content}>
      {children}
    </SiteShellClient>
  );
}
