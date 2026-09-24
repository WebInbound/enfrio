import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { getGlobal, pageSeo } from "@/lib/site-content";
import { QHSE } from "@/content/qhse";
import type { Lang } from "@/lib/i18n";
import { fill } from "@/lib/content-format";

export async function metadata(lang: Lang): Promise<Metadata> {
  const { seo } = await getContent(QHSE, lang);
  return pageSeo("/qhse", seo, lang);
}

export default async function QhsePage({ lang }: { lang: Lang }) {
  const [{ hero, pillars: p, governance, closing }, g] = await Promise.all([getContent(QHSE, lang), getGlobal(lang)]);
  const email = g.company.email;

  const e = await getEdit(QHSE, lang);

  return (
    <SiteShell lang={lang} active="qhse">
      <section className="page-hero">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p className="lead" {...e.hero.lead}>{hero.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.pillars.kicker}>{p.kicker}</p>
          <h2 {...e.pillars.title}>{p.title}</h2>
        </div>
        <div className="grid-2">
          <article className="card reveal">
            <h3 {...e.pillars.quality_title}>{p.quality_title}</h3>
            <ul className="checks">
              <li {...e.pillars.quality_1}>{p.quality_1}</li>
              <li {...e.pillars.quality_2}>{p.quality_2}</li>
              <li {...e.pillars.quality_3}>{p.quality_3}</li>
              <li {...e.pillars.quality_4}>{p.quality_4}</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3 {...e.pillars.safety_title}>{p.safety_title}</h3>
            <ul className="checks">
              <li {...e.pillars.safety_1}>{p.safety_1}</li>
              <li {...e.pillars.safety_2}>{p.safety_2}</li>
              <li {...e.pillars.safety_3}>{p.safety_3}</li>
              <li {...e.pillars.safety_4}>{p.safety_4}</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3 {...e.pillars.env_title}>{p.env_title}</h3>
            <ul className="checks">
              <li {...e.pillars.env_1}>{p.env_1}</li>
              <li {...e.pillars.env_2}>{p.env_2}</li>
              <li {...e.pillars.env_3}>{p.env_3}</li>
              <li {...e.pillars.env_4}>{p.env_4}</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3 {...e.pillars.trust_title}>{p.trust_title}</h3>
            <ul className="checks">
              <li {...e.pillars.trust_1}>{p.trust_1}</li>
              <li {...e.pillars.trust_2}>{p.trust_2}</li>
              <li {...e.pillars.trust_3}>{p.trust_3}</li>
              <li {...e.pillars.trust_4}>{p.trust_4}</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.governance.kicker}>{governance.kicker}</p>
          <h2 {...e.governance.title}>{governance.title}</h2>
        </div>
        <ol className="timeline">
          <li className="reveal"><span className="step">01</span><p {...e.governance.step1}>{governance.step1}</p></li>
          <li className="reveal"><span className="step">02</span><p {...e.governance.step2}>{governance.step2}</p></li>
          <li className="reveal"><span className="step">03</span><p {...e.governance.step3}>{governance.step3}</p></li>
          <li className="reveal"><span className="step">04</span><p {...e.governance.step4}>{governance.step4}</p></li>
        </ol>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="info reveal">
            <p className="kicker" {...e.closing.iso_kicker}>{closing.iso_kicker}</p>
            <h3 {...e.closing.iso_title}>{closing.iso_title}</h3>
            <p {...e.closing.iso_text}>{closing.iso_text}</p>
            <div className="btn-row">
              <a className="btn solid" href={g.documents.iso_certificate_url} target="_blank" rel="noopener noreferrer" {...e.closing.iso_button}>{closing.iso_button}</a>
            </div>
          </article>
          <article className="info reveal">
            <p className="kicker" {...e.closing.contact_kicker}>{closing.contact_kicker}</p>
            <h3 {...e.closing.contact_title}>{closing.contact_title}</h3>
            <p {...e.closing.contact_text}>{closing.contact_text}</p>
            <p><a href={`mailto:${email}`} aria-label={fill(g.a11y.send_email, { email })}>{email}</a></p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="card reveal" style={{ textAlign: "center" }}>
          <p className="micro-note" {...e.closing.note}>{closing.note}</p>
        </div>
      </section>
    </SiteShell>
  );
}
