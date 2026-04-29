import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import MTowerSizer from "@/components/MTowerSizer";

export const metadata: Metadata = {
  title: "Enfrio M Tower | Modular Heat Rejection Platform",
  description: "Dedicated page for Enfrio M Tower modular cooling platform with sizing simulator from 1500 kW per unit up to 12000 kW configurations.",
};

export default function TowerMPage() {
  return (
    <SiteShell active="tower-m">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">M TOWER PLATFORM</p>
          <h1>Modular capacity for large-scale heat rejection.</h1>
          <p>M Tower is designed for scalable thermal demand with options for vertical or horizontal deployment and multi-circuit configurations.</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image src="/assets/images/site/mtower-real.jpg" alt="Enfrio M Tower unit" width={1200} height={900} />
        </figure>
      </section>

      <section className="section dark-block">
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Performance</h3>
            <ul className="checks">
              <li>1 unit = 1500 kW heat rejection</li>
              <li>4 units = 6000 kW</li>
              <li>8 units = 12000 kW</li>
              <li>Single (HT), Double (HT+LT) or multiple circuits</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>Engineering Highlights</h3>
            <ul className="checks">
              <li>Vertical or horizontal architecture</li>
              <li>Inverter-ready variable cooling</li>
              <li>Sea-water corrosion resistance</li>
              <li>ATEX-ready options and container-fit logic</li>
              <li>High-alloy cores with dimpled tubes and louvered fins</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="photo-grid-2 reveal">
          <figure className="photo-card">
            <Image src="/assets/images/site/mtower-main.jpg" alt="M Tower render" width={1200} height={900} />
            <figcaption>Platform visualization for commercial and technical proposal phases.</figcaption>
          </figure>
          <figure className="photo-card">
            <Image src="/assets/images/site/mtower-sheet.jpg" alt="M Tower technical sheet" width={1200} height={900} />
            <figcaption>Technical summary visual for rapid stakeholder alignment.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section dark-block" id="mtower-sizer">
        <div className="section-head reveal">
          <p className="kicker">SIZING SIMULATOR</p>
          <h2>Estimate how many M Tower units fit your thermal load.</h2>
          <p>Provide engine power and application type. The simulator returns an indicative module count based on a 1500 kW per unit baseline. Final sizing is confirmed by Enfrio engineering on real project data.</p>
        </div>
        <MTowerSizer />
      </section>

      <section className="section cta reveal">
        <p className="kicker">M TOWER ENQUIRY</p>
        <h2>Need modular thermal capacity for a large-scale installation?</h2>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">Contact M Tower team</Link>
        </div>
      </section>
    </SiteShell>
  );
}
