import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/kiwi";
import { companyInfo, getGlobal, pageSeo } from "@/lib/site-content";
import { CONTACT, CONTACT_FORM } from "@/content/contact";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(CONTACT);
  return pageSeo("/contact", seo);
}

export default async function ContactPage() {
  const [{ hero, inquiry, side }, form, g] = await Promise.all([
    getContent(CONTACT),
    getContent(CONTACT_FORM),
    getGlobal(),
  ]);
  const co = companyInfo(g);

  return (
    <SiteShell active="contact">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker">{hero.kicker}</p>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image priority className="focus-right" src={hero.image} alt={hero.image_alt} width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="contact-layout">
          <div className="contact-form-wrap reveal">
            <p className="kicker">{inquiry.kicker}</p>
            <h2>{inquiry.title}</h2>
            <p>{inquiry.text}</p>
            <Suspense fallback={<p className="micro-note">{inquiry.loading}</p>}>
              <ContactForm labels={form.fields} />
            </Suspense>
          </div>
          <aside className="contact-side reveal">
            <article className="contact-side-card">
              <h3>{side.direct_title}</h3>
              <p>{side.direct_text}</p>
              <p><a href={`mailto:${co.email}`} aria-label={`Send email to ${co.email}`}>{co.email}</a></p>
            </article>
            <article className="contact-side-card">
              <h3>{side.hq_title}</h3>
              <p>{co.street}<br />{co.cityLine}</p>
              <p>{`${g.company.vat_label} ${co.vat}`}</p>
            </article>
            <article className="contact-side-card">
              <h3>{side.share_title}</h3>
              <ul className="checks">
                <li>{side.share_item1}</li>
                <li>{side.share_item2}</li>
                <li>{side.share_item3}</li>
                <li>{side.share_item4}</li>
              </ul>
            </article>
            <article className="contact-side-card">
              <h3>{side.quality_title}</h3>
              <p>{side.quality_text}</p>
              <p><a className="btn solid" href={g.documents.iso_certificate_url} target="_blank" rel="noopener noreferrer">{side.quality_button}</a></p>
            </article>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
