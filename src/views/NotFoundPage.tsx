import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getContent } from "@/lib/kiwi";
import { getEdit } from "@/lib/kiwi-edit";
import { NOT_FOUND } from "@/content/global";
import { localePath, type Lang } from "@/lib/i18n";

export async function metadata(lang: Lang): Promise<Metadata> {
  const { main } = await getContent(NOT_FOUND, lang);
  return {
    title: main.seo_title,
    description: main.seo_description,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound({ lang }: { lang: Lang }) {
  const { main } = await getContent(NOT_FOUND, lang);

  const e = await getEdit(NOT_FOUND, lang);

  return (
    <SiteShell lang={lang} active="home" blocks={[NOT_FOUND]}>
      <section className="section cta reveal">
        <p className="kicker" {...e.main.kicker}>{main.kicker}</p>
        <h1 {...e.main.title}>{main.title}</h1>
        <p {...e.main.text}>{main.text}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <Link className="btn solid" href={localePath(lang, "/")} {...e.main.cta_home}>
            {main.cta_home}
          </Link>
          <Link className="btn ghost" href={localePath(lang, "/tower-m")} {...e.main.cta_mtower}>
            {main.cta_mtower}
          </Link>
          <Link className="btn ghost" href={localePath(lang, "/contact")} {...e.main.cta_contact}>
            {main.cta_contact}
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
