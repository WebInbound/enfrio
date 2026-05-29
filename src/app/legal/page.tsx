import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio | Privacy & Cookies",
  description:
    "How Enfrio Srl handles personal data collected through this website, in line with the EU General Data Protection Regulation (GDPR).",
};

const LAST_UPDATED = "29 May 2026";

export default function LegalPage() {
  return (
    <SiteShell active="legal">
      <section className="page-hero">
        <div className="page-hero-text reveal">
          <p className="kicker">LEGAL</p>
          <h1>Privacy &amp; Cookies.</h1>
          <p className="lead">
            How Enfrio Srl handles personal data collected through this website,
            in line with EU Regulation 2016/679 (GDPR) and Italian Legislative
            Decree 196/2003 as amended. Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="card reveal">
            <h3>Data Controller</h3>
            <p>
              <strong>Enfrio Srl</strong>
              <br />
              Via Cascina Nuova 27
              <br />
              13875 Ponderano (BI), Italy
              <br />
              VAT: IT02553940020
            </p>
          </article>
          <article className="card reveal">
            <h3>Contact for data requests</h3>
            <p>
              For any question about how we process your data, or to exercise
              the rights described below, write to{" "}
              <a href="mailto:info@enfrio.eu">info@enfrio.eu</a>.
            </p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">WHAT WE COLLECT</p>
          <h2>The categories of personal data we may process.</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Browsing data</h3>
            <p>
              Server logs collected automatically when you visit the site: IP
              address, user agent, referrer, requested resource, timestamp.
              Retained for security analysis and aggregate traffic statistics.
            </p>
          </article>
          <article className="panel reveal">
            <h3>Contact and inquiry data</h3>
            <p>
              When you submit the contact form: name, company, work email,
              phone (optional), project scope, timeline and the message body.
              You provide this information voluntarily to enable us to reply
              to your request.
            </p>
          </article>
          <article className="panel reveal">
            <h3>Configuration data</h3>
            <p>
              The M Tower sizing simulator runs entirely in your browser. The
              values you enter (engine power, ambient, altitude, redundancy)
              are not transmitted to Enfrio unless you explicitly send them
              through the contact form.
            </p>
          </article>
          <article className="panel reveal">
            <h3>Cookies and similar technologies</h3>
            <p>
              The site uses only technical cookies strictly necessary for
              navigation. We do not use profiling cookies, advertising cookies
              or third-party analytics that track you across other websites.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">WHY WE PROCESS IT</p>
          <h2>Purposes and lawful basis under Article 6 GDPR.</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3>Reply to your inquiry</h3>
            <p>
              Information you submit through the contact form is used solely
              to evaluate and reply to your request.
            </p>
            <p className="micro-note">
              Lawful basis: pre-contractual measures and our legitimate
              interest in conducting commercial dialogue (Art. 6.1.b / 6.1.f).
            </p>
          </article>
          <article className="card reveal">
            <h3>Maintain the website</h3>
            <p>
              Server logs are used to ensure the site is reachable, to
              investigate abuse and to compile aggregate statistics.
            </p>
            <p className="micro-note">
              Lawful basis: our legitimate interest in security and continuity
              of service (Art. 6.1.f).
            </p>
          </article>
          <article className="card reveal">
            <h3>Comply with the law</h3>
            <p>
              Where applicable, we retain data to meet tax, accounting or
              regulatory obligations.
            </p>
            <p className="micro-note">
              Lawful basis: legal obligation (Art. 6.1.c).
            </p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">RECIPIENTS</p>
          <h2>Who can access your data, and where it is stored.</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Internal recipients</h3>
            <p>
              Enfrio personnel involved in commercial follow-up, engineering
              evaluation and IT operations, each acting within their assigned
              authorization.
            </p>
          </article>
          <article className="panel reveal">
            <h3>Processors and sub-processors</h3>
            <p>
              We rely on infrastructure providers acting as data processors
              under Article 28 GDPR:
            </p>
            <ul className="checks">
              <li>
                <strong>Vercel Inc.</strong> — hosting and content delivery
                for this website (EU data regions where available).
              </li>
              <li>
                <strong>FormSubmit (Activated Studio LLC)</strong> — email
                relay for contact form submissions.
              </li>
              <li>
                <strong>Email service provider</strong> — delivery of replies
                to the address you supply.
              </li>
            </ul>
            <p className="micro-note">
              Where a processor operates outside the EEA, transfers are
              covered by Standard Contractual Clauses or equivalent
              safeguards under Chapter V GDPR.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">RETENTION</p>
          <h2>How long we keep your data.</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3>Server logs</h3>
            <p>
              Retained for up to <strong>12 months</strong> for security and
              traffic analysis, then automatically deleted.
            </p>
          </article>
          <article className="card reveal">
            <h3>Contact-form data</h3>
            <p>
              Retained for the time necessary to handle your inquiry, plus up
              to <strong>24 months</strong> for follow-up purposes — unless
              you ask us to delete it earlier.
            </p>
          </article>
          <article className="card reveal">
            <h3>Contractual / fiscal records</h3>
            <p>
              Where an inquiry results in a contract, related data is kept
              for the retention periods required by Italian commercial and
              fiscal law (generally <strong>10 years</strong>).
            </p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">YOUR RIGHTS</p>
          <h2>What you can ask us to do (Articles 15–22 GDPR).</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Information rights</h3>
            <ul className="checks">
              <li>Access the personal data we hold about you</li>
              <li>Receive it in a structured, portable format</li>
              <li>Know the purposes, recipients and retention periods</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>Control rights</h3>
            <ul className="checks">
              <li>Have inaccurate or incomplete data corrected</li>
              <li>Request erasure where the conditions of Art. 17 apply</li>
              <li>Request restriction of processing where Art. 18 applies</li>
              <li>Object to processing carried out on legitimate-interest grounds</li>
              <li>
                Lodge a complaint with the Italian Data Protection Authority
                (<em>Garante per la protezione dei dati personali</em>) — see{" "}
                <a
                  href="https://www.garanteprivacy.it"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  garanteprivacy.it
                </a>
              </li>
            </ul>
          </article>
        </div>
        <div className="card reveal" style={{ marginTop: 24 }}>
          <h3>How to exercise your rights</h3>
          <p>
            Send a request to <a href="mailto:info@enfrio.eu">info@enfrio.eu</a>.
            We will reply within one month and, where the request is
            complex, may extend the reply by a further two months while
            keeping you informed. We will not charge a fee for legitimate
            requests.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">COOKIES</p>
          <h2>What runs in your browser when you visit this site.</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Technical cookies (always on)</h3>
            <p>
              Strictly necessary for the site to function — for example to
              preserve your menu state and to identify your session for the
              duration of a visit. These do not require consent under Art.
              122 of the Italian Privacy Code.
            </p>
          </article>
          <article className="panel reveal">
            <h3>Analytical / marketing cookies</h3>
            <p>
              The site does <strong>not</strong> set third-party analytical
              or marketing cookies. No advertising network, social plug-in or
              cross-site tracking pixel is loaded. If we introduce any in the
              future, we will request explicit consent through a cookie
              banner and update this policy first.
            </p>
          </article>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">QUESTIONS?</p>
        <h2>Reach out to the Enfrio team.</h2>
        <p>
          For privacy questions or to exercise any of the rights above, write
          to <a href="mailto:info@enfrio.eu">info@enfrio.eu</a>. For general
          inquiries please use the contact form.
        </p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">
            Open the contact form
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="card reveal" style={{ textAlign: "center" }}>
          <p className="micro-note">
            This policy is published by Enfrio Srl and reviewed periodically.
            Substantive updates will be reflected in the &ldquo;Last
            updated&rdquo; date above and, where appropriate, communicated
            through this page.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
