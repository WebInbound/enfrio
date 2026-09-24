"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { getContent, sendKiwiContact } from "@/lib/kiwi";
import { fill } from "@/lib/content-format";
import { sendFormSubmit, TARGET_INBOX } from "@/lib/formsubmit";
import { sizerCoefficients } from "@/lib/mtower-coefficients";
import { buildQuotePdf, type QuotePdfRow } from "@/lib/mtower-pdf";
import { fmt, parseSizerInputs, sizeBuild } from "@/lib/mtower-sizing";
import { companyInfo, getGlobal } from "@/lib/site-content";
import { CONTACT_FORM } from "@/content/contact";
import { QUOTE, SIZER } from "@/content/tower-m";
import { isLang, localePath, numberLocale, type Lang } from "@/lib/i18n";

// Quote request from the M Tower configurator (proposal KW-2026-002, A.5).
// The visitor sends name, company and email with the configuration; the
// server recomputes the build from the inputs with the panel's coefficients
// (the browser's numbers are never trusted), then:
//   - stores the request in the Kiwi panel ("Messaggi"), configuration in the
//     message and in the metadata;
//   - emails it to the Enfrio inbox through FormSubmit, like the contact form
//     (success only if that email went out: Kiwi notifies nobody while
//     Enfrio has no owner member);
//   - builds the PDF summary, asks Kiwi to email it to the requester and hands
//     it back to the browser for an immediate download.

export type QuoteFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  notes: string;
  timeline: string;
  consent: boolean;
};

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company" | "consent", string>>;
  /** On "error": what was typed, handed back (React resets an action <form>). */
  values?: QuoteFormValues;
  /** On a real success (not the honeypot answer). */
  ref?: string;
  email?: string;
  emailed?: boolean;
  pdf?: { filename: string; base64: string };
};

// No rate-limit cookie here (the contact form has one): setting a cookie in a
// server action makes Next refresh the route, and the page behind the drawer
// jumped to the top. Instead a per-IP limit in memory (per server instance),
// checked before the PDF and FormSubmit, so a script can't flood Enfrio's
// inbox (FormSubmit also serves the contact form). Kiwi keeps its own limits.
const IP_LIMIT = 3;
const IP_WINDOW_MS = 10 * 60_000;
const recentByIp = new Map<string, number[]>();

function allowIp(ip: string): boolean {
  const now = Date.now();
  if (recentByIp.size > 5000) recentByIp.clear();
  const key = ip || "unknown";
  const times = (recentByIp.get(key) ?? []).filter((t) => now - t < IP_WINDOW_MS);
  if (times.length >= IP_LIMIT) {
    recentByIp.set(key, times);
    return false;
  }
  times.push(now);
  recentByIp.set(key, times);
  return true;
}
const KIWI_MAX_MESSAGE = 10_000;
const TIMELINES = ["under-3m", "3-6m", "6-12m", "exploring"] as const;
const SITE_URL = "https://www.enfrio.it";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) && email.length <= 200;
}

/** MT-260924-7K3F: date (Italian time) + 4 characters without look-alikes. */
function newReference(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", year: "2-digit", month: "2-digit", day: "2-digit" })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const rand = [...randomBytes(4)].map((b) => alphabet[b % alphabet.length]).join("");
  return `MT-${parts.year}${parts.month}${parts.day}-${rand}`;
}

const field = (formData: FormData, key: string, max: number) => String(formData.get(key) ?? "").trim().slice(0, max);

