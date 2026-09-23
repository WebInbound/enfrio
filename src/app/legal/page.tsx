import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { fill, richHtml } from "@/lib/content-format";
import { companyInfo, getGlobal, pageSeo } from "@/lib/site-content";
import { LEGAL } from "@/content/legal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(LEGAL);
  return pageSeo("/legal", seo);
}

export default async function LegalPage() {
  const [c, g] = await Promise.all([getContent(LEGAL), getGlobal()]);
  const { hero, controller, collect, purposes, recipients, retention, rights, cookies, cta } = c;
  const co = companyInfo(g);
  const vars = { email: co.email };

  return (
    <SiteShell active="legal">
      <section className="page-hero">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p className="lead">{fill(hero.lead, { date: hero.updated })}</p>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="card reveal">
            <h3>{controller.title}</h3>
            <p>
              <strong>{co.name}</strong>
              <br />
              {co.street}
              <br />
              {co.cityLine}
              <br />
              {`${g.company.vat_label} ${co.vat}`}
            </p>
          </article>
          <article className="card reveal">
            <h3>{controller.requests_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(controller.requests_text, vars)} />
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{collect.kicker}</p>
          <h2>{collect.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>{collect.browsing_title}</h3>
            <p>{collect.browsing_text}</p>
          </article>
          <article className="panel reveal">
            <h3>{collect.inquiry_title}</h3>
            <p>{collect.inquiry_text}</p>
          </article>
          <article className="panel reveal">
            <h3>{collect.config_title}</h3>
            <p>{collect.config_text}</p>
          </article>
          <article className="panel reveal">
            <h3>{collect.cookies_title}</h3>
            <p>{collect.cookies_text}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{purposes.kicker}</p>
          <h2>{purposes.title}</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3>{purposes.reply_title}</h3>
            <p>{purposes.reply_text}</p>
            <p className="micro-note">{purposes.reply_basis}</p>
          </article>
          <article className="card reveal">
            <h3>{purposes.site_title}</h3>
            <p>{purposes.site_text}</p>
            <p className="micro-note">{purposes.site_basis}</p>
          </article>
          <article className="card reveal">
            <h3>{purposes.law_title}</h3>
            <p>{purposes.law_text}</p>
            <p className="micro-note">{purposes.law_basis}</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{recipients.kicker}</p>
          <h2>{recipients.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>{recipients.internal_title}</h3>
            <p>{recipients.internal_text}</p>
          </article>
          <article className="panel reveal">
            <h3>{recipients.processors_title}</h3>
            <p>{recipients.processors_text}</p>
            <ul className="checks">
              {[recipients.processor_1, recipients.processor_2, recipients.processor_3, recipients.processor_4]
                .filter((item) => item.trim() !== "")
                .map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={richHtml(item, vars)} />
                ))}
            </ul>
            <p className="micro-note">{recipients.processors_note}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{retention.kicker}</p>
          <h2>{retention.title}</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3>{retention.logs_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(retention.logs_text, vars)} />
          </article>
          <article className="card reveal">
            <h3>{retention.form_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(retention.form_text, vars)} />
          </article>
          <article className="card reveal">
            <h3>{retention.records_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(retention.records_text, vars)} />
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker">{rights.kicker}</p>
          <h2>{rights.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>{rights.info_title}</h3>
            <ul className="checks">
              <li>{rights.info_1}</li>
              <li>{rights.info_2}</li>
              <li>{rights.info_3}</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3>{rights.control_title}</h3>
            <ul className="checks">
              <li>{rights.control_1}</li>
              <li>{rights.control_2}</li>
              <li>{rights.control_3}</li>
              <li>{rights.control_4}</li>
              <li dangerouslySetInnerHTML={richHtml(rights.control_5, vars)} />
            </ul>
          </article>
        </div>
        <div className="card reveal" style={{ marginTop: 24 }}>
          <h3>{rights.exercise_title}</h3>
          <p dangerouslySetInnerHTML={richHtml(rights.exercise_text, vars)} />
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker">{cookies.kicker}</p>
          <h2>{cookies.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3>{cookies.technical_title}</h3>
            <p>{cookies.technical_text}</p>
          </article>
          <article className="panel reveal">
            <h3>{cookies.marketing_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(cookies.marketing_text, vars)} />
          </article>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker">{cta.kicker}</p>
        <h2>{cta.title}</h2>
        <p dangerouslySetInnerHTML={richHtml(cta.text, vars)} />
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact">
            {cta.button}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="card reveal" style={{ textAlign: "center" }}>
          <p className="micro-note">{cta.note}</p>
        </div>
      </section>
    </SiteShell>
  );
}
