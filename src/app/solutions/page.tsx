import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { pageSeo } from "@/lib/site-content";
import { SOLUTIONS } from "@/content/solutions";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(SOLUTIONS);
  return pageSeo("/solutions", seo);
}

export default async function SolutionsPage() {
  const { hero, offer, execution, variants, cta } = await getContent(SOLUTIONS);

  return (
    <SiteShell active="solutions">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-left" src={hero.image} alt={hero.image_alt} width={1600} height={1200} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          <article className="card reveal">
            <h3>{offer.card1_title}</h3>
            <p>{offer.card1_text}</p>
          </article>
          <article className="card reveal">
            <h3>{offer.card2_title}</h3>
            <p>{offer.card2_text}</p>
          </article>
          <article className="card reveal">
            <h3>{offer.card3_title}</h3>
            <p>{offer.card3_text}</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{execution.kicker}</p>
          <h2>{execution.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>{execution.panel1_title}</h3>
            <ul className="checks">
              <li>{execution.panel1_item1}</li>
              <li>{execution.panel1_item2}</li>
              <li>{execution.panel1_item3}</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>{execution.panel2_title}</h3>
            <ul className="checks">
              <li>{execution.panel2_item1}</li>
              <li>{execution.panel2_item2}</li>
              <li>{execution.panel2_item3}</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{variants.kicker}</p>
          <h2>{variants.title}</h2>
        </div>
        <div className="dominant-cluster reveal">
          <Image className="dominant focus-left motor-up" src={variants.photo_main} alt={variants.photo_main_alt} width={1500} height={950} />
          <div className="support">
            <Image className="focus-left" src={variants.photo_2} alt={variants.photo_2_alt} width={1000} height={650} />
            <Image className="focus-left" src={variants.photo_3} alt={variants.photo_3_alt} width={1000} height={650} />
            <Image className="focus-right" src={variants.photo_4} alt={variants.photo_4_alt} width={1000} height={650} />
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">{cta.kicker}</p>
        <h2>{cta.title}</h2>
        <p>{cta.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">
            {cta.button}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