export async function submitQuoteRequest(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  // Language of the page the request comes from: texts, PDF and email in it.
  const rawLang = formData.get("lang");
  const lang: Lang = isLang(rawLang) ? rawLang : "en";
  const L = numberLocale(lang);
  const [q, form, sizer, g] = await Promise.all([
    getContent(QUOTE, lang),
    getContent(CONTACT_FORM, lang),
    getContent(SIZER, lang),
    getGlobal(lang),
  ]);
  const m = form.messages;
  const company = companyInfo(g);
  const withEmail = (text: string) => fill(text, { email: company.email });

  const values: QuoteFormValues = {
    name: field(formData, "name", 200),
    company: field(formData, "company", 200),
    email: field(formData, "email", 200),
    phone: field(formData, "phone", 50),
    location: field(formData, "location", 150),
    notes: field(formData, "notes", 4000),
    timeline: field(formData, "timeline", 20),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  };

  if (field(formData, "company_url", 200)) {
    return { status: "success", message: m.spam_success };
  }

  const fieldErrors: QuoteFormState["fieldErrors"] = {};
  if (!values.name) fieldErrors.name = m.name_required;
  if (!values.email) fieldErrors.email = m.email_required;
  else if (!isValidEmail(values.email)) fieldErrors.email = m.email_invalid;
  if (!values.company) fieldErrors.company = m.company_required;
  if (!values.consent) fieldErrors.consent = m.consent_required;
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: m.review, fieldErrors, values };
  }
  const timeline = TIMELINES.find((t) => t === values.timeline) ?? "";

  const inputs = parseSizerInputs((key) => field(formData, key, 20));
  if (!inputs) return { status: "error", message: q.drawer.config_invalid, values };

  const requestHeaders = await headers();
  const visitor = {
    ip:
      (requestHeaders.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
      (requestHeaders.get("x-real-ip") ?? "").trim(),
    userAgent: requestHeaders.get("user-agent") ?? "",
  };
  if (!allowIp(visitor.ip)) return { status: "error", message: m.repeat, values };

  const k = sizerCoefficients(sizer.coefficients);
  const r = sizeBuild(inputs, k);
  const t = { ...sizer.inputs, ...sizer.readout };
  const f = form.fields;

  const now = new Date();
  const ref = newReference(now);
  const date = new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", { timeZone: "Europe/Rome", day: "numeric", month: "short", year: "numeric" }).format(now);
  const application = { diesel: t.app_diesel, gas: t.app_gas, datacenter: t.app_datacenter, custom: t.app_custom }[inputs.application];
  const altitude = { low: t.alt_low, med: t.alt_med, high: t.alt_high }[inputs.altitude];
  const config = r.units <= 1 ? t.config_1 : r.units <= 4 ? t.config_4 : r.units <= 8 ? t.config_8 : t.config_more;
  const mw = fmt((r.units * k.unitKw) / 1000, 1, L);
  const timelineLabel = timeline
    ? { "under-3m": f.timeline_3m, "3-6m": f.timeline_6m, "6-12m": f.timeline_12m, exploring: f.timeline_exploring }[timeline]
    : "—";

  const inputRows: QuotePdfRow[] = [
    { label: t.power, value: `${fmt(inputs.power, 0, L)} kW` },
    { label: t.application, value: application },
    { label: t.circuit, value: inputs.circuit === "double" ? t.circuit_double : t.circuit_single },
    { label: t.ambient, value: `${inputs.ambient} °C` },
    { label: t.altitude, value: altitude },
    { label: t.redundancy, value: inputs.redundancy ? t.status_redundant : t.status_base },
  ];
  const resultRows: QuotePdfRow[] = [
    { label: t.metric_heat, value: `${fmt(r.heat, 0, L)} kW` },
    { label: t.metric_capacity, value: `${fmt(r.capacity, 0, L)} kW` },
    { label: t.metric_derated, value: `${fmt(r.effectiveUnitKw, 0, L)} kW` },
    { label: t.metric_headroom, value: `+${Math.max(0, r.headroomPct)}%` },
    { label: t.hud_footprint, value: `${fmt(r.footprintM2, 1, L)} m²` },
    { label: t.hud_water, value: `${fmt(r.waterLpm, 0, L)} L/min` },
    { label: t.hud_weight, value: `${fmt(r.weightT, 1, L)} t` },
    { label: t.hud_electrical, value: `${fmt(r.electricalKva, 0, L)} kVA` },
  ];
  const statusLine = [
    t.status_online,
    `${r.units} ${r.units === 1 ? t.status_module : t.status_modules}`,
    `${mw} MW`,
    inputs.redundancy ? t.status_redundant : t.status_base,
  ].join(" · ");
  const configLink = `${SITE_URL}${localePath(lang, "/tower-m")}?${new URLSearchParams({
    power: String(inputs.power),
    application: inputs.application,
    circuit: inputs.circuit,
    ambient: String(inputs.ambient),
    altitude: inputs.altitude,
    redundancy: inputs.redundancy ? "1" : "0",
  })}#mtower-sizer`;

  // Plain-text summary for Enfrio: the panel message and the email.
  const summary = [
    `${q.pdf.title} — ${ref}`,
    "",
    `${q.pdf.inputs_title.toUpperCase()}`,
    ...inputRows.map((row) => `${row.label}: ${row.value}`),
    "",
    `${q.pdf.results_title.toUpperCase()}`,
    `${q.pdf.units_label}: ${r.units} (${config}${inputs.redundancy ? `, ${q.pdf.spare}` : ""})`,
    ...resultRows.map((row) => `${row.label}: ${row.value}`),
    "",
    configLink,
  ].join("\n");

  // A PDF that can't be built (e.g. an unreadable image in the panel) must
  // not lose the request: it still reaches Enfrio, without the summary.
  let pdf: Uint8Array | null = null;
  try {
    pdf = await buildQuotePdf({
      title: q.pdf.title,
      refLabel: q.pdf.ref_label,
      ref,
      dateLabel: q.pdf.date_label,
      date,
      buildKicker: t.build_kicker,
      units: r.units,
      unitsLabel: q.pdf.units_label,
      spare: inputs.redundancy ? q.pdf.spare : null,
      buildLine: `${config} · ${fmt(r.footprintM2, 1, L)} m² ${t.footprint_word}`,
      statusLine,
      inputsTitle: q.pdf.inputs_title,
      inputs: inputRows,
      resultsTitle: q.pdf.results_title,
      results: resultRows,
      nextTitle: q.pdf.next_title,
      nextText: q.pdf.next_text,
      disclaimer: q.pdf.disclaimer,
      footer: `${company.name} · ${company.addressLine} · ${g.company.vat_label} ${company.vat} · ${company.email} · www.enfrio.it`,
      logo: g.images.logo,
      render: g.images.mtower_render,
    });
  } catch (error) {
    console.error("[quote]", ref, "PDF not built — request sent without it", error);
  }
  const pdfBase64 = pdf ? Buffer.from(pdf).toString("base64") : null;
  const filename = `${(q.pdf.filename.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "Enfrio-M-Tower").slice(0, 60)}-${ref}.pdf`;

  const kiwiMessage = [
    `Company: ${values.company}`,
    `${q.drawer.location}: ${values.location || "—"}`,
    `${f.timeline}: ${timelineLabel}`,
    "",
    summary,
    ...(values.notes ? ["", `${q.drawer.notes}:`, values.notes] : []),
  ]
    .join("\n")
    .slice(0, KIWI_MAX_MESSAGE);

  const kiwiLead = {
    name: values.name,
    email: values.email,
    phone: values.phone || undefined,
    message: kiwiMessage,
    source: `enfrio.it${localePath(lang, "/tower-m")} · configuratore M Tower`,
    metadata: {
      type: "mtower_quote",
      ref,
      company: values.company,
      location: values.location,
      timeline,
      consent: true,
      inputs,
      result: r,
      coefficients: k,
    },
  };

  try {
    // Enfrio first: the requester gets the PDF ("Enfrio will reply") only
    // once someone at Enfrio has actually been told.
    const emailed = await sendFormSubmit(
      {
        _subject: fill(q.notify.subject, { ref, company: values.company }),
        _replyto: values.email,
        _template: "table",
        _captcha: "false",
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone || "—",
        location: values.location || "—",
        timeline: timelineLabel,
        reference: ref,
        configuration: summary,
        notes: values.notes || "—",
      },
      localePath(lang, "/tower-m"),
    );
    const kiwi = await sendKiwiContact(
      emailed && pdfBase64
        ? {
            ...kiwiLead,
            requesterCopy: {
              subject: fill(q.email.subject, { ref }),
              text: fill(q.email.text, { ref }),
              filename,
              pdfBase64,
              lang,
            },
          }
        : kiwiLead,
      visitor,
    );

    if (!emailed) {
      console.error(
        "[quote]", ref, "email to", TARGET_INBOX, "not delivered —",
        kiwi.stored ? "request kept in the Kiwi panel only" : "request not stored anywhere",
      );
      return { status: "error", message: withEmail(m.not_delivered), values };
    }
    if (!kiwi.stored) console.warn("[quote]", ref, "emailed but NOT stored in the Kiwi panel");

    return {
      status: "success",
      message: "",
      ref,
      email: values.email,
      emailed: kiwi.requesterCopy === "sent",
      ...(pdfBase64 ? { pdf: { filename, base64: pdfBase64 } } : {}),
    };
  } catch (error) {
    console.error("[quote] unexpected error", error);
    return { status: "error", message: withEmail(m.unexpected), values };
  }
}
