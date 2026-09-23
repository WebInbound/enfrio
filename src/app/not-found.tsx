import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
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

  const e = await getEdit(NOT_FOUND);

  return (
    <SiteShell active="home" blocks={[NOT_FOUND]}>
      <section className="section cta reveal">
        <p className="kicker" {...e.main.kicker}>{main.kicker}</p>
        <h1 {...e.main.title}>{main.title}</h1>
        <p {...e.main.text}>{main.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/" {...e.main.cta_home}>
            {main.cta_home}
          </Link>
          <Link className="btn ghost" href="/tower-m" {...e.main.cta_mtower}>
            {main.cta_mtower}
          </Link>
          <Link className="btn ghost" href="/contact" {...e.main.cta_contact}>
            {main.cta_contact}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
