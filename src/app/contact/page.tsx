import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/kiwi";
import { getEdit, getEditForClient } from "@/lib/kiwi-edit";
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

  const [e, fe] = await Promise.all([getEdit(CONTACT), getEditForClient(CONTACT_FORM)]);

  return (
    <SiteShell active="contact">
      <section className="page-hero split">
        <div className="page-hero-text reveal">
          <p className="kicker" {...e.hero.kicker}>{hero.kicker}</p>
          <h1 {...e.hero.title}>{hero.title}</h1>
          <p {...e.hero.lead}>{hero.lead}</p>
        </div>
        <figure className="page-hero-media reveal">
          <Image {...e.hero.image} priority className="focus-right" src={hero.image} alt={hero.image_alt} width={1200} height={900} />
        </figure>
      </section>

      <section className="section">
        <div className="contact-layout">
          <div className="contact-form-wrap reveal">
            <p className="kicker" {...e.inquiry.kicker}>{inquiry.kicker}</p>
            <h2 {...e.inquiry.title}>{inquiry.title}</h2>
            <p {...e.inquiry.text}>{inquiry.text}</p>
            <Suspense fallback={<p className="micro-note" {...e.inquiry.loading}>{inquiry.loading}</p>}>
              <ContactForm labels={form.fields} edit={fe?.fields} />
            </Suspense>
          </div>
          <aside className="contact-side reveal">
            <article className="contact-side-card">
              <h3 {...e.side.direct_title}>{side.direct_title}</h3>
              <p {...e.side.direct_text}>{side.direct_text}</p>
              <p><a href={`mailto:${co.email}`} aria-label={`Send email to ${co.email}`}>{co.email}</a></p>
            </article>
            <article className="contact-side-card">
              <h3 {...e.side.hq_title}>{side.hq_title}</h3>
              <p>{co.street}<br />{co.cityLine}</p>
              <p>{`${g.company.vat_label} ${co.vat}`}</p>
            </article>
            <article className="contact-side-card">
              <h3 {...e.side.share_title}>{side.share_title}</h3>
              <ul className="checks">
                <li {...e.side.share_item1}>{side.share_item1}</li>
                <li {...e.side.share_item2}>{side.share_item2}</li>
                <li {...e.side.share_item3}>{side.share_item3}</li>
                <li {...e.side.share_item4}>{side.share_item4}</li>
              </ul>
            </article>
            <article className="contact-side-card">
              <h3 {...e.side.quality_title}>{side.quality_title}</h3>
              <p {...e.side.quality_text}>{side.quality_text}</p>
              <p><a className="btn solid" href={g.documents.iso_certificate_url} target="_blank" rel="noopener noreferrer" {...e.side.quality_button}>{side.quality_button}</a></p>
            </article>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
