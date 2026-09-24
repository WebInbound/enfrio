import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { getGlobal, getList, pageSeo } from "@/lib/site-content";
import { INDUSTRIES } from "@/content/industries";
import { MADRID_GALLERY } from "@/content/collections";
import { localePath, type Lang } from "@/lib/i18n";

export async function metadata(lang: Lang): Promise<Metadata> {
  const { seo } = await getContent(INDUSTRIES, lang);
  return pageSeo("/industries", seo, lang);
}

export default async function IndustriesPage({ lang }: { lang: Lang }) {
  const [{ hero, sectors, scope, madrid, cta }, photos, { a11y }] = await Promise.all([
    getContent(INDUSTRIES, lang),
    getList(MADRID_GALLERY, lang),
    getGlobal(lang),
  ]);

  const e = await getEdit(INDUSTRIES, lang);

  return (
    <SiteShell lang={lang} active="industries">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p {...e.hero.lead}>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image {...e.hero.image} priority className="focus-right" src={hero.image} alt={hero.image_alt} width={1400} height={1400} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="card reveal media">
            <Image {...e.sectors.sector1_image} src={sectors.sector1_image} alt={sectors.sector1_image_alt} width={1400} height={900} />
            <h3 {...e.sectors.sector1_title}>{sectors.sector1_title}</h3>
            <p {...e.sectors.sector1_text}>{sectors.sector1_text}</p>
          </article>
          <article className="card reveal media">
            <Image {...e.sectors.sector2_image} src={sectors.sector2_image} alt={sectors.sector2_image_alt} width={1400} height={900} />
            <h3 {...e.sectors.sector2_title}>{sectors.sector2_title}</h3>
            <p {...e.sectors.sector2_text}>{sectors.sector2_text}</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.scope.kicker}>{scope.kicker}</p>
          <h2 {...e.scope.title}>{scope.title}</h2>
        </div>
        <div className="grid-4">
          <article className="panel reveal"><h3 {...e.scope.item1_title}>{scope.item1_title}</h3><p {...e.scope.item1_text}>{scope.item1_text}</p></article>
          <article className="panel reveal"><h3 {...e.scope.item2_title}>{scope.item2_title}</h3><p {...e.scope.item2_text}>{scope.item2_text}</p></article>
          <article className="panel reveal"><h3 {...e.scope.item3_title}>{scope.item3_title}</h3><p {...e.scope.item3_text}>{scope.item3_text}</p></article>
          <article className="panel reveal"><h3 {...e.scope.item4_title}>{scope.item4_title}</h3><p {...e.scope.item4_text}>{scope.item4_text}</p></article>
        </div>
      </section>

      <section className="section dark-block madrid-case">
        <div className="madrid-head reveal">
          <div>
            <p className="kicker" {...e.madrid.kicker}>{madrid.kicker}</p>
            <h2 {...e.madrid.title}>{madrid.title}</h2>
          </div>
          <article className="panel madrid-why">
            <h3 {...e.madrid.why_title}>{madrid.why_title}</h3>
            <p {...e.madrid.why_text}>{madrid.why_text}</p>
            <ul className="checks">
              <li {...e.madrid.why_item1}>{madrid.why_item1}</li>
              <li {...e.madrid.why_item2}>{madrid.why_item2}</li>
              <li {...e.madrid.why_item3}>{madrid.why_item3}</li>
            </ul>
          </article>
        </div>

        <div className="madrid-auto reveal" aria-label={a11y.madrid_gallery}>
          <div className="madrid-auto-track">
            {photos.map((p, i) => (
              <figure key={`m1-${i}`} className="photo-card">
                <Image className="focus-bottom" src={p.image} alt={p.alt} width={1200} height={900} />
                <figcaption>{p.title}</figcaption>
              </figure>
            ))}
            {photos.map((p, i) => (
              <figure key={`m2-${i}`} className="photo-card" aria-hidden="true">
                <Image className="focus-bottom" src={p.image} alt="" width={1200} height={900} />
                <figcaption>{p.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker" {...e.cta.kicker}>{cta.kicker}</p>
        <h2 {...e.cta.title}>{cta.title}</h2>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href={localePath(lang, "/contact")} {...e.cta.button}>{cta.button}</Link>
        </div>
      </section>
    </SiteShell>
  );
}
