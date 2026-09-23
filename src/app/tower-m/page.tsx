import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import MTowerSizer, { type SizerCoefficients } from "@/components/MTowerSizer";
import MTowerStage from "@/components/MTowerStage";
import AnimatedNumber from "@/components/AnimatedNumber";
import DeploySwitcher from "@/components/DeploySwitcher";
import Stat from "@/components/Stat";
import { getContent } from "@/lib/kiwi";
import { getEdit, getEditForClient, isEditing } from "@/lib/kiwi-edit";
import { toNumber } from "@/lib/content-format";
import { getGlobal, pageSeo } from "@/lib/site-content";
import { SIZER, TOWER_M } from "@/content/tower-m";
import type { Content } from "@/content/types";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent(TOWER_M);
  return pageSeo("/tower-m", seo);
}

/** Coefficients typed in the panel → numbers, each range-checked (bad input → default). */
function sizerCoefficients(c: Content<typeof SIZER>["coefficients"]): SizerCoefficients {
  const d = SIZER.sections.coefficients.blocks;
  const num = (key: keyof typeof d, min: number, max: number) =>
    toNumber(c[key], Number(d[key].default), { min, max });
  return {
    unitKw: num("unit_kw", 100, 100000),
    footprintM2: num("footprint_m2", 0.1, 1000),
    waterLpm: num("water_lpm", 1, 100000),
    weightT: num("weight_t", 0.01, 1000),
    electricalKva: num("electrical_kva", 0.1, 100000),
    factor: {
      diesel: num("factor_diesel", 0.05, 2),
      gas: num("factor_gas", 0.05, 2),
      datacenter: num("factor_datacenter", 0.05, 2),
      custom: num("factor_custom", 0.05, 2),
    },
    doubleCircuit: num("double_circuit", 1, 2),
    ambientDerate: {
      30: num("derate_30c", 0.1, 1.5),
      40: num("derate_40c", 0.1, 1.5),
      50: num("derate_50c", 0.1, 1.5),
    },
    altitudeDerate: {
      low: num("derate_alt_low", 0.1, 1.5),
      med: num("derate_alt_med", 0.1, 1.5),
      high: num("derate_alt_high", 0.1, 1.5),
    },
  };
}

