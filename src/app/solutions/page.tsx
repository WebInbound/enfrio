import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Enfrio Solutions | 5P Execution and Cooling Systems",
  description:
    "Enfrio business solutions across project management, engineering, process definition, procurement and production transfer.",
};

export default function SolutionsPage() {
  return (
    <SiteShell active="solutions">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">SOLUTIONS</p>
          <h1>Commercial clarity with industrial execution depth.</h1>
          <p>
            Enfrio combines engineering consulting, technology, and process outsourcing in one scalable delivery model for
            cooling-intensive platforms.
          </p>
        </div>
        <figure className="page-hero-media reveal">
          <Image className="focus-left" src="/assets/images/site/installed-v20-integrated.jpg" alt="Integrated Enfrio cooling package mounted on a finished engine" width={1600} height={1200} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          <article className="card reveal">
            <h3>Industrial Cooling Systems</h3>
            <p>Water radiators, oil coolers, fuel coolers and charge air coolers configured for application-specific duty cycles.</p>
          </article>
          <article className="card reveal">
            <h3>OEM Cooling Solutions</h3>
            <p>
              Custom architecture engineered for footprint constraints, serviceability, and repeatable manufacturing performance.
            </p>
          </article>
          <article className="card reveal">
            <h3>Energy-Efficient Thermal Packages</h3>
            <p>High-efficiency cores, optimized fan power and low-noise integration for cost-effective operation.</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">5P EXECUTION</p>
          <h2>One integrated model from project governance to production transfer.</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>Project + Product</h3>
            <ul className="checks">
              <li>Program governance and phase-gate control</li>
              <li>Thermal sizing and packaging engineering</li>
              <li>Design aligned to manufacturability</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>Process + Procurement + Transfer</h3>
            <ul className="checks">
              <li>Industrial process definition and validation loops</li>
              <li>Supplier coordination on critical components</li>
              <li>Controlled ramp-up and production stabilization</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">SOLUTION VARIANTS</p>
          <h2>One main architecture, adapted to multiple installation contexts.</h2>
        </div>
        <div className="dominant-cluster reveal">
          <Image className="dominant focus-left motor-up" src="/assets/images/site/installed-v20-integrated.jpg" alt="Integrated finished cooling package with engine" width={1500} height={950} />
          <div className="support">
            <Image className="focus-left" src="/assets/images/site/installed-baudouin-canopy.jpg" alt="Finished product in opened canopy configuration" width={1000} height={650} />
            <Image className="focus-left" src="/assets/images/site/product-complete-b.jpg" alt="Finished integrated cooling module" width={1000} height={650} />
            <Image className="focus-right" src="/assets/images/site/rad-engine-complete.jpg" alt="Final engine with installed Enfrio cooling module" width={1000} height={650} />
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">COMMERCIAL NEXT STEP</p>
        <h2>Share your requirements and receive a practical execution scope.</h2>
        <p>We can start from concept notes or existing technical data and build a phased delivery roadmap.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">
            Start solution scoping
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
