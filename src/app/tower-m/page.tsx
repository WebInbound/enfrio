import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import MTowerSizer from "@/components/MTowerSizer";
import MTowerStage from "@/components/MTowerStage";

export const metadata: Metadata = {
  title: "M Tower | Modular cooling that scales with your power | Enfrio",
  description:
    "Enfrio M Tower is a modular heat-rejection platform: 1500 kW per unit, scaling from standalone gensets to 12 MW datacenter halls. Real engineering, ATEX-ready, sea-water proof.",
};

export default function TowerMPage() {
  return (
    <SiteShell active="tower-m">
      <MTowerStage />

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">WHY MODULAR MATTERS</p>
          <h2>Three reasons engineers pick M Tower over fixed-size cooling.</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <p className="kicker">CAPEX</p>
            <h3>Pay for capacity you actually use</h3>
            <p>Buy what today&apos;s load needs. Add modules later when the plant grows. No oversized installation depreciating from day one.</p>
          </article>
          <article className="card reveal">
            <p className="kicker">UPTIME</p>
            <h3>N+1 redundancy comes for free</h3>
            <p>Add one extra module to every bank and you have hot-swap redundancy. A failed unit doesn&apos;t take production down.</p>
          </article>
          <article className="card reveal">
            <p className="kicker">LOGISTICS</p>
            <h3>Container-fit, container-shipped</h3>
            <p>Each module fits standard freight envelopes. From port to slab in days, not weeks. Field assembly on a single bolt pattern.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">UNIT SPEC</p>
          <h2>What is inside one M Tower module.</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Performance envelope</h3>
            <ul className="checks">
              <li>1500 kW heat rejection per unit</li>
              <li>Single (HT), Double (HT+LT) or multi-circuit configurations</li>
              <li>Inverter-ready variable cooling on every fan stage</li>
              <li>High-alloy cores with dimpled tubes and louvered fins</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>Built for the field</h3>
            <ul className="checks">
              <li>Vertical or horizontal architecture</li>
              <li>Sea-water corrosion resistance options</li>
              <li>ATEX-ready packages</li>
              <li>Container-fit logic for fast deployment</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section dark-block" id="mtower-sizer">
        <div className="section-head reveal">
          <p className="kicker">SIZING SIMULATOR</p>
          <h2>How many M Tower modules does your project need?</h2>
          <p>
            Type your engine power, pick the application, choose redundancy. The simulator
            returns a baseline configuration on the spot. Final sizing is confirmed by
            Enfrio engineering on real platform data.
          </p>
        </div>
        <MTowerSizer />
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">DEPLOYMENT CONTEXTS</p>
          <h2>From a single genset to a full datacenter hall.</h2>
          <p>Two real-world scenarios where modular heat rejection wins on capex, uptime and time-to-deploy.</p>
        </div>
        <div className="deploy-grid">
          <article className="deploy-card reveal">
            <div className="deploy-card-media">
              <Image src="/assets/images/site/power-gen-hall.jpg" alt="Genset hall with Enfrio cooling on a bank of engines" width={1400} height={900} />
              <div className="deploy-card-shade" />
              <span className="deploy-card-tag">POWER GENERATION</span>
            </div>
            <div className="deploy-card-body">
              <h3>Backup &amp; primary gensets</h3>
              <p>
                Mission-critical sites where the cooling plant has to track the
                generator&apos;s load profile. M Tower scales bank-by-bank as the
                site grows.
              </p>
              <ul className="deploy-stats">
                <li><strong>1 – 8</strong><span>modules per genset bank</span></li>
                <li><strong>1.5 – 12 MW</strong><span>heat rejection envelope</span></li>
                <li><strong>N+1</strong><span>redundancy on bolt-down</span></li>
              </ul>
            </div>
          </article>

          <article className="deploy-card reveal">
            <div className="deploy-card-media">
              <Image src="/assets/images/site/warehouse-delivery.jpg" alt="Container-ready Enfrio cooling units staged in the warehouse" width={1400} height={1050} />
              <div className="deploy-card-shade" />
              <span className="deploy-card-tag">DATACENTER COOLING</span>
            </div>
            <div className="deploy-card-body">
              <h3>High-density compute halls</h3>
              <p>
                Workload grows non-linearly. Start with the modules you need
                today, drop in more skids as you fill racks &mdash; no redesign,
                no oversized plant burning capex on day one.
              </p>
              <ul className="deploy-stats">
                <li><strong>Pay-as-you-grow</strong><span>cap-ex profile</span></li>
                <li><strong>Container-fit</strong><span>port to slab in days</span></li>
                <li><strong>Hot-swap</strong><span>maintenance with N+1</span></li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">M TOWER ENQUIRY</p>
        <h2>Ready to size your installation with Enfrio engineering?</h2>
        <p>
          Use the simulator above for a first estimate, then send the brief to our team —
          we will reply with a configuration, a quote envelope and a delivery roadmap.
        </p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact?subject=M+Tower+Inquiry">Talk to the M Tower team</Link>
        </div>
      </section>
    </SiteShell>
  );
}
