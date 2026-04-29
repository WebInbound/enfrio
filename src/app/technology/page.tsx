import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio Technology | Manufacturing and Process Capability",
  description: "Advanced machinery, fabrication control and process technology for industrial cooling systems.",
};

const MACHINERY_GALLERY = [
  { src: "mach-bending-a.jpg", alt: "Bending machine overview", caption: "Bending platform setup for thermal line integration." },
  { src: "mach-bending-d.jpg", alt: "Bending machine operation", caption: "Operator-controlled routing precision." },
  { src: "mach-laser-a.jpg", alt: "Laser process cell", caption: "Laser processing for consistent component geometry." },
  { src: "quality-hexagon-b.jpg", alt: "Quality metrology", caption: "CMM verification on critical dimensions." },
  { src: "prod-weld-station.jpg", alt: "Welding workstation", caption: "Fabrication station with controlled workmanship." },
];

export default function TechnologyPage() {
  return (
    <SiteShell active="technology">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">PROCESS EXCELLENCE</p>
          <h1>Real process control from machine setup to validated output.</h1>
          <p>Technology at Enfrio is built around repeatability: controlled process windows, traceable checks and reliable industrial throughput.</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image className="focus-left" src="/assets/images/site/mach-laser-c.jpg" alt="Laser tube cutting process" width={1200} height={900} />
        </figure>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">CAPABILITY FLOW</p>
          <h2>Technology &rarr; fabrication &rarr; assembly &rarr; quality.</h2>
        </div>

        <div className="process-story">
          <div className="process-steps reveal">
            <article className="process-step active" tabIndex={0} data-image="bending">
              <h3>6-Axis Tube Bending</h3>
              <p>New 6-axis bending cell for stainless tubes up to key best-seller standards, supporting compact and complex routing.</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="laser">
              <h3>Laser Tube Cutting</h3>
              <p>Dedicated laser operations for radiator components, expansion tanks and structural motor fixation frames.</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="quality">
              <h3>Hexagon + 3D Routines</h3>
              <p>3D Catia and PLM routines linked with Hexagon CMM to secure dimensional control across bending and laser workflows.</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="assembly">
              <h3>Controlled Assembly Execution</h3>
              <p>Final assembly is driven by repeatable process logic, traceability checkpoints and serial-readiness criteria.</p>
            </article>
          </div>
          <figure className="process-visual reveal">
            <Image className="active" data-id="bending" src="/assets/images/site/mach-bending-c.jpg" alt="Tube bending machine" width={1400} height={900} />
            <Image data-id="laser" src="/assets/images/site/mach-laser-d.jpg" alt="Laser machine detail" width={1400} height={900} />
            <Image data-id="quality" src="/assets/images/site/quality-hexagon-a.jpg" alt="Hexagon quality control" width={1400} height={900} />
            <Image data-id="assembly" src="/assets/images/site/prod-assembly-c.jpg" alt="Assembly process" width={1400} height={900} />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">MACHINERY DETAIL</p>
          <h2>Selected visual evidence from active process lines.</h2>
        </div>
        <div className="editorial-rail auto-lux-wrap reveal" aria-label="Machinery detail auto gallery">
          <div className="auto-lux-track">
            {MACHINERY_GALLERY.map((g, i) => (
              <figure key={`g-${i}`} className="auto-lux-card">
                <Image src={`/assets/images/site/${g.src}`} alt={g.alt} width={1200} height={900} />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
            {MACHINERY_GALLERY.map((g, i) => (
              <figure key={`g2-${i}`} className="auto-lux-card" aria-hidden="true">
                <Image src={`/assets/images/site/${g.src}`} alt="" width={1200} height={900} />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">TECHNICAL DEEP DIVE</p>
        <h2>Need to align our process capability with your platform?</h2>
        <p>Book a deep-dive call to walk through bending tolerances, laser parameters and quality routines on your application.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">Book technical deep dive</Link>
        </div>
      </section>
    </SiteShell>
  );
}
