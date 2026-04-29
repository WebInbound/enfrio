import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio Company | Team and Industrial Culture",
  description: "Enfrio company profile: people, expertise and production culture behind cooling solutions.",
};

export default function CompanyPage() {
  return (
    <SiteShell active="company">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">ABOUT ENFRIO</p>
          <h1>Real team, real factory, real execution accountability.</h1>
          <p>Enfrio combines engineering leadership with production discipline to deliver cooling systems that work reliably in real operating conditions.</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image className="focus-top" src="/assets/images/site/team-office-floor.jpg" alt="Enfrio team at production site" width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          <article className="card reveal"><h3>Engineering DNA</h3><p>Technical depth across thermal design, packaging and manufacturability decisions.</p></article>
          <article className="card reveal"><h3>Factory Mindset</h3><p>Hands-on production culture where process quality is treated as a product itself.</p></article>
          <article className="card reveal"><h3>Partner Behavior</h3><p>Transparent communication, fast problem solving and ownership of outcomes.</p></article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">WORKING METHOD</p>
          <h2>Execution principles that keep complex programs under control.</h2>
        </div>
        <ol className="timeline">
          <li className="reveal"><span className="step">01</span><p>Align objectives, constraints and measurable performance targets with customer teams.</p></li>
          <li className="reveal"><span className="step">02</span><p>Engineer robust thermal architecture balancing performance, footprint and serviceability.</p></li>
          <li className="reveal"><span className="step">03</span><p>Industrialize through process controls, supplier alignment and quality checkpoints.</p></li>
          <li className="reveal"><span className="step">04</span><p>Support transfer, ramp-up and stabilization with direct accountability on delivery.</p></li>
        </ol>
      </section>

      <section className="section">
        <div className="dominant-cluster reveal">
          <Image className="dominant" src="/assets/images/site/prod-assembly-b.jpg" alt="Factory assembly operation" width={1400} height={900} />
          <div className="support">
            <Image src="/assets/images/site/welder-action.jpg" alt="Welder finishing a radiator core in front of the Enfrio logo" width={1500} height={1000} />
            <Image src="/assets/images/site/assembly-worker.jpg" alt="Operator preparing components at the assembly station" width={1500} height={1000} />
            <Image src="/assets/images/site/handwork-detail.jpg" alt="Hand-finishing detail on a cooling unit" width={1500} height={1000} />
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">COLLABORATE</p>
        <h2>Looking for a team that owns outcomes, not only tasks?</h2>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">Book leadership intro</Link>
        </div>
      </section>
    </SiteShell>
  );
}
