import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio Industries | Application Domains",
  description: "Industry applications for Enfrio engine cooling solutions across power generation and datacenter sectors.",
};

const MADRID_PHOTOS = [
  { src: "waste-madrid-01.jpg", caption: "Custom core-box opening on radiator package." },
  { src: "waste-madrid-02.jpg", caption: "Truck integration detail from Madrid platform." },
  { src: "waste-madrid-03.jpg", caption: "Vehicle-level integration in operation context." },
  { src: "waste-madrid-04.jpg", caption: "Cooling system mounted on waste collection vehicle." },
  { src: "waste-madrid-05.jpg", caption: "Field-ready Enfrio architecture for the Madrid platform." },
];

export default function IndustriesPage() {
  return (
    <SiteShell active="industries">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">INDUSTRY FOCUS</p>
          <h1>Sector-fit cooling platforms for high-consequence operations.</h1>
          <p>Enfrio supports markets where thermal reliability, packaging constraints and operational uptime are commercially critical.</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-right" src="/assets/images/site/installed-v20-integrated.jpg" alt="V20 engine with integrated Enfrio cooling package" width={1400} height={1400} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="card reveal media">
            <Image src="/assets/images/site/installed-baudouin-canopy.jpg" alt="Genset enclosure with Enfrio cooling unit installed" width={1400} height={900} />
            <h3>Power Generation</h3>
            <p>High-capacity thermal systems for gensets and stationary assets in mission-critical environments.</p>
          </article>
          <article className="card reveal media">
            <Image src="/assets/images/site/rad-remote-mtu.jpg" alt="Outdoor Enfrio cooling installation for remote and datacenter contexts" width={1400} height={900} />
            <h3>Datacenter</h3>
            <p>Mission-critical thermal management for high-density compute environments with demanding uptime and efficiency targets.</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">APPLICATION SCOPE</p>
          <h2>From component-level products to integrated cooling packages.</h2>
        </div>
        <div className="grid-4">
          <article className="panel reveal"><h3>Water Radiators</h3><p>Aluminum architecture optimized for heat rejection and durability.</p></article>
          <article className="panel reveal"><h3>Oil &amp; Fuel Coolers</h3><p>Stable thermal windows for reliable operation under variable load profiles.</p></article>
          <article className="panel reveal"><h3>Charge Air Coolers</h3><p>Air-path temperature control for efficiency and engine consistency.</p></article>
          <article className="panel reveal"><h3>Condensers</h3><p>Climate-unit heat exchange systems with corrosion and lifecycle focus.</p></article>
        </div>
      </section>

      <section className="section dark-block madrid-case">
        <div className="madrid-head reveal">
          <div>
            <p className="kicker">ENFRIO ORIGINAL DEVELOPMENT</p>
            <h2>Madrid waste collection truck cooling product, engineered by Enfrio.</h2>
          </div>
          <article className="panel madrid-why">
            <h3>Why it matters</h3>
            <p>This solution was developed by Enfrio to solve a constrained installation where a standard radiator layout would not fit the vehicle architecture.</p>
            <ul className="checks">
              <li>Custom core-box opening integrated in radiator and charge air cooler</li>
              <li>Performance-preserving coolant flow management</li>
              <li>Complex process execution: brazing, soldering, TIG and MIG</li>
            </ul>
          </article>
        </div>

        <div className="madrid-auto reveal" aria-label="Madrid waste truck project gallery">
          <div className="madrid-auto-track">
            {MADRID_PHOTOS.map((p, i) => (
              <figure key={`m1-${i}`} className="photo-card">
                <Image className="focus-bottom" src={`/assets/images/site/${p.src}`} alt={`Madrid waste truck project visual ${i + 1}`} width={1200} height={900} />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
            {MADRID_PHOTOS.map((p, i) => (
              <figure key={`m2-${i}`} className="photo-card" aria-hidden="true">
                <Image className="focus-bottom" src={`/assets/images/site/${p.src}`} alt="" width={1200} height={900} />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">INDUSTRY MATCHING</p>
        <h2>Share your operating envelope and we will define the right thermal architecture.</h2>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">Submit your application</Link>
        </div>
      </section>
    </SiteShell>
  );
}
