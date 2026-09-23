import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { NOT_FOUND } from "@/content/global";

export async function generateMetadata(): Promise<Metadata> {
  const { main } = await getContent(NOT_FOUND);
  return {
    title: main.seo_title,
    description: main.seo_description,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const { main } = await getContent(NOT_FOUND);

  return (
    <SiteShell active="home">
      <section className="section cta reveal">
        <p className="kicker">{main.kicker}</p>
        <h1>{main.title}</h1>
        <p>{main.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/">
            {main.cta_home}
          </Link>
          <Link className="btn ghost" href="/tower-m">
            {main.cta_mtower}
          </Link>
          <Link className="btn ghost" href="/contact">
            {main.cta_contact}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
