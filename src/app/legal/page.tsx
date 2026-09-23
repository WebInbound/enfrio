import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
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

  const e = await getEdit(LEGAL);

  return (
    <SiteShell active="legal">
      <section className="page-hero">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p className="lead">{fill(hero.lead, { date: hero.updated })}</p>
        </div>
      </section>

      <section className="section">
        <div className="grid-2">
          <article className="card reveal">
            <h3 {...e.controller.title}>{controller.title}</h3>
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
            <h3 {...e.controller.requests_title}>{controller.requests_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(controller.requests_text, vars)} />
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.collect.kicker}>{collect.kicker}</p>
          <h2 {...e.collect.title}>{collect.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3 {...e.collect.browsing_title}>{collect.browsing_title}</h3>
            <p {...e.collect.browsing_text}>{collect.browsing_text}</p>
          </article>
          <article className="panel reveal">
            <h3 {...e.collect.inquiry_title}>{collect.inquiry_title}</h3>
            <p {...e.collect.inquiry_text}>{collect.inquiry_text}</p>
          </article>
          <article className="panel reveal">
            <h3 {...e.collect.config_title}>{collect.config_title}</h3>
            <p {...e.collect.config_text}>{collect.config_text}</p>
          </article>
          <article className="panel reveal">
            <h3 {...e.collect.cookies_title}>{collect.cookies_title}</h3>
            <p {...e.collect.cookies_text}>{collect.cookies_text}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.purposes.kicker}>{purposes.kicker}</p>
          <h2 {...e.purposes.title}>{purposes.title}</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3 {...e.purposes.reply_title}>{purposes.reply_title}</h3>
            <p {...e.purposes.reply_text}>{purposes.reply_text}</p>
            <p className="micro-note" {...e.purposes.reply_basis}>{purposes.reply_basis}</p>
          </article>
          <article className="card reveal">
            <h3 {...e.purposes.site_title}>{purposes.site_title}</h3>
            <p {...e.purposes.site_text}>{purposes.site_text}</p>
            <p className="micro-note" {...e.purposes.site_basis}>{purposes.site_basis}</p>
          </article>
          <article className="card reveal">
            <h3 {...e.purposes.law_title}>{purposes.law_title}</h3>
            <p {...e.purposes.law_text}>{purposes.law_text}</p>
            <p className="micro-note" {...e.purposes.law_basis}>{purposes.law_basis}</p>
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.recipients.kicker}>{recipients.kicker}</p>
          <h2 {...e.recipients.title}>{recipients.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3 {...e.recipients.internal_title}>{recipients.internal_title}</h3>
            <p {...e.recipients.internal_text}>{recipients.internal_text}</p>
          </article>
          <article className="panel reveal">
            <h3 {...e.recipients.processors_title}>{recipients.processors_title}</h3>
            <p {...e.recipients.processors_text}>{recipients.processors_text}</p>
            <ul className="checks">
              {[recipients.processor_1, recipients.processor_2, recipients.processor_3, recipients.processor_4]
                .filter((item) => item.trim() !== "")
                .map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={richHtml(item, vars)} />
                ))}
            </ul>
            <p className="micro-note" {...e.recipients.processors_note}>{recipients.processors_note}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.retention.kicker}>{retention.kicker}</p>
          <h2 {...e.retention.title}>{retention.title}</h2>
        </div>
        <div className="grid-3">
          <article className="card reveal">
            <h3 {...e.retention.logs_title}>{retention.logs_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(retention.logs_text, vars)} />
          </article>
          <article className="card reveal">
            <h3 {...e.retention.form_title}>{retention.form_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(retention.form_text, vars)} />
          </article>
          <article className="card reveal">
            <h3 {...e.retention.records_title}>{retention.records_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(retention.records_text, vars)} />
          </article>
        </div>
      </section>

      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.rights.kicker}>{rights.kicker}</p>
          <h2 {...e.rights.title}>{rights.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3 {...e.rights.info_title}>{rights.info_title}</h3>
            <ul className="checks">
              <li {...e.rights.info_1}>{rights.info_1}</li>
              <li {...e.rights.info_2}>{rights.info_2}</li>
              <li {...e.rights.info_3}>{rights.info_3}</li>
            </ul>
          </article>
          <article className="panel reveal">
            <h3 {...e.rights.control_title}>{rights.control_title}</h3>
            <ul className="checks">
              <li {...e.rights.control_1}>{rights.control_1}</li>
              <li {...e.rights.control_2}>{rights.control_2}</li>
              <li {...e.rights.control_3}>{rights.control_3}</li>
              <li {...e.rights.control_4}>{rights.control_4}</li>
              <li dangerouslySetInnerHTML={richHtml(rights.control_5, vars)} />
            </ul>
          </article>
        </div>
        <div className="card reveal" style={{ marginTop: 24 }}>
          <h3 {...e.rights.exercise_title}>{rights.exercise_title}</h3>
          <p dangerouslySetInnerHTML={richHtml(rights.exercise_text, vars)} />
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.cookies.kicker}>{cookies.kicker}</p>
          <h2 {...e.cookies.title}>{cookies.title}</h2>
        </div>
        <div className="grid-2">
          <article className="panel reveal">
            <h3 {...e.cookies.technical_title}>{cookies.technical_title}</h3>
            <p {...e.cookies.technical_text}>{cookies.technical_text}</p>
          </article>
          <article className="panel reveal">
            <h3 {...e.cookies.marketing_title}>{cookies.marketing_title}</h3>
            <p dangerouslySetInnerHTML={richHtml(cookies.marketing_text, vars)} />
          </article>
        </div>
      </section>

      <section className="section cta reveal">
        <p className="kicker" {...e.cta.kicker}>{cta.kicker}</p>
        <h2 {...e.cta.title}>{cta.title}</h2>
        <p dangerouslySetInnerHTML={richHtml(cta.text, vars)} />
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href="/contact" {...e.cta.button}>
            {cta.button}
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="card reveal" style={{ textAlign: "center" }}>
          <p className="micro-note" {...e.cta.note}>{cta.note}</p>
        </div>
      </section>
    </SiteShell>
  );
}
