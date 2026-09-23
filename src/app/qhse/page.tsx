import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getGlobal, pageSeo } from "@/lib/site-content";
import { QHSE } from "@/content/qhse";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(QHSE);
  return pageSeo("/qhse", seo);
}

export default async function QhsePage() {
  const [{ hero, pillars: p, governance, closing }, g] = await Promise.all([getContent(QHSE), getGlobal()]);
  const email = g.company.email;

  return (
    <SiteShell active="qhse">
      <section className="page-hero">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p className="lead">{hero.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{p.kicker}</p>
          <h2>{p.title}</h2>
        </div>
        <div className="grid-2">
          <article className="card reveal">
            <h3>{p.quality_title}</h3>
            <ul className="checks">
              <li>{p.quality_1}</li>
              <li>{p.quality_2}</li>
              <li>{p.quality_3}</li>
              <li>{p.quality_4}</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3>{p.safety_title}</h3>
            <ul className="checks">
              <li>{p.safety_1}</li>
              <li>{p.safety_2}</li>
              <li>{p.safety_3}</li>
              <li>{p.safety_4}</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3>{p.env_title}</h3>
            <ul className="checks">
              <li>{p.env_1}</li>
              <li>{p.env_2}</li>
              <li>{p.env_3}</li>
              <li>{p.env_4}</li>
            </ul>
          </article>
          <article className="card reveal">
            <h3>{p.trust_title}</h3>
            <ul className="checks">
              <li>{p.trust_1}</li>
              <li>{p.trust_2}</li>
              <li>{p.trust_3}</li>
              <li>{p.trust_4}</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{governance.kicker}</p>
          <h2>{governance.title}</h2>
        </div>
        <ol className="timeline">
          <li className="reveal"><span className="step">01</span><p>{governance.step1}</p></li>
          <li className="reveal"><span className="step">02</span><p>{governance.step2}</p></li>
          <li className="reveal"><span className="step">03</span><p>{governance.step3}</p></li>
          <li className="reveal"><span className="step">04</span><p>{governance.step4}</p></li>
        </ol>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="info reveal">
            <p className="kicker">{closing.iso_kicker}</p>
            <h3>{closing.iso_title}</h3>
            <p>{closing.iso_text}</p>
            <div className="btn-row">
              <a className="btn solid" href={g.documents.iso_certificate_url} target="_blank" rel="noopener noreferrer">{closing.iso_button}</a>
            </div>
          </article>
          <article className="info reveal">
            <p className="kicker">{closing.contact_kicker}</p>
            <h3>{closing.contact_title}</h3>
            <p>{closing.contact_text}</p>
            <p><a href={`mailto:${email}`} aria-label={`Send email to ${email}`}>{email}</a></p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="card reveal" style={{ textAlign: "center" }}>
          <p className="micro-note">{closing.note}</p>
        </div>
      </section>
    </SiteShell>
  );
}
