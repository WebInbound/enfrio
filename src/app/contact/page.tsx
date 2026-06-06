import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact Enfrio | Start Your Cooling Project",
  description: "Contact Enfrio to discuss engine cooling projects, technical requirements and production transfer plans.",
});

export default function ContactPage() {
  return (
    <SiteShell active="contact">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">CONTACT</p>
          <h1>Turn your cooling challenge into an execution-ready plan.</h1>
          <p>Share platform data, thermal targets and timeline. Enfrio can support from concept engineering to full production transfer.</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-right" src="/assets/images/site/quality-hexagon-b.jpg" alt="Quality check detail" width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="contact-layout">
          <div className="contact-form-wrap reveal">
            <p className="kicker">PROJECT INQUIRY</p>
            <h2>Tell us about your platform.</h2>
            <p>Fill in the form and an Enfrio engineer will reply within one business day. For procurement documentation requests please mention it in the message field.</p>
            <Suspense fallback={<p className="micro-note">Loading form...</p>}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="contact-side reveal">
            <article className="contact-side-card">
              <h3>Direct contact</h3>
              <p>Prefer to write to us directly?</p>
              <p><a href="mailto:info@enfrio.eu" aria-label="Send email to info@enfrio.eu">info@enfrio.eu</a></p>
            </article>
            <article className="contact-side-card">
              <h3>Headquarters</h3>
              <p>Via Cascina Nuova 27<br />13875 Ponderano (BI), Italy</p>
              <p>VAT: IT02553940020</p>
            </article>
            <article className="contact-side-card">
              <h3>What to share</h3>
              <ul className="checks">
                <li>Engine model and power class</li>
                <li>Heat rejection target (kW)</li>
                <li>Installation context and constraints</li>
                <li>Prototype / start-of-production milestones</li>
              </ul>
            </article>
            <article className="contact-side-card">
              <h3>Quality credentials</h3>
              <p>Certification document for vendor qualification:</p>
              <p><a className="btn solid" href="/assets/certificazioneiso.pdf" target="_blank" rel="noopener noreferrer">Download ISO Certificate</a></p>
            </article>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