export default async function TowerMPage() {
  const [c, sizer, g] = await Promise.all([getContent(TOWER_M), getContent(SIZER), getGlobal()]);
  const { craft, why, scale, sizer_intro, deploy, outro } = c;
  const render = g.images.mtower_render;
  const datasheetUrl = g.documents.mtower_datasheet_url;
  const tierLabels = [scale.tier1_label, scale.tier2_label, scale.tier3_label, scale.tier4_label];

  const [e, ec, sc, editing] = await Promise.all([
    getEdit(TOWER_M),
    getEditForClient(TOWER_M),
    getEditForClient(SIZER),
    isEditing(),
  ]);

  return (
    <SiteShell active="tower-m">
      <MTowerStage content={{ stage: c.stage, explore: c.explore }} edit={ec && { stage: ec.stage, explore: ec.explore }} />

      {/* PLAY 7 — Engineering Detail macro crops */}
      <section className="section mtower-craft">
        <div className="section-head reveal">
          <p className="kicker" {...e.craft.kicker}>{craft.kicker}</p>
          <h2 {...e.craft.title}>{craft.title}</h2>
        </div>
        <div className="mtower-craft-stack">
          <figure className="craft-crop reveal">
            <img src={craft.crop1_image} alt={craft.crop1_image_alt} />
            <figcaption {...e.craft.crop1_caption}>{craft.crop1_caption}</figcaption>
          </figure>
          <figure className="craft-crop reveal">
            <img src={craft.crop2_image} alt={craft.crop2_image_alt} />
            <figcaption {...e.craft.crop2_caption}>{craft.crop2_caption}</figcaption>
          </figure>
          <figure className="craft-crop reveal">
            <img src={craft.crop3_image} alt={craft.crop3_image_alt} />
            <figcaption {...e.craft.crop3_caption}>{craft.crop3_caption}</figcaption>
          </figure>
        </div>
      </section>

      {/* PLAY 3 — Why modular: SVG stat cards */}
      <section className="section dark-block">
        <div className="section-head reveal">
          <p className="kicker" {...e.why.kicker}>{why.kicker}</p>
          <h2 {...e.why.title}>{why.title}</h2>
        </div>
        <div className="grid-3">
          <article className="stat reveal mtower-why-mod-card">
            <svg
              className="why-mod-diagram why-mod-diagram--capex"
              viewBox="0 0 240 56"
              aria-hidden="true"
              focusable="false"
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const filled = i < 3;
                return (
                  <rect
                    key={i}
                    x={i * 29 + 4}
                    y={8}
                    width={22}
                    height={40}
                    rx={2}
                    className={filled ? "why-mod-rect filled" : "why-mod-rect ghost"}
                    style={{ ["--i" as string]: i } as CSSProperties}
                  />
                );
              })}
            </svg>
            <h3>
              <Stat text={why.card1_value} />
            </h3>
            <p className="kicker" {...e.why.card1_tag}>{why.card1_tag}</p>
            <p {...e.why.card1_text}>{why.card1_text}</p>
          </article>

          <article className="stat reveal mtower-why-mod-card">
            <svg
              className="why-mod-diagram why-mod-diagram--uptime"
              viewBox="0 0 240 56"
              aria-hidden="true"
              focusable="false"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const isSpare = i === 4;
                return (
                  <rect
                    key={i}
                    x={i * 47 + 8}
                    y={8}
                    width={36}
                    height={40}
                    rx={3}
                    className={
                      isSpare
                        ? "why-mod-rect spare"
                        : "why-mod-rect filled"
                    }
                    style={{ ["--i" as string]: i } as CSSProperties}
                  />
                );
              })}
            </svg>
            <h3>
              <Stat text={why.card2_value} />
            </h3>
            <p className="kicker" {...e.why.card2_tag}>{why.card2_tag}</p>
            <p {...e.why.card2_text}>{why.card2_text}</p>
          </article>

          <article className="stat reveal mtower-why-mod-card">
            <svg
              className="why-mod-diagram why-mod-diagram--logistics"
              viewBox="0 0 240 56"
              aria-hidden="true"
              focusable="false"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <g
                  key={i}
                  className="why-mod-container"
                  style={{ ["--i" as string]: i } as CSSProperties}
                >
                  <rect
                    x={i * 78 + 4}
                    y={12}
                    width={70}
                    height={32}
                    rx={2}
                    className="why-mod-container-shell"
                  />
                  {[0, 1, 2, 3, 4, 5].map((j) => (
                    <line
                      key={j}
                      x1={i * 78 + 4 + 10 + j * 10}
                      y1={14}
                      x2={i * 78 + 4 + 10 + j * 10}
                      y2={42}
                      className="why-mod-container-line"
                    />
                  ))}
                </g>
              ))}
            </svg>
            <h3>
              <Stat text={why.card3_value} />
            </h3>
            <p className="kicker" {...e.why.card3_tag}>{why.card3_tag}</p>
            <p {...e.why.card3_text}>{why.card3_text}</p>
          </article>
        </div>
      </section>

      {/* PLAY 5 — Modular scale band */}
      <section className="section mtower-scale">
        <div className="section-head reveal">
          <p className="kicker" {...e.scale.kicker}>{scale.kicker}</p>
          <h2 {...e.scale.title}>{scale.title}</h2>
          <p {...e.scale.text}>{scale.text}</p>
        </div>
        <div className="grid-4 mtower-scale-grid">
          {[
            { n: 1, mw: 1.5, label: tierLabels[0], bg: "container" },
            { n: 2, mw: 3, label: tierLabels[1], bg: "substation" },
            { n: 4, mw: 6, label: tierLabels[2], bg: "serverhall" },
            { n: 8, mw: 12, label: tierLabels[3], bg: "plant" },
          ].map((tier) => (
            <article
              key={tier.n}
              className={`mtower-scale-tier reveal mtower-scale-tier--${tier.bg}`}
            >
              <div className="mtower-scale-bg" aria-hidden="true">
                {tier.bg === "container" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    <rect x="20" y="60" width="160" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1={30 + i * 20} y1={64} x2={30 + i * 20} y2={96} stroke="currentColor" strokeWidth="0.8" />
                    ))}
                  </svg>
                )}
                {tier.bg === "substation" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1.2" />
                    {[40, 100, 160].map((x, i) => (
                      <g key={i}>
                        <line x1={x} y1="100" x2={x} y2="40" stroke="currentColor" strokeWidth="1.2" />
                        <line x1={x - 16} y1="50" x2={x + 16} y2="50" stroke="currentColor" strokeWidth="1.2" />
                        <line x1={x - 16} y1="65" x2={x + 16} y2="65" stroke="currentColor" strokeWidth="1.2" />
                      </g>
                    ))}
                  </svg>
                )}
                {tier.bg === "serverhall" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    {Array.from({ length: 5 }).map((_, row) =>
                      Array.from({ length: 6 }).map((__, col) => (
                        <rect
                          key={`${row}-${col}`}
                          x={20 + col * 28}
                          y={20 + row * 18}
                          width={22}
                          height={12}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.9"
                        />
                      ))
                    )}
                  </svg>
                )}
                {tier.bg === "plant" && (
                  <svg viewBox="0 0 200 120" aria-hidden="true" focusable="false">
                    <rect x="40" y="50" width="120" height="60" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    {[0, 1, 2, 3].map((i) => (
                      <rect key={i} x={50 + i * 28} y={36} width={20} height={14} fill="none" stroke="currentColor" strokeWidth="1" />
                    ))}
                    <line x1="0" y1="110" x2="200" y2="110" stroke="currentColor" strokeWidth="1" />
                  </svg>
                )}
              </div>

              <svg
                className="mtower-scale-modules"
                viewBox={`0 0 ${tier.n * 22 + 8} 64`}
                aria-hidden="true"
                focusable="false"
              >
                {Array.from({ length: tier.n }).map((_, i) => (
                  <rect
                    key={i}
                    x={i * 22 + 4}
                    y={6}
                    width={16}
                    height={52}
                    rx={2}
                    className="mtower-scale-module"
                    style={{ ["--i" as string]: i } as CSSProperties}
                  />
                ))}
              </svg>

              <p className="mtower-scale-count">
                {tier.n} {tier.n === 1 ? scale.module_one : scale.module_many}
              </p>
              <p className="mtower-scale-mw">
                <AnimatedNumber value={tier.mw} suffix=" MW" format="float" />
              </p>
              <p className="mtower-scale-label">{tier.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-block" id="mtower-sizer">
        <div className="section-head reveal">
          <p className="kicker" {...e.sizer_intro.kicker}>{sizer_intro.kicker}</p>
          <h2 {...e.sizer_intro.title}>{sizer_intro.title}</h2>
          <p {...e.sizer_intro.text}>{sizer_intro.text}</p>
        </div>
        <MTowerSizer
          text={{ ...sizer.inputs, ...sizer.readout }}
          coefficients={sizerCoefficients(sizer.coefficients)}
          moduleImg={render}
          edit={sc && { ...sc.inputs, ...sc.readout }}
          editing={editing || undefined}
        />
      </section>

      {/* PLAY 6 — Deployment Contexts: tabbed switcher */}
      <section className="section">
        <div className="section-head reveal">
          <p className="kicker" {...e.deploy.kicker}>{deploy.kicker}</p>
          <h2 {...e.deploy.title}>{deploy.title}</h2>
          <p {...e.deploy.text}>{deploy.text}</p>
        </div>
        <DeploySwitcher
          content={{
            contexts: [c.deploy_dc, c.deploy_petro, c.deploy_power, c.deploy_hvac],
            unitAlt: deploy.unit_alt,
            renderSrc: render,
          }}
          edit={ec && [ec.deploy_dc, ec.deploy_petro, ec.deploy_power, ec.deploy_hvac]}
          editing={editing || undefined}
        />
      </section>

      {/* PLAY 8 — Closing outro recap */}
      <section className="mtower-outro section dark-block">
        <div className="mtower-outro-grid">
          <div className="mtower-outro-media mtower-spotlight-media--render reveal">
            <img src={render} alt={outro.image_alt} />
          </div>
          <div className="mtower-outro-content reveal">
            <p className="kicker" {...e.outro.kicker}>{outro.kicker}</p>
            <h2 {...e.outro.title}>{outro.title}</h2>
            <div className="mtower-outro-strip">
              <span className="mtower-outro-strip-num" {...e.outro.strip1}>{outro.strip1}</span>
              <span className="mtower-outro-strip-dot">&middot;</span>
              <span className="mtower-outro-strip-num" {...e.outro.strip2}>{outro.strip2}</span>
              <span className="mtower-outro-strip-dot">&middot;</span>
              <span className="mtower-outro-strip-num" {...e.outro.strip3}>{outro.strip3}</span>
            </div>
            <ol className="timeline mtower-outro-timeline">
              <li>
                <span className="step" {...e.outro.step1_label}>{outro.step1_label}</span>
                <span {...e.outro.step1_text}>{outro.step1_text}</span>
              </li>
              <li>
                <span className="step" {...e.outro.step2_label}>{outro.step2_label}</span>
                <span {...e.outro.step2_text}>{outro.step2_text}</span>
              </li>
              <li>
                <span className="step" {...e.outro.step3_label}>{outro.step3_label}</span>
                <span {...e.outro.step3_text}>{outro.step3_text}</span>
              </li>
              <li>
                <span className="step" {...e.outro.step4_label}>{outro.step4_label}</span>
                <span {...e.outro.step4_text}>{outro.step4_text}</span>
              </li>
            </ol>
            <div className="btn-row">
              <Link className="btn solid magnetic" href="/contact?subject=M+Tower+Inquiry" {...e.outro.cta}>
                {outro.cta}
              </Link>
              {/* Datasheet PDF link is set in the Kiwi panel ("Globale ›
                  Documenti"). Until then the button stays disabled (it was
                  href="#", which just jumped to the top of the page). */}
              {datasheetUrl ? (
                <a className="btn ghost" href={datasheetUrl} target="_blank" rel="noopener noreferrer" {...e.outro.datasheet}>{outro.datasheet}</a>
              ) : (
                <button type="button" className="btn ghost" disabled aria-disabled="true" title={outro.datasheet_missing}>{outro.datasheet}</button>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
