import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import EditSpan from "@/components/EditSpan";
import Stat from "@/components/Stat";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { GLOBAL } from "@/content/global";
import { HOME } from "@/content/home";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(HOME);
  return { title: seo.title, description: seo.description };
}

export default async function HomePage() {
  const [c, g, e, ge] = await Promise.all([getContent(HOME), getContent(GLOBAL), getEdit(HOME), getEdit(GLOBAL)]);
  const { hero, model, inside, domain, spotlight, motion, cta } = c;

  return (
    <SiteShell active="home">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p className="lead" {...e.hero.lead}>{hero.lead}</p>
          <div className="btn-row">
            <Link className="btn solid magnetic" href="/contact" {...e.hero.cta_primary}>
              {hero.cta_primary}
            </Link>
            <Link className="btn ghost" href="/solutions" {...e.hero.cta_secondary}>
              {hero.cta_secondary}
            </Link>
          </div>
        </div>
        <figure className="page-hero-media reveal">
          <Image {...e.hero.image} priority className="focus-right" src={hero.image} alt={hero.image_alt} width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.model.kicker}>{model.kicker}</p>
          <h2 {...e.model.title}>{model.title}</h2>
        </div>
        <div className="grid-3">
          <article className="stat reveal">
            <h3 {...e.model.stat1_value}>{model.stat1_value}</h3>
            <p {...e.model.stat1_text}>{model.stat1_text}</p>
          </article>
          <article className="stat reveal">
            <h3><Stat text={model.stat2_value} /></h3>
            <p {...e.model.stat2_text}>{model.stat2_text}</p>
          </article>
          <article className="stat reveal">
            <h3 {...e.model.stat3_value}>{model.stat3_value}</h3>
            <p {...e.model.stat3_text}>{model.stat3_text}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.inside.kicker}>{inside.kicker}</p>
          <h2 {...e.inside.title}>{inside.title}</h2>
        </div>
        <div className="dominant-cluster reveal">
          <Image {...e.inside.photo_main} className="dominant focus-left" src={inside.photo_main} alt={inside.photo_main_alt} width={1400} height={900} />
          <div className="support">
            <Image {...e.inside.photo_2} className="focus-left" src={inside.photo_2} alt={inside.photo_2_alt} width={900} height={600} />
            <Image {...e.inside.photo_3} className="focus-top tall-shot" src={inside.photo_3} alt={inside.photo_3_alt} width={800} height={1200} />
            <Image {...e.inside.photo_4} className="fit-contain" src={inside.photo_4} alt={inside.photo_4_alt} width={1200} height={900} />
          </div>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.domain.kicker}>{domain.kicker}</p>
          <h2 {...e.domain.title}>{domain.title}</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3 {...e.domain.card1_title}>{domain.card1_title}</h3>
            <p {...e.domain.card1_text}>{domain.card1_text}</p>
          </article>
          <article className="card reveal">
            <h3 {...e.domain.card2_title}>{domain.card2_title}</h3>
            <p {...e.domain.card2_text}>{domain.card2_text}</p>
          </article>
          <article className="card reveal">
            <h3 {...e.domain.card3_title}>{domain.card3_title}</h3>
            <p {...e.domain.card3_text}>{domain.card3_text}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="mtower-spotlight reveal">
          <div className="mtower-spotlight-content">
            <p className="kicker" {...e.spotlight.kicker}>{spotlight.kicker}</p>
            <h2 {...e.spotlight.title}>{spotlight.title}</h2>
            <p>
              <EditSpan a={e.spotlight.text_start}>{spotlight.text_start}</EditSpan>{" "}
              <strong><Stat text={spotlight.text_stat} /></strong>{" "}
              <EditSpan a={e.spotlight.text_middle}>{spotlight.text_middle}</EditSpan>{" "}
              <strong {...e.spotlight.text_bold}>{spotlight.text_bold}</strong>{" "}
              <EditSpan a={e.spotlight.text_end}>{spotlight.text_end}</EditSpan>
            </p>
            <ul className="checks">
              <li {...e.spotlight.check1}>{spotlight.check1}</li>
              <li {...e.spotlight.check2}>{spotlight.check2}</li>
              <li {...e.spotlight.check3}>{spotlight.check3}</li>
              <li {...e.spotlight.check4}>{spotlight.check4}</li>
            </ul>
            <div className="btn-row">
              <Link className="btn solid magnetic" href="/tower-m" {...e.spotlight.cta_primary}>{spotlight.cta_primary}</Link>
              <Link className="btn ghost" href="/tower-m#mtower-sizer" {...e.spotlight.cta_secondary}>{spotlight.cta_secondary}</Link>
            </div>
          </div>
          <figure className="mtower-spotlight-media mtower-spotlight-media--render">
            <Image {...ge.images.mtower_render} src={g.images.mtower_render} alt={spotlight.image_alt} width={1040} height={1080} loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.motion.kicker}>{motion.kicker}</p>
          <h2 {...e.motion.title}>{motion.title}</h2>
        </div>

        <div id="wow-home" className="wow-showcase reveal" data-wow>
          <div className="wow-grid">
            <figure className="wow-media">
              <Image {...e.motion.item1_image} className="active" data-id="fabrication" src={motion.item1_image} alt={motion.item1_image_alt} width={1500} height={1000} />
              <Image {...e.motion.item2_image} data-id="machinery" src={motion.item2_image} alt={motion.item2_image_alt} width={1500} height={1000} />
              <Image {...e.motion.item3_image} data-id="integration" className="fit-contain focus-left" src={motion.item3_image} alt={motion.item3_image_alt} width={1500} height={1000} />
            </figure>
            <div className="wow-copy">
              <article className="wow-item active" data-id="fabrication" tabIndex={0}>
                <h3 {...e.motion.item1_title}>{motion.item1_title}</h3>
                <p {...e.motion.item1_text}>{motion.item1_text}</p>
              </article>
              <article className="wow-item" data-id="machinery" tabIndex={0}>
                <h3 {...e.motion.item2_title}>{motion.item2_title}</h3>
                <p {...e.motion.item2_text}>{motion.item2_text}</p>
              </article>
              <article className="wow-item" data-id="integration" tabIndex={0}>
                <h3 {...e.motion.item3_title}>{motion.item3_title}</h3>
                <p {...e.motion.item3_text}>{motion.item3_text}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker" {...e.cta.kicker}>{cta.kicker}</p>
        <h2 {...e.cta.title}>{cta.title}</h2>
        <p {...e.cta.text}>{cta.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid magnetic" href="/contact" {...e.cta.cta_primary}>
            {cta.cta_primary}
          </Link>
          <Link className="btn ghost" href="/projects" {...e.cta.cta_secondary}>
            {cta.cta_secondary}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
