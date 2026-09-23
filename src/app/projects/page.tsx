import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getGlobal, getList, pageSeo } from "@/lib/site-content";
import { PROJECTS_PAGE } from "@/content/projects";
import { PROJECTS, PROJECT_SNAPSHOTS } from "@/content/collections";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(PROJECTS_PAGE);
  return pageSeo("/projects", seo);
}

export default async function ProjectsPage() {
  const [{ hero, platform, flow, snapshots, closing }, g, references, gallery] = await Promise.all([
    getContent(PROJECTS_PAGE),
    getGlobal(),
    getList(PROJECTS),
    getList(PROJECT_SNAPSHOTS),
  ]);

  return (
    <SiteShell active="projects">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-left" src={hero.image} alt={hero.image_alt} width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          {references.map((p, i) => (
            <article key={i} className="panel reveal media">
              <Image className="fit-contain focus-left" src={p.image} alt={p.alt} width={1200} height={900} />
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{platform.kicker}</p>
          <h2>{platform.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>{platform.perf_title}</h3>
            <ul className="checks">
              <li>{platform.perf_item1}</li>
              <li>{platform.perf_item2}</li>
              <li>{platform.perf_item3}</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>{platform.options_title}</h3>
            <ul className="checks">
              <li>{platform.options_item1}</li>
              <li>{platform.options_item2}</li>
              <li>{platform.options_item3}</li>
            </ul>
            <div className="btn-row">
              <Link className="btn solid" href="/tower-m">
                {platform.options_button}
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{flow.kicker}</p>
          <h2>{flow.title}</h2>
        </div>

        <div className="wow-showcase reveal" data-wow>
          <div className="wow-grid">
            <figure className="wow-media">
              <Image className="active" data-id="expo" src={flow.item1_image} alt={flow.item1_image_alt} width={1400} height={900} />
              <Image data-id="installed" className="fit-contain" src={flow.item2_image} alt={flow.item2_image_alt} width={1400} height={900} />
              <Image data-id="delivery" className="focus-right" src={flow.item3_image} alt={flow.item3_image_alt} width={1400} height={1050} />
            </figure>
            <div className="wow-copy">
              <article className="wow-item active" data-id="expo">
                <h3>{flow.item1_title}</h3>
                <p>{flow.item1_text}</p>
              </article>
              <article className="wow-item" data-id="installed">
                <h3>{flow.item2_title}</h3>
                <p>{flow.item2_text}</p>
              </article>
              <article className="wow-item" data-id="delivery">
                <h3>{flow.item3_title}</h3>
                <p>{flow.item3_text}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{snapshots.kicker}</p>
          <h2>{snapshots.title}</h2>
        </div>
        <div className="editorial-rail auto-lux-wrap reveal" aria-label="Project snapshots auto gallery">
          <div className="auto-lux-track">
            {gallery.map((s, i) => (
              <figure key={`s-${i}`} className="auto-lux-card">
                <Image src={s.image} alt={s.alt} width={1200} height={900} />
                <figcaption>{s.title}</figcaption>
              </figure>
            ))}

            {gallery.map((s, i) => (
              <figure key={`s2-${i}`} className="auto-lux-card" aria-hidden="true">
                <Image src={s.image} alt="" width={1200} height={900} />
                <figcaption>{s.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="info reveal">
            <p className="kicker">{closing.iso_kicker}</p>
            <h3>{closing.iso_title}</h3>
            <p>{closing.iso_text}</p>
            <div className="btn-row">
              <a className="btn solid" href={g.documents.iso_certificate_url} target="_blank" rel="noopener noreferrer">
                {closing.iso_button}
              </a>
            </div>
          </article>
          <article className="info reveal">
            <p className="kicker">{closing.contact_kicker}</p>
            <h3>{closing.contact_title}</h3>
            <p>{closing.contact_text}</p>
            <div className="btn-row">
              <Link className="btn ghost" href="/contact">
                {closing.contact_button}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
