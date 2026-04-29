import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio | Privacy & Cookies",
  description: "Privacy and cookies information for Enfrio website visitors.",
};

export default function LegalPage() {
  return (
    <SiteShell active="legal">
      <section className="page-hero">
        <div className="page-hero-text reveal">
          <p className="kicker">LEGAL</p>
          <h1>Privacy &amp; Cookies</h1>
          <p className="lead">Information on how Enfrio Srl handles personal data collected through this website. The full GDPR-compliant policy is being finalised with our legal advisor and will replace this summary.</p>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="card reveal"><h3>Data Controller</h3><p>Enfrio Srl, Via Cascina Nuova 27, 13875 Ponderano (BI), Italy. VAT: IT02553940020.</p></article>
          <article className="card reveal"><h3>Contact for Data Requests</h3><p><a href="mailto:info@enfrio.eu">info@enfrio.eu</a></p></article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">PROCESSING SCOPE</p>
          <h2>What we collect and why.</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Browsing data</h3>
            <p>Standard server logs (IP address, user agent, requested resource) retained for security and analytics. No tracking cookies are set without explicit consent.</p>
          </article>
          <article className="panel reveal">
            <h3>Contact requests</h3>
            <p>Email addresses and information you voluntarily share through the contact channel are used only to reply to your request and are not transferred to third parties for marketing purposes.</p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
