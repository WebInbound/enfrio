import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { getGlobal, getList, pageSeo } from "@/lib/site-content";
import { PROJECTS_PAGE } from "@/content/projects";
import { PROJECTS, PROJECT_SNAPSHOTS } from "@/content/collections";
import { localePath, type Lang } from "@/lib/i18n";

export async function metadata(lang: Lang): Promise<Metadata> {
  const { seo } = await getContent(PROJECTS_PAGE, lang);
  return pageSeo("/projects", seo, lang);
}

export default async function ProjectsPage({ lang }: { lang: Lang }) {
  const [{ hero, platform, flow, snapshots, closing }, g, references, gallery] = await Promise.all([
    getContent(PROJECTS_PAGE, lang),
    getGlobal(lang),
    getList(PROJECTS, lang),
    getList(PROJECT_SNAPSHOTS, lang),
  ]);

  const e = await getEdit(PROJECTS_PAGE, lang);

  return (
    <SiteShell lang={lang} active="projects">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p {...e.hero.lead}>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image {...e.hero.image} priority className="focus-left" src={hero.image} alt={hero.image_alt} width={1200} height={900} />
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
          <p className="kicker" {...e.platform.kicker}>{platform.kicker}</p>
          <h2 {...e.platform.title}>{platform.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3 {...e.platform.perf_title}>{platform.perf_title}</h3>
            <ul className="checks">
              <li {...e.platform.perf_item1}>{platform.perf_item1}</li>
              <li {...e.platform.perf_item2}>{platform.perf_item2}</li>
              <li {...e.platform.perf_item3}>{platform.perf_item3}</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3 {...e.platform.options_title}>{platform.options_title}</h3>
            <ul className="checks">
              <li {...e.platform.options_item1}>{platform.options_item1}</li>
              <li {...e.platform.options_item2}>{platform.options_item2}</li>
              <li {...e.platform.options_item3}>{platform.options_item3}</li>
            </ul>
            <div className="btn-row">
              <Link className="btn solid" href={localePath(lang, "/tower-m")} {...e.platform.options_button}>
                {platform.options_button}
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.flow.kicker}>{flow.kicker}</p>
          <h2 {...e.flow.title}>{flow.title}</h2>
        </div>

        <div className="wow-showcase reveal" data-wow>
          <div className="wow-grid">
            <figure className="wow-media">
              <Image {...e.flow.item1_image} className="active" data-id="expo" src={flow.item1_image} alt={flow.item1_image_alt} width={1400} height={900} />
              <Image {...e.flow.item2_image} data-id="installed" className="fit-contain" src={flow.item2_image} alt={flow.item2_image_alt} width={1400} height={900} />
              <Image {...e.flow.item3_image} data-id="delivery" className="focus-right" src={flow.item3_image} alt={flow.item3_image_alt} width={1400} height={1050} />
            </figure>
            <div className="wow-copy">
              <article className="wow-item active" data-id="expo">
                <h3 {...e.flow.item1_title}>{flow.item1_title}</h3>
                <p {...e.flow.item1_text}>{flow.item1_text}</p>
              </article>
              <article className="wow-item" data-id="installed">
                <h3 {...e.flow.item2_title}>{flow.item2_title}</h3>
                <p {...e.flow.item2_text}>{flow.item2_text}</p>
              </article>
              <article className="wow-item" data-id="delivery">
                <h3 {...e.flow.item3_title}>{flow.item3_title}</h3>
                <p {...e.flow.item3_text}>{flow.item3_text}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.snapshots.kicker}>{snapshots.kicker}</p>
          <h2 {...e.snapshots.title}>{snapshots.title}</h2>
        </div>
        <div className="editorial-rail auto-lux-wrap reveal" aria-label={g.a11y.snapshots_gallery}>
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
            <p className="kicker" {...e.closing.iso_kicker}>{closing.iso_kicker}</p>
            <h3 {...e.closing.iso_title}>{closing.iso_title}</h3>
            <p {...e.closing.iso_text}>{closing.iso_text}</p>
            <div className="btn-row">
              <a className="btn solid" href={g.documents.iso_certificate_url} target="_blank" rel="noopener noreferrer" {...e.closing.iso_button}>
                {closing.iso_button}
              </a>
            </div>
          </article>
          <article className="info reveal">
            <p className="kicker" {...e.closing.contact_kicker}>{closing.contact_kicker}</p>
            <h3 {...e.closing.contact_title}>{closing.contact_title}</h3>
            <p {...e.closing.contact_text}>{closing.contact_text}</p>
            <div className="btn-row">
              <Link className="btn ghost" href={localePath(lang, "/contact")} {...e.closing.contact_button}>
                {closing.contact_button}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
