import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getList, pageSeo } from "@/lib/site-content";
import { INDUSTRIES } from "@/content/industries";
import { MADRID_GALLERY } from "@/content/collections";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(INDUSTRIES);
  return pageSeo("/industries", seo);
}

export default async function IndustriesPage() {
  const [{ hero, sectors, scope, madrid, cta }, photos] = await Promise.all([
    getContent(INDUSTRIES),
    getList(MADRID_GALLERY),
  ]);

  return (
    <SiteShell active="industries">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-right" src={hero.image} alt={hero.image_alt} width={1400} height={1400} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="card reveal media">
            <Image src={sectors.sector1_image} alt={sectors.sector1_image_alt} width={1400} height={900} />
            <h3>{sectors.sector1_title}</h3>
            <p>{sectors.sector1_text}</p>
          </article>
          <article className="card reveal media">
            <Image src={sectors.sector2_image} alt={sectors.sector2_image_alt} width={1400} height={900} />
            <h3>{sectors.sector2_title}</h3>
            <p>{sectors.sector2_text}</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{scope.kicker}</p>
          <h2>{scope.title}</h2>
        </div>
        <div className="grid-4">
          <article className="panel reveal"><h3>{scope.item1_title}</h3><p>{scope.item1_text}</p></article>
          <article className="panel reveal"><h3>{scope.item2_title}</h3><p>{scope.item2_text}</p></article>
          <article className="panel reveal"><h3>{scope.item3_title}</h3><p>{scope.item3_text}</p></article>
          <article className="panel reveal"><h3>{scope.item4_title}</h3><p>{scope.item4_text}</p></article>
        </div>
      </section>

      <section className="section dark-block madrid-case">
        <div className="madrid-head reveal">
          <div>
            <p className="kicker">{madrid.kicker}</p>
            <h2>{madrid.title}</h2>
          </div>
          <article className="panel madrid-why">
            <h3>{madrid.why_title}</h3>
            <p>{madrid.why_text}</p>
            <ul className="checks">
              <li>{madrid.why_item1}</li>
              <li>{madrid.why_item2}</li>
              <li>{madrid.why_item3}</li>
            </ul>
          </article>
        </div>

        <div className="madrid-auto reveal" aria-label="Madrid waste truck project gallery">
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
        <p className="kicker">{cta.kicker}</p>
        <h2>{cta.title}</h2>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">{cta.button}</Link>
        </div>
      </section>
    </SiteShell>
  );
}
