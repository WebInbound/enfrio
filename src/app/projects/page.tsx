import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio Projects | Applied Industrial Credibility",
  description: "Selected Enfrio projects and references demonstrating technical delivery in real contexts.",
};

export default function ProjectsPage() {
  return (
    <SiteShell active="projects">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">PROJECT EVIDENCE</p>
          <h1>Applied credibility from real manufacturing and deployment contexts.</h1>
          <p>
            These selected references show how Enfrio translates thermal complexity into execution-ready industrial
            solutions.
          </p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-left" src="/assets/images/site/enfrio-trade-show.jpg" alt="Enfrio booth at an international trade show" width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          <article className="panel reveal media">
            <Image className="fit-contain focus-left" src="/assets/images/site/rad-40ng.jpg" alt="40HC container package" width={1200} height={900} />
            <h3>40HC Container Package</h3>
            <p>
              Cooling package engineered for compact container fit with high-efficiency cores, low fan power and
              low-noise behavior.
            </p>
          </article>
          <article className="panel reveal media">
            <Image className="fit-contain focus-left" src="/assets/images/site/rad-remote-mtu.jpg" alt="MTU remote installation radiator" width={1200} height={900} />
            <h3>Remote MTU Customization</h3>
            <p>
              Customized radiator for remote installations, with container-ready dimensions and robust field-oriented
              architecture.
            </p>
          </article>
          <article className="panel reveal media">
            <Image className="fit-contain focus-left" src="/assets/images/site/waste-madrid-03.jpg" alt="Enfrio Madrid waste truck cooling product" width={1200} height={900} />
            <h3>Madrid Waste Truck Product (Enfrio Development)</h3>
            <p>
              Proprietary Enfrio solution for Madrid waste collection vehicles, engineered around severe packaging
              constraints with custom radiator/CAC architecture.
            </p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">SPECIAL PLATFORM</p>
          <h2>M Tower modular capacity for large-scale heat rejection.</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Performance Envelope</h3>
            <ul className="checks">
              <li>1 unit: 1500 kW heat rejection</li>
              <li>4 units: 6000 kW heat rejection</li>
              <li>8 units: 12000 kW heat rejection</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>Configuration Options</h3>
            <ul className="checks">
              <li>Vertical or horizontal installation</li>
              <li>Variable cooling with inverter logic</li>
              <li>Sea-water corrosion resistance and ATEX options</li>
            </ul>
            <div className="btn-row">
              <Link className="btn solid" href="/tower-m">
                Open M Tower page
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">PROJECT FLOW</p>
          <h2>Applied credibility shown in an auto-advancing sequence.</h2>
        </div>

        <div className="wow-showcase reveal" data-wow>
          <div className="wow-grid">
            <figure className="wow-media">
              <Image className="active focus-left" data-id="expo" src="/assets/images/site/fair-dubai-2.jpg" alt="Expo presence" width={1400} height={900} />
              <Image data-id="installed" className="fit-contain" src="/assets/images/site/installed-baudouin-canopy.jpg" alt="Enfrio cooling package installed in finished canopy" width={1400} height={900} />
              <Image data-id="delivery" className="focus-right" src="/assets/images/site/warehouse-delivery.jpg" alt="Forklifts moving Enfrio cooling units in the warehouse" width={1400} height={1050} />
            </figure>
            <div className="wow-copy">
              <article className="wow-item active" data-id="expo">
                <h3>Market Visibility</h3>
                <p>International presence that reinforces partner trust and technical positioning.</p>
              </article>
              <article className="wow-item" data-id="installed">
                <h3>Installed Reality</h3>
                <p>Configured systems adapted to real-world space and duty-cycle constraints.</p>
              </article>
              <article className="wow-item" data-id="delivery">
                <h3>Execution Closure</h3>
                <p>Factory output translated into disciplined logistics and on-time dispatch.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">PROJECT SNAPSHOTS</p>
          <h2>Supporting visuals from fairs, delivery contexts and installed families.</h2>
        </div>
        <div className="editorial-rail auto-lux-wrap reveal" aria-label="Project snapshots auto gallery">
          <div className="auto-lux-track">
            <figure className="auto-lux-card">
              <Image src="/assets/images/site/fair-mee-2.jpg" alt="MEE event booth" width={1200} height={900} />
              <figcaption>International event presence and partner visibility.</figcaption>
            </figure>
            <figure className="auto-lux-card">
              <Image src="/assets/images/site/fair-dubai-1.jpg" alt="East energy Dubai event" width={1200} height={900} />
              <figcaption>Commercial engagement in strategic energy markets.</figcaption>
            </figure>
            <figure className="auto-lux-card">
              <Image src="/assets/images/site/rad-warehouse-stock.jpg" alt="Radiator stock in warehouse" width={1200} height={900} />
              <figcaption>Production continuity and staged delivery readiness.</figcaption>
            </figure>
            <figure className="auto-lux-card">
              <Image src="/assets/images/site/rad-double.jpg" alt="Dual radiator configuration" width={1200} height={900} />
              <figcaption>Variant architecture for differentiated project needs.</figcaption>
            </figure>
            <figure className="auto-lux-card">
              <Image src="/assets/images/site/rad-truck-load.jpg" alt="Loading radiator onto truck" width={1200} height={900} />
              <figcaption>Execution closes with logistics discipline.</figcaption>
            </figure>

            <figure className="auto-lux-card" aria-hidden="true">
              <Image src="/assets/images/site/fair-mee-2.jpg" alt="" width={1200} height={900} />
              <figcaption>International event presence and partner visibility.</figcaption>
            </figure>
            <figure className="auto-lux-card" aria-hidden="true">
              <Image src="/assets/images/site/fair-dubai-1.jpg" alt="" width={1200} height={900} />
              <figcaption>Commercial engagement in strategic energy markets.</figcaption>
            </figure>
            <figure className="auto-lux-card" aria-hidden="true">
              <Image src="/assets/images/site/rad-warehouse-stock.jpg" alt="" width={1200} height={900} />
              <figcaption>Production continuity and staged delivery readiness.</figcaption>
            </figure>
            <figure className="auto-lux-card" aria-hidden="true">
              <Image src="/assets/images/site/rad-double.jpg" alt="" width={1200} height={900} />
              <figcaption>Variant architecture for differentiated project needs.</figcaption>
            </figure>
            <figure className="auto-lux-card" aria-hidden="true">
              <Image src="/assets/images/site/rad-truck-load.jpg" alt="" width={1200} height={900} />
              <figcaption>Execution closes with logistics discipline.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="info reveal">
            <p className="kicker">QUALITY PROOF</p>
            <h3>ISO Certification</h3>
            <p>Official certification is available for vendor qualification and procurement processes.</p>
            <div className="btn-row">
              <a className="btn solid" href="/assets/certificazioneiso.pdf" target="_blank" rel="noopener noreferrer">
                Open ISO Certificate
              </a>
            </div>
          </article>
          <article className="info reveal">
            <p className="kicker">COMMERCIAL NEXT</p>
            <h3>Discuss your program</h3>
            <p>Share your constraints and timeline to evaluate feasibility, risk and deployment options.</p>
            <div className="btn-row">
              <Link className="btn ghost" href="/contact">
                Start project review
              </Link>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
