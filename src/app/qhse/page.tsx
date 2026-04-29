import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio | QHSE Policy",
  description: "Enfrio Quality, Health, Safety and Environment policy aligned with ISO certification requirements for engine cooling manufacturing.",
};

export default function QhsePage() {
  return (
    <SiteShell active="qhse">
      <section className="page-hero">
        <div className="page-hero-text reveal">
          <p className="kicker">QHSE POLICY</p>
          <h1>Quality, Health, Safety and Environment.</h1>
          <p className="lead">Enfrio Srl operates an integrated QHSE management system aligned with ISO certification requirements. This policy commits the organization to product quality, workplace safety and environmental responsibility across every cooling project we deliver.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">OUR COMMITMENTS</p>
          <h2>Four pillars that guide every decision in the factory and on customer programs.</h2>
        </div>
        <div className="grid-2">
          <article className="card reveal">
            <h3>Quality</h3>
            <ul className="checks">
              <li>Compliance with applicable customer, regulatory and ISO standards</li>
              <li>Process control on critical operations: brazing, welding, bending, laser cutting</li>
              <li>Dimensional verification with Hexagon CMM and traceable measurement records</li>
              <li>Continuous improvement through internal audits and corrective action loops</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3>Health &amp; Safety</h3>
            <ul className="checks">
              <li>Risk assessment for all manufacturing activities and worksites</li>
              <li>Mandatory PPE, training and competence verification for operators</li>
              <li>Incident reporting, investigation and prevention culture</li>
              <li>Compliance with Italian D.Lgs. 81/2008 and applicable EU directives</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3>Environment</h3>
            <ul className="checks">
              <li>Responsible management of metal scrap, coolants and process consumables</li>
              <li>Energy efficiency targets on production lines and facility operations</li>
              <li>Waste segregation and authorized disposal partners</li>
              <li>Reduction of solvent and emission impact in fabrication processes</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3>Stakeholder Trust</h3>
            <ul className="checks">
              <li>Transparent communication with customers, suppliers and authorities</li>
              <li>Supplier qualification and performance monitoring</li>
              <li>Documented evidence available for vendor and audit requests</li>
              <li>Regular management review of QHSE objectives and indicators</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">GOVERNANCE</p>
          <h2>How the policy is operated, reviewed and improved.</h2>
        </div>
        <ol className="timeline">
          <li className="reveal"><span className="step">01</span><p>Top management establishes QHSE objectives and allocates the resources required to achieve them.</p></li>
          <li className="reveal"><span className="step">02</span><p>Operational procedures and work instructions translate objectives into measurable activities on the shop floor and in engineering.</p></li>
          <li className="reveal"><span className="step">03</span><p>Indicators (non-conformities, near-misses, energy and waste KPIs) are tracked and reviewed periodically by the QHSE function.</p></li>
          <li className="reveal"><span className="step">04</span><p>Annual management review verifies adequacy, captures improvement opportunities and updates the policy when scope or context changes.</p></li>
        </ol>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="info reveal">
            <p className="kicker">CERTIFICATION</p>
            <h3>ISO certificate available</h3>
            <p>The active certification document is available for vendor qualification and procurement processes.</p>
            <div className="btn-row">
              <a className="btn solid" href="/assets/certificazioneiso.pdf" target="_blank" rel="noopener noreferrer">Open ISO Certificate</a>
            </div>
          </article>
          <article className="info reveal">
            <p className="kicker">CONTACT</p>
            <h3>QHSE inquiries</h3>
            <p>For QHSE documentation, supplier qualification or audit requests:</p>
            <p><a href="mailto:info@enfrio.eu" aria-label="Send email to info@enfrio.eu">info@enfrio.eu</a></p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="card reveal" style={{ textAlign: "center" }}>
          <p className="micro-note">Policy issued by Enfrio Srl management. Last review aligned with current ISO certification cycle. The policy is communicated to all employees and made available to interested parties.</p>
        </div>
      </section>
    </SiteShell>
  );
}
