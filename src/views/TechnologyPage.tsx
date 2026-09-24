import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { getGlobal, getList, pageSeo } from "@/lib/site-content";
import { TECHNOLOGY } from "@/content/technology";
import { MACHINERY_GALLERY } from "@/content/collections";
import { localePath, type Lang } from "@/lib/i18n";

export async function metadata(lang: Lang): Promise<Metadata> {
  const { seo } = await getContent(TECHNOLOGY, lang);
  return pageSeo("/technology", seo, lang);
}

export default async function TechnologyPage({ lang }: { lang: Lang }) {
  const [{ hero, flow, machinery, cta }, gallery, { a11y }] = await Promise.all([
    getContent(TECHNOLOGY, lang),
    getList(MACHINERY_GALLERY, lang),
    getGlobal(lang),
  ]);

  const e = await getEdit(TECHNOLOGY, lang);

  return (
    <SiteShell lang={lang} active="technology">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p {...e.hero.lead}>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image {...e.hero.image} priority className="focus-left" src={hero.image} alt={hero.image_alt} width={1500} height={1000} />
        </figure>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.flow.kicker}>{flow.kicker}</p>
          <h2 {...e.flow.title}>{flow.title}</h2>
        </div>

        <div className="process-story">
          <div className="process-steps reveal">
            <article className="process-step active" tabIndex={0} data-image="bending">
              <h3 {...e.flow.step1_title}>{flow.step1_title}</h3>
              <p {...e.flow.step1_text}>{flow.step1_text}</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="laser">
              <h3 {...e.flow.step2_title}>{flow.step2_title}</h3>
              <p {...e.flow.step2_text}>{flow.step2_text}</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="quality">
              <h3 {...e.flow.step3_title}>{flow.step3_title}</h3>
              <p {...e.flow.step3_text}>{flow.step3_text}</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="assembly">
              <h3 {...e.flow.step4_title}>{flow.step4_title}</h3>
              <p {...e.flow.step4_text}>{flow.step4_text}</p>
            </article>
          </div>
          <figure className="process-visual reveal">
            <Image {...e.flow.step1_image} className="active" data-id="bending" src={flow.step1_image} alt={flow.step1_image_alt} width={1500} height={1000} />
            <Image {...e.flow.step2_image} data-id="laser" src={flow.step2_image} alt={flow.step2_image_alt} width={1400} height={900} />
            <Image {...e.flow.step3_image} data-id="quality" src={flow.step3_image} alt={flow.step3_image_alt} width={1400} height={900} />
            <Image {...e.flow.step4_image} data-id="assembly" src={flow.step4_image} alt={flow.step4_image_alt} width={1500} height={1000} />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.machinery.kicker}>{machinery.kicker}</p>
          <h2 {...e.machinery.title}>{machinery.title}</h2>
        </div>
        <div className="editorial-rail auto-lux-wrap reveal" aria-label={a11y.machinery_gallery}>
          <div className="auto-lux-track">
            {gallery.map((g, i) => (
              <figure key={`g-${i}`} className="auto-lux-card">
                <Image src={g.image} alt={g.alt} width={1200} height={900} />
                <figcaption>{g.title}</figcaption>
              </figure>
            ))}
            {gallery.map((g, i) => (
              <figure key={`g2-${i}`} className="auto-lux-card" aria-hidden="true">
                <Image src={g.image} alt="" width={1200} height={900} />
                <figcaption>{g.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker" {...e.cta.kicker}>{cta.kicker}</p>
        <h2 {...e.cta.title}>{cta.title}</h2>
        <p {...e.cta.text}>{cta.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href={localePath(lang, "/contact")} {...e.cta.button}>{cta.button}</Link>
        </div>
      </section>
    </SiteShell>
  );
}
