import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getList, pageSeo } from "@/lib/site-content";
import { TECHNOLOGY } from "@/content/technology";
import { MACHINERY_GALLERY } from "@/content/collections";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(TECHNOLOGY);
  return pageSeo("/technology", seo);
}

export default async function TechnologyPage() {
  const [{ hero, flow, machinery, cta }, gallery] = await Promise.all([
    getContent(TECHNOLOGY),
    getList(MACHINERY_GALLERY),
  ]);

  return (
    <SiteShell active="technology">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-left" src={hero.image} alt={hero.image_alt} width={1500} height={1000} />
        </figure>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{flow.kicker}</p>
          <h2>{flow.title}</h2>
        </div>

        <div className="process-story">
          <div className="process-steps reveal">
            <article className="process-step active" tabIndex={0} data-image="bending">
              <h3>{flow.step1_title}</h3>
              <p>{flow.step1_text}</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="laser">
              <h3>{flow.step2_title}</h3>
              <p>{flow.step2_text}</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="quality">
              <h3>{flow.step3_title}</h3>
              <p>{flow.step3_text}</p>
            </article>
            <article className="process-step" tabIndex={0} data-image="assembly">
              <h3>{flow.step4_title}</h3>
              <p>{flow.step4_text}</p>
            </article>
          </div>
          <figure className="process-visual reveal">
            <Image className="active" data-id="bending" src={flow.step1_image} alt={flow.step1_image_alt} width={1500} height={1000} />
            <Image data-id="laser" src={flow.step2_image} alt={flow.step2_image_alt} width={1400} height={900} />
            <Image data-id="quality" src={flow.step3_image} alt={flow.step3_image_alt} width={1400} height={900} />
            <Image data-id="assembly" src={flow.step4_image} alt={flow.step4_image_alt} width={1500} height={1000} />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{machinery.kicker}</p>
          <h2>{machinery.title}</h2>
        </div>
        <div className="editorial-rail auto-lux-wrap reveal" aria-label="Machinery detail auto gallery">
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
        <p className="kicker">{cta.kicker}</p>
        <h2>{cta.title}</h2>
        <p>{cta.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">{cta.button}</Link>
        </div>
      </section>
    </SiteShell>
  );
}
