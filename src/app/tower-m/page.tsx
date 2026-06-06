import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import MTowerSizer from "@/components/MTowerSizer";
import MTowerStage from "@/components/MTowerStage";
import AnimatedNumber from "@/components/AnimatedNumber";
import DeploySwitcher from "@/components/DeploySwitcher";

export const metadata: Metadata = pageMetadata({
  path: "/tower-m",
  title: "M Tower | Modular cooling that scales with your power | Enfrio",
  description:
    "Enfrio M Tower is a modular heat-rejection platform: 1500 kW per unit, scaling from standalone gensets to 12 MW datacenter halls. Real engineering, ATEX-ready, sea-water proof.",
});

export default function TowerMPage() {
  return (
    <SiteShell active="tower-m">
      <MTowerStage />

      {/* PLAY 7 — Engineering Detail macro crops */}
      <section className="section mtower-craft">
        <div className="section-head reveal">
          <p className="kicker">ENGINEERING DETAIL</p>
          <h2>Built from the inside out.</h2>
        </div>
        <div className="mtower-craft-stack">
          <figure className="craft-crop reveal">
            <img src="/assets/images/site/rad-vertical.jpg" alt="Cu/Al finned coil close-up" />
            <figcaption>Cu/Al finned coil. 0.12 mm fin pitch.</figcaption>
          </figure>
          <figure className="craft-crop reveal">
            <img src="/assets/images/site/prod-welding.jpg" alt="Hot-dip galvanized weld detail" />
            <figcaption>Hot-dip galvanized DIN EN ISO 1461.</figcaption>
          </figure>
          <figure className="craft-crop reveal">
            <img src="/assets/images/site/mach-laser-b.jpg" alt="EC fan motor detail" />
            <figcaption>EC fans. IE5 efficiency class.</figcaption>
          </figure>
        </div>
      </section>

      {/* PLAY 3 — Why modular: SVG stat cards */}
      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">WHY MODULAR MATTERS</p>
          <h2>Three reasons engineers pick M Tower over fixed-size cooling.</h2>
        </div>
        <div className="grid-3">
          <article className="stat reveal mtower-why-mod-card">
            <svg
              className="why-mod-diagram why-mod-diagram--capex"
              viewBox="0 0 240 56"
              aria-hidden="true"
              focusable="false"
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const filled = i < 3;
                return (
                  <rect
                    key={i}
                    x={i * 29 + 4}
                    y={8}
                    width={22}
                    height={40}
                    rx={2}
                    className={filled ? "why-mod-rect filled" : "why-mod-rect ghost"}
                    style={{ ["--i" as string]: i } as CSSProperties}
                  />
                );
              })}
            </svg>
            <h3>
              <AnimatedNumber value={-42} suffix="% CAPEX" />
            </h3>
            <p className="kicker">CAPEX</p>
            <p>Pay for capacity you actually use. Buy what today&apos;s load needs. Add modules later when the plant grows. No oversized installation depreciating from day one.</p>
          </article>

          <article className="stat reveal mtower-why-mod-card">
            <svg
              className="why-mod-diagram why-mod-diagram--uptime"
              viewBox="0 0 240 56"
              aria-hidden="true"
              focusable="false"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const isSpare = i === 4;
                return (
                  <rect
                    key={i}
                    x={i * 47 + 8}
                    y={8}
                    width={36}
                    height={40}
                    rx={3}
                    className={
                      isSpare
                        ? "why-mod-rect spare"
                        : "why-mod-rect filled"
                    }
                    style={{ ["--i" as string]: i } as CSSProperties}
                  />
                );
              })}
            </svg>
            <h3>
              <AnimatedNumber value={100} suffix="% UPTIME" />
            </h3>
            <p className="kicker">UPTIME</p>
            <p>N+1 redundancy comes for free. Add one extra module to every bank and you have hot-swap redundancy. A failed unit doesn&apos;t take production down.</p>
          </article>

          <article className="stat reveal mtower-why-mod-card">
            <svg
              className="why-mod-diagram why-mod-diagram--logistics"
              viewBox="0 0 240 56"
              aria-hidden="true"
              focusable="false"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <g
                  key={i}
                  className="why-mod-container"
                  style={{ ["--i" as string]: i } as CSSProperties}
                >
                  <rect
                    x={i * 78 + 4}
                    y={12}
                    width={70}
                    height={32}
                    rx={2}
                    className="why-mod-container-shell"
                  />
                  {[0, 1, 2, 3, 4, 5].map((j) => (
                    <line
                      key={j}
                      x1={i * 78 + 4 + 10 + j * 10}
                      y1={14}
                      x2={i * 78 + 4 + 10 + j * 10}
                      y2={42}
                      className="why-mod-container-line"
                    />
                  ))}
                </g>
              ))}
            </svg>
            <h3>
              <AnimatedNumber value={90} suffix=" DAYS" />
            </h3>
            <p className="kicker">LOGISTICS</p>
            <p>Container-fit, container-shipped. Each module fits standard freight envelopes. From port to slab in days, not weeks. Field assembly on a single bolt pattern.</p>
          </article>
        </div>
      </section>

      {/* PLAY 5 — Modular scale band */}
      <section className="section mtower-scale">
        <div className="section-head reveal">
          <p className="kicker">MODULAR SCALES WITH YOU</p>
          <h2>From one unit to twelve megawatts.</h2>
          <p>One bolt pattern, one spare-parts library — and a capacity envelope that follows the project from a single genset to a full hyperscale hall.</p>
        </div>
        <div className="grid-4 mtower-scale-grid">
          {[
            { n: 1, mw: 1.5, label: "Single genset", bg: "container" },
            { n: 2, mw: 3, label: "Backup bank", bg: "substation" },
            { n: 4, mw: 6, label: "Datacenter row", bg: "serverhall" },
            { n: 8, mw: 12, label: "Hyperscale hall", bg: "plant" },
          ].map((tier) => (
            <article
              key={tier.n}
              className={`mtower-scale-tier reveal mtower-scale-tier--${tier.bg}`}
            >
              <div className="mtower-scale-bg" aria-hidden="true">
                {tier.bg === "container" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    <rect x="20" y="60" width="160" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1={30 + i * 20} y1={64} x2={30 + i * 20} y2={96} stroke="currentColor" strokeWidth="0.8" />
                    ))}
                  </svg>
                )}
                {tier.bg === "substation" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1.2" />
                    {[40, 100, 160].map((x, i) => (
                      <g key={i}>
                        <line x1={x} y1="100" x2={x} y2="40" stroke="currentColor" strokeWidth="1.2" />
                        <line x1={x - 16} y1="50" x2={x + 16} y2="50" stroke="currentColor" strokeWidth="1.2" />
                        <line x1={x - 16} y1="65" x2={x + 16} y2="65" stroke="currentColor" strokeWidth="1.2" />
                      </g>
                    ))}
                  </svg>
                )}
                {tier.bg === "serverhall" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    {Array.from({ length: 5 }).map((_, row) =>
                      Array.from({ length: 6 }).map((__, col) => (
                        <rect
                          key={`${row}-${col}`}
                          x={20 + col * 28}
                          y={20 + row * 18}
                          width={22}
                          height={12}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.9"
                        />
                      ))
                    )}
                  </svg>
                )}
                {tier.bg === "plant" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    <rect x="40" y="50" width="120" height="60" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    {[0, 1, 2, 3].map((i) => (
                      <rect key={i} x={50 + i * 28} y={36} width={20} height={14} fill="none" stroke="currentColor" strokeWidth="1" />
                    ))}
                    <line x1="0" y1="110" x2="200" y2="110" stroke="currentColor" strokeWidth="1" />
                  </svg>
                )}
              </div>

              <svg
                className="mtower-scale-modules"
                viewBox={`0 0 ${tier.n * 22 + 8} 64`}
                aria-hidden="true"
                focusable="false"
              >
                {Array.from({ length: tier.n }).map((_, i) => (
                  <rect
                    key={i}
                    x={i * 22 + 4}
                    y={6}
                    width={16}
                    height={52}
                    rx={2}
                    className="mtower-scale-module"
                    style={{ ["--i" as string]: i } as CSSProperties}
                  />
                ))}
              </svg>

              <p className="mtower-scale-count">
                {tier.n} {tier.n === 1 ? "module" : "modules"}
              </p>
              <p className="mtower-scale-mw">
                <AnimatedNumber value={tier.mw} suffix=" MW" format="float" />
              </p>
              <p className="mtower-scale-label">{tier.label}</p>
            </article>
          ))}
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

      {/* PLAY 6 — Deployment Contexts: tabbed switcher */}
      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">DEPLOYMENT CONTEXTS</p>
          <h2>One platform, four worlds.</h2>
          <p>The M Tower envelope adapts to ambient, fluid and certification rules across the industries we serve. Switch contexts to compare the spec deltas.</p>
        </div>
        <DeploySwitcher />
      </section>

      {/* PLAY 8 — Closing outro recap */}
      <section className="mtower-outro section dark-block">
        <div className="mtower-outro-grid">
          <div className="mtower-outro-media mtower-spotlight-media--render reveal">
            <img src="/assets/images/site/mtower-render.png" alt="M Tower modular cooling unit" />
          </div>
          <div className="mtower-outro-content reveal">
            <p className="kicker">READY TO SCALE WITH YOU</p>
            <h2>From brief to bolted-down in 90 days.</h2>
            <div className="mtower-outro-strip">
              <span className="mtower-outro-strip-num">1500 kW</span>
              <span className="mtower-outro-strip-dot">&middot;</span>
              <span className="mtower-outro-strip-num">12 MW</span>
              <span className="mtower-outro-strip-dot">&middot;</span>
              <span className="mtower-outro-strip-num">N+1</span>
            </div>
            <ol className="timeline mtower-outro-timeline">
              <li>
                <span className="step">Brief</span>
                <span>Engine card, ambient, redundancy target — we read the project on a single page.</span>
              </li>
              <li>
                <span className="step">Engineer</span>
                <span>Sized on real platform data, validated against the operating envelope before steel is cut.</span>
              </li>
              <li>
                <span className="step">Build</span>
                <span>Laser, bend, weld, galvanize, assemble — all in-house at Ponderano (BI), Italy.</span>
              </li>
              <li>
                <span className="step">Commission</span>
                <span>Container shipped, bolted down, hot-tested on site. Handover signed by Enfrio engineering.</span>
              </li>
            </ol>
            <div className="btn-row">
              <Link className="btn solid magnetic" href="/contact?subject=M+Tower+Inquiry">
                Talk to the M Tower team
              </Link>
              {/* TODO: replace href with /assets/datasheet-mtower.pdf once the
                  final datasheet is signed off by Engineering. */}
              <a className="btn ghost" href="#">Download datasheet</a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
