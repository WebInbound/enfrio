import type { Metadata } from "next";
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
            <span className="deploy-card-tag">POWER GENERATION</span>
            {/* Subtle watermark diagram — a row of vertical "M Tower" bars
                paired with horizontal "genset" blocks. Communicates the
                "one M Tower per genset, line up the bank" idea without
                resorting to a futuristic AI hero photo. */}
            <svg
              className="deploy-card-mark"
              viewBox="0 0 240 80"
              aria-hidden="true"
              focusable="false"
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(${i * 40 + 6} 8)`}>
                  <rect x="0" y="0" width="22" height="38" rx="2" />
                  <rect x="0" y="44" width="28" height="22" rx="2" opacity="0.55" />
                </g>
              ))}
            </svg>
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
            <span className="deploy-card-tag">DATACENTER COOLING</span>
            {/* Subtle watermark diagram — server-rack stack next to a
                cooling tower silhouette. Same idea: visual hint, no AI
                photo. */}
            <svg
              className="deploy-card-mark"
              viewBox="0 0 240 80"
              aria-hidden="true"
              focusable="false"
            >
              {/* Server rack rows */}
              {[0, 1, 2, 3, 4].map((i) => (
                <rect
                  key={`r-${i}`}
                  x="20"
                  y={8 + i * 14}
                  width="120"
                  height="9"
                  rx="1.5"
                  opacity={0.42 + i * 0.08}
                />
              ))}
              {/* Cooling tower next to the rack */}
              <rect x="170" y="6" width="42" height="68" rx="3" />
              <line x1="178" y1="22" x2="204" y2="22" strokeWidth="1.5" />
              <line x1="178" y1="34" x2="204" y2="34" strokeWidth="1.5" />
              <line x1="178" y1="46" x2="204" y2="46" strokeWidth="1.5" />
              <line x1="178" y1="58" x2="204" y2="58" strokeWidth="1.5" />
            </svg>
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
          <Link className="btn solid magnetic" href="/contact?subject=M+Tower+Inquiry">Talk to the M Tower team</Link>
        </div>
      </section>
    </SiteShell>
  );
}
