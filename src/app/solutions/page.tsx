import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { pageSeo } from "@/lib/site-content";
import { SOLUTIONS } from "@/content/solutions";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(SOLUTIONS);
  return pageSeo("/solutions", seo);
}

export default async function SolutionsPage() {
  const { hero, offer, execution, variants, cta } = await getContent(SOLUTIONS);

  const e = await getEdit(SOLUTIONS);

  return (
    <SiteShell active="solutions">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p {...e.hero.lead}>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image {...e.hero.image} priority className="focus-left" src={hero.image} alt={hero.image_alt} width={1600} height={1200} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          <article className="card reveal">
            <h3 {...e.offer.card1_title}>{offer.card1_title}</h3>
            <p {...e.offer.card1_text}>{offer.card1_text}</p>
          </article>
          <article className="card reveal">
            <h3 {...e.offer.card2_title}>{offer.card2_title}</h3>
            <p {...e.offer.card2_text}>{offer.card2_text}</p>
          </article>
          <article className="card reveal">
            <h3 {...e.offer.card3_title}>{offer.card3_title}</h3>
            <p {...e.offer.card3_text}>{offer.card3_text}</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.execution.kicker}>{execution.kicker}</p>
          <h2 {...e.execution.title}>{execution.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3 {...e.execution.panel1_title}>{execution.panel1_title}</h3>
            <ul className="checks">
              <li {...e.execution.panel1_item1}>{execution.panel1_item1}</li>
              <li {...e.execution.panel1_item2}>{execution.panel1_item2}</li>
              <li {...e.execution.panel1_item3}>{execution.panel1_item3}</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3 {...e.execution.panel2_title}>{execution.panel2_title}</h3>
            <ul className="checks">
              <li {...e.execution.panel2_item1}>{execution.panel2_item1}</li>
              <li {...e.execution.panel2_item2}>{execution.panel2_item2}</li>
              <li {...e.execution.panel2_item3}>{execution.panel2_item3}</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.variants.kicker}>{variants.kicker}</p>
          <h2 {...e.variants.title}>{variants.title}</h2>
        </div>
        <div className="dominant-cluster reveal">
          <Image {...e.variants.photo_main} className="dominant focus-left motor-up" src={variants.photo_main} alt={variants.photo_main_alt} width={1500} height={950} />
          <div className="support">
            <Image {...e.variants.photo_2} className="focus-left" src={variants.photo_2} alt={variants.photo_2_alt} width={1000} height={650} />
            <Image {...e.variants.photo_3} className="focus-left" src={variants.photo_3} alt={variants.photo_3_alt} width={1000} height={650} />
            <Image {...e.variants.photo_4} className="focus-right" src={variants.photo_4} alt={variants.photo_4_alt} width={1000} height={650} />
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker" {...e.cta.kicker}>{cta.kicker}</p>
        <h2 {...e.cta.title}>{cta.title}</h2>
        <p {...e.cta.text}>{cta.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact" {...e.cta.button}>
            {cta.button}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
