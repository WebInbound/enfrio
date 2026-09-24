import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { pageSeo } from "@/lib/site-content";
import { COMPANY } from "@/content/company";
import { localePath, type Lang } from "@/lib/i18n";

export async function metadata(lang: Lang): Promise<Metadata> {
  const { seo } = await getContent(COMPANY, lang);
  return pageSeo("/company", seo, lang);
}

export default async function CompanyPage({ lang }: { lang: Lang }) {
  const { hero, values, method, photos, cta } = await getContent(COMPANY, lang);

  const e = await getEdit(COMPANY, lang);

  return (
    <SiteShell lang={lang} active="company">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p {...e.hero.lead}>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image {...e.hero.image} priority src={hero.image} alt={hero.image_alt} width={2000} height={1333} />
        </figure>
      </section>

      <section className="section">
        <div className="grid-3">
          <article className="card reveal"><h3 {...e.values.card1_title}>{values.card1_title}</h3><p {...e.values.card1_text}>{values.card1_text}</p></article>
          <article className="card reveal"><h3 {...e.values.card2_title}>{values.card2_title}</h3><p {...e.values.card2_text}>{values.card2_text}</p></article>
          <article className="card reveal"><h3 {...e.values.card3_title}>{values.card3_title}</h3><p {...e.values.card3_text}>{values.card3_text}</p></article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.method.kicker}>{method.kicker}</p>
          <h2 {...e.method.title}>{method.title}</h2>
        </div>
        <ol className="timeline">
          <li className="reveal"><span className="step">01</span><p {...e.method.step1}>{method.step1}</p></li>
          <li className="reveal"><span className="step">02</span><p {...e.method.step2}>{method.step2}</p></li>
          <li className="reveal"><span className="step">03</span><p {...e.method.step3}>{method.step3}</p></li>
          <li className="reveal"><span className="step">04</span><p {...e.method.step4}>{method.step4}</p></li>
        </ol>
      </section>

      <section className="section">
        <div className="dominant-cluster reveal">
          <Image {...e.photos.photo_main} className="dominant" src={photos.photo_main} alt={photos.photo_main_alt} width={1400} height={900} />
          <div className="support">
            <Image {...e.photos.photo_2} src={photos.photo_2} alt={photos.photo_2_alt} width={1500} height={1000} />
            <Image {...e.photos.photo_3} src={photos.photo_3} alt={photos.photo_3_alt} width={1500} height={1000} />
            <Image {...e.photos.photo_4} src={photos.photo_4} alt={photos.photo_4_alt} width={1500} height={1000} />
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
