import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio | Cooling Engineered to Perform",
  description:
    "Enfrio designs products, processes and tests for cooling engines with end-to-end engineering and manufacturing support.",
};

export default function HomePage() {
  return (
    <SiteShell active="home">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">ENGINEER LEADERS</p>
          <h1>We de-risk thermal performance for mission-critical engines.</h1>
          <p className="lead">
            From bid phase to production transfer, Enfrio runs the full execution chain so your teams hit launch windows,
            cost targets and field reliability.
          </p>
          <div className="btn-row">
            <Link className="btn solid" href="/contact">
              Request executive call
            </Link>
            <Link className="btn ghost" href="/solutions">
              Explore 5P solutions
            </Link>
          </div>
        </div>
        <figure className="page-hero-media reveal">
          <Image className="focus-right" src="/assets/images/site/hero-main.jpg" alt="Enfrio technician welding radiator" width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">END-TO-END MODEL</p>
          <h2>One accountable partner from concept freeze to stable serial output.</h2>
        </div>
        <div className="grid-3">
          <article className="stat reveal">
            <h3>5P</h3>
            <p>
              Project Management, Product Design Engineering, Process Definition, Procurement, Production Transfers.
            </p>
          </article>
          <article className="stat reveal">
            <h3>2</h3>
            <p>Core sectors: Power Generation and Datacenter.</p>
          </article>
          <article className="stat reveal">
            <h3>24/7</h3>
            <p>Focus on uptime, durability and thermal stability in demanding environments.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">INSIDE ENFRIO</p>
          <h2>Real engineering. Real manufacturing. Real delivery discipline.</h2>
        </div>
        <div className="dominant-cluster reveal">
          <Image className="dominant focus-left" src="/assets/images/site/prod-line.jpg" alt="Enfrio production line" width={1400} height={900} />
          <div className="support">
            <Image className="focus-left" src="/assets/images/site/tube-bending-operator.jpg" alt="6-axis tube bending in operation" width={900} height={600} />
            <Image className="focus-top tall-shot" src="/assets/images/site/assembly-worker.jpg" alt="Enfrio operator at the assembly station" width={800} height={1200} />
            <Image className="fit-contain" src="/assets/images/site/rad-engine-complete.jpg" alt="Integrated cooling unit with engine" width={1200} height={900} />
          </div>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">COOLING DOMAIN</p>
          <h2>High-performance cooling architecture for critical industrial platforms.</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3>Engine Cooling</h3>
            <p>Aluminum radiator systems with robust heat rejection and field durability.</p>
          </article>
          <article className="card reveal">
            <h3>Thermal Subsystems</h3>
            <p>
              Oil coolers, fuel coolers, charge air coolers and climate condensers engineered for duty cycles.
            </p>
          </article>
          <article className="card reveal">
            <h3>Custom Integration</h3>
            <p>Packaging logic for container constraints, remote environments and OEM installation envelopes.</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">CAPABILITY IN MOTION</p>
          <h2>Three real moments that auto-cycle through Enfrio execution flow.</h2>
        </div>

        <div id="wow-home" className="wow-showcase reveal" data-wow>
          <div className="wow-grid">
            <figure className="wow-media">
              <Image className="active" data-id="fabrication" src="/assets/images/site/welder-action.jpg" alt="Enfrio operator welding a radiator core in front of the company logo" width={1500} height={1000} />
              <Image data-id="machinery" src="/assets/images/site/tube-bending-operator.jpg" alt="Operator at the 6-axis tube bending machine" width={1500} height={1000} />
              <Image data-id="integration" className="fit-contain focus-left" src="/assets/images/site/handwork-detail.jpg" alt="Final hand assembly detail on a cooling unit" width={1500} height={1000} />
            </figure>
            <div className="wow-copy">
              <article className="wow-item active" data-id="fabrication">
                <h3>Fabrication Precision</h3>
                <p>Controlled welding and joining quality on heat-critical assemblies.</p>
              </article>
              <article className="wow-item" data-id="machinery">
                <h3>Advanced Machinery</h3>
                <p>Bending and laser operations designed for repeatable industrial throughput.</p>
              </article>
              <article className="wow-item" data-id="integration">
                <h3>Hands-on Quality</h3>
                <p>Hand-finished detail work on every cooling unit before it leaves the line.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">BUILD WITH ENFRIO</p>
        <h2>Need an execution partner that engineers and delivers with ownership?</h2>
        <p>
          We design, validate and industrialize cooling systems with clear governance and measurable delivery milestones.
        </p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">
            Open strategic conversation
          </Link>
          <Link className="btn ghost" href="/projects">
            View project evidence
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
