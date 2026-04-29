import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Contact Enfrio | Start Your Cooling Project",
  description: "Contact Enfrio to discuss engine cooling projects, technical requirements and production transfer plans.",
};

export default function ContactPage() {
  return (
    <SiteShell active="contact">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">CONTACT</p>
          <h1>Turn your cooling challenge into an execution-ready plan.</h1>
          <p>Share platform data, thermal targets and timeline. Enfrio can support from concept engineering to full production transfer.</p>
          <div className="btn-row">
            <a
              className="btn solid"
              href="mailto:info@enfrio.eu?subject=Executive%20Brief%20Request%20-%20Enfrio&body=Company%3A%0AProject%20scope%3A%0ATimeline%3A%0AIndustry%3A%0A"
              title="Opens your email app with a prefilled executive brief template"
            >
              Send executive brief
            </a>
            <Link className="btn ghost" href="/solutions">Explore solutions</Link>
            <p className="micro-note">If the button does not open your mail app, write directly to <a href="mailto:info@enfrio.eu">info@enfrio.eu</a>.</p>
          </div>
        </div>
        <figure className="page-hero-media reveal">
          <Image className="focus-right" src="/assets/images/site/quality-hexagon-b.jpg" alt="Quality check detail" width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="contact-grid grid-3">
          <article className="contact-item reveal">
            <h3>Project Scope</h3>
            <p>Engine model, power class, heat rejection targets and installation constraints.</p>
          </article>
          <article className="contact-item reveal">
            <h3>Timeline</h3>
            <p>Prototype, validation and start-of-production milestones.</p>
          </article>
          <article className="contact-item reveal">
            <h3>Support Needed</h3>
            <p>Design engineering, process definition, procurement, transfer or full 5P execution.</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="grid-2">
          <article className="info reveal">
            <p className="kicker">COMMERCIAL</p>
            <h3>Business inquiries</h3>
            <p>For quotations and partnerships:</p>
            <p><a href="mailto:info@enfrio.eu" aria-label="Send email to info@enfrio.eu">info@enfrio.eu</a></p>
          </article>
          <article className="info reveal">
            <p className="kicker">DOCUMENTS</p>
            <h3>Quality credentials</h3>
            <p>Download official certification for vendor qualification flow.</p>
            <div className="btn-row">
              <a className="btn solid" href="/assets/certificazioneiso.pdf" target="_blank" rel="noopener noreferrer">Download ISO Certificate</a>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
