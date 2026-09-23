import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Stat from "@/components/Stat";
import { getContent } from "@/lib/kiwi";
import { GLOBAL } from "@/content/global";
import { HOME } from "@/content/home";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(HOME);
  return { title: seo.title, description: seo.description };
}

export default async function HomePage() {
  const [c, g] = await Promise.all([getContent(HOME), getContent(GLOBAL)]);
  const { hero, model, inside, domain, spotlight, motion, cta } = c;

  return (
    <SiteShell active="home">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p className="lead">{hero.lead}</p>
          <div className="btn-row">
            <Link className="btn solid magnetic" href="/contact">
              {hero.cta_primary}
            </Link>
            <Link className="btn ghost" href="/solutions">
              {hero.cta_secondary}
            </Link>
          </div>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-right" src={hero.image} alt={hero.image_alt} width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{model.kicker}</p>
          <h2>{model.title}</h2>
        </div>
        <div className="grid-3">
          <article className="stat reveal">
            <h3>{model.stat1_value}</h3>
            <p>{model.stat1_text}</p>
          </article>
          <article className="stat reveal">
            <h3><Stat text={model.stat2_value} /></h3>
            <p>{model.stat2_text}</p>
          </article>
          <article className="stat reveal">
            <h3>{model.stat3_value}</h3>
            <p>{model.stat3_text}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{inside.kicker}</p>
          <h2>{inside.title}</h2>
        </div>
        <div className="dominant-cluster reveal">
          <Image className="dominant focus-left" src={inside.photo_main} alt={inside.photo_main_alt} width={1400} height={900} />
          <div className="support">
            <Image className="focus-left" src={inside.photo_2} alt={inside.photo_2_alt} width={900} height={600} />
            <Image className="focus-top tall-shot" src={inside.photo_3} alt={inside.photo_3_alt} width={800} height={1200} />
            <Image className="fit-contain" src={inside.photo_4} alt={inside.photo_4_alt} width={1200} height={900} />
          </div>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{domain.kicker}</p>
          <h2>{domain.title}</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3>{domain.card1_title}</h3>
            <p>{domain.card1_text}</p>
          </article>
          <article className="card reveal">
            <h3>{domain.card2_title}</h3>
            <p>{domain.card2_text}</p>
          </article>
          <article className="card reveal">
            <h3>{domain.card3_title}</h3>
            <p>{domain.card3_text}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="mtower-spotlight reveal">
          <div className="mtower-spotlight-content">
            <p className="kicker">{spotlight.kicker}</p>
            <h2>{spotlight.title}</h2>
            <p>
              {spotlight.text_start}{" "}
              <strong><Stat text={spotlight.text_stat} /></strong>{" "}
              {spotlight.text_middle}{" "}
              <strong>{spotlight.text_bold}</strong>{" "}
              {spotlight.text_end}
            </p>
            <ul className="checks">
              <li>{spotlight.check1}</li>
              <li>{spotlight.check2}</li>
              <li>{spotlight.check3}</li>
              <li>{spotlight.check4}</li>
            </ul>
            <div className="btn-row">
              <Link className="btn solid magnetic" href="/tower-m">{spotlight.cta_primary}</Link>
              <Link className="btn ghost" href="/tower-m#mtower-sizer">{spotlight.cta_secondary}</Link>
            </div>
          </div>
          <figure className="mtower-spotlight-media mtower-spotlight-media--render">
            <Image src={g.images.mtower_render} alt={spotlight.image_alt} width={1040} height={1080} loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{motion.kicker}</p>
          <h2>{motion.title}</h2>
        </div>

        <div id="wow-home" className="wow-showcase reveal" data-wow>
          <div className="wow-grid">
            <figure className="wow-media">
              <Image className="active" data-id="fabrication" src={motion.item1_image} alt={motion.item1_image_alt} width={1500} height={1000} />
              <Image data-id="machinery" src={motion.item2_image} alt={motion.item2_image_alt} width={1500} height={1000} />
              <Image data-id="integration" className="fit-contain focus-left" src={motion.item3_image} alt={motion.item3_image_alt} width={1500} height={1000} />
            </figure>
            <div className="wow-copy">
              <article className="wow-item active" data-id="fabrication" tabIndex={0}>
                <h3>{motion.item1_title}</h3>
                <p>{motion.item1_text}</p>
              </article>
              <article className="wow-item" data-id="machinery" tabIndex={0}>
                <h3>{motion.item2_title}</h3>
                <p>{motion.item2_text}</p>
              </article>
              <article className="wow-item" data-id="integration" tabIndex={0}>
                <h3>{motion.item3_title}</h3>
                <p>{motion.item3_text}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">{cta.kicker}</p>
        <h2>{cta.title}</h2>
        <p>{cta.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid magnetic" href="/contact">
            {cta.cta_primary}
          </Link>
          <Link className="btn ghost" href="/projects">
            {cta.cta_secondary}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
