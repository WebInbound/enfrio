import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { pageSeo } from "@/lib/site-content";
import { COMPANY } from "@/content/company";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(COMPANY);
  return pageSeo("/company", seo);
}

export default async function CompanyPage() {
  const { hero, values, method, photos, cta } = await getContent(COMPANY);

  return (
    <SiteShell active="company">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority src={hero.image} alt={hero.image_alt} width={2000} height={1333} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          <article className="card reveal"><h3>{values.card1_title}</h3><p>{values.card1_text}</p></article>
          <article className="card reveal"><h3>{values.card2_title}</h3><p>{values.card2_text}</p></article>
          <article className="card reveal"><h3>{values.card3_title}</h3><p>{values.card3_text}</p></article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{method.kicker}</p>
          <h2>{method.title}</h2>
        </div>
        <ol className="timeline">
          <li className="reveal"><span className="step">01</span><p>{method.step1}</p></li>
          <li className="reveal"><span className="step">02</span><p>{method.step2}</p></li>
          <li className="reveal"><span className="step">03</span><p>{method.step3}</p></li>
          <li className="reveal"><span className="step">04</span><p>{method.step4}</p></li>
        </ol>
      </section>

      <section className="section">
        <div className="dominant-cluster reveal">
          <Image className="dominant" src={photos.photo_main} alt={photos.photo_main_alt} width={1400} height={900} />
          <div className="support">
            <Image src={photos.photo_2} alt={photos.photo_2_alt} width={1500} height={1000} />
            <Image src={photos.photo_3} alt={photos.photo_3_alt} width={1500} height={1000} />
            <Image src={photos.photo_4} alt={photos.photo_4_alt} width={1500} height={1000} />
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
