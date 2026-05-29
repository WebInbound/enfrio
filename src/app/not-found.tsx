import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Page not found | Enfrio",
  description: "The page you were looking for doesn't exist on enfrio.it.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteShell active="home">
      <section className="section cta reveal">
        <p className="kicker">404</p>
        <h1>We couldn&apos;t find that page.</h1>
        <p>
          The link may be outdated, or the page may have moved. From here you
          can head back to the home page, explore our flagship M Tower
          platform, or get in touch with the Enfrio team.
        </p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/">
            Back to home
          </Link>
          <Link className="btn ghost" href="/tower-m">
            Explore M Tower
          </Link>
          <Link className="btn ghost" href="/contact">
            Talk to us
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
