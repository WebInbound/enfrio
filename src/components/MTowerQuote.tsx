"use client";

import { useActionState, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitQuoteRequest, type QuoteFormState } from "@/actions/quote";
import EditSpan from "@/components/EditSpan";
import type { EditAttrs } from "@/lib/kiwi-edit";
import { fill } from "@/lib/content-format";
import type { SizerInputs, SizerResult } from "@/lib/mtower-sizing";
import { localePath } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

/** Texts of the drawer, from the Kiwi panel ("M Tower › Richiesta d'offerta —" + shared form fields). */
export type QuoteTexts = {
  drawer: {
    kicker: string;
    title: string;
    lead: string;
    build_label: string;
    edit: string;
    close: string;
    location: string;
    location_placeholder: string;
    notes: string;
    notes_placeholder: string;
    email_note: string;
    submit: string;
    sending: string;
  };
  done: {
    kicker: string;
    title: string;
    ref_label: string;
    emailed: string;
    not_emailed: string;
    no_pdf: string;
    download: string;
    back: string;
  };
  fields: {
    name: string;
    company: string;
    email: string;
    phone: string;
    timeline: string;
    select_placeholder: string;
    timeline_3m: string;
    timeline_6m: string;
    timeline_12m: string;
    timeline_exploring: string;
    consent: string;
    consent_link: string;
    consent_end: string;
  };
};

export type QuoteEdit = {
  drawer?: Partial<Record<keyof QuoteTexts["drawer"], EditAttrs>>;
  done?: Partial<Record<keyof QuoteTexts["done"], EditAttrs>>;
  fields?: Partial<Record<keyof QuoteTexts["fields"], EditAttrs>>;
};

/** One line of the configuration summary, labels from the configurator. */
export type QuoteSpec = { label: string; value: string };

type Props = {
  texts: QuoteTexts;
  edit?: QuoteEdit;
  inputs: SizerInputs;
  result: SizerResult;
  /** Configuration rows (inputs) and sized-build rows, already labelled. */
  specs: QuoteSpec[];
  metrics: QuoteSpec[];
  headline: { units: string; unitWord: string; sub: string };
  moduleImg: string;
  onClose: () => void;
};

const initialState: QuoteFormState = { status: "idle", message: "" };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn solid mq-submit" disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function MTowerQuote({ texts, edit, inputs, result, specs, metrics, headline, moduleImg, onClose }: Props) {
  const { drawer: d, done, fields: f } = texts;
  const { lang } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState(submitQuoteRequest, initialState);
  const errors = state.fieldErrors ?? {};
  const typed = state.values;
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");
  const [closing, setClosing] = useState(false);

  // Modal from the first paint: focus trap, Esc, inert page behind. Lenis
  // (smooth scroll) is paused so the wheel scrolls the drawer, not the page.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.documentElement.classList.add("mq-open");
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("mq-open");
    };
  }, []);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      dialogRef.current?.close();
      onClose();
    }, 260);
  };

  // After an error React resets the <form>: put the controlled select back.
  useLayoutEffect(() => {
    if (state.status !== "error") return;
    const select = document.getElementById("mq-timeline") as HTMLSelectElement | null;
    if (select) select.value = timeline;
  }, [state, timeline]);

  // The PDF comes back with the answer: a blob URL for the download button.
  const pdfUrl = useMemo(() => {
    if (!state.pdf) return null;
    const bytes = Uint8Array.from(atob(state.pdf.base64), (c) => c.charCodeAt(0));
    return URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  }, [state.pdf]);
  useEffect(() => () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  }, [pdfUrl]);

  const sent = state.status === "success";
  const shown = Math.min(result.units, 8);

  return (
    <dialog
      ref={dialogRef}
      className={`mq ${closing ? "is-closing" : ""}`}
      aria-labelledby="mq-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog box itself, outside the panel).
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="mq-panel" data-lenis-prevent="">
        <header className="mq-head">
          <div>
            <p className="kicker" {...(sent ? edit?.done?.kicker : edit?.drawer?.kicker)}>{sent ? done.kicker : d.kicker}</p>
            <h2 id="mq-title" {...(sent ? edit?.done?.title : edit?.drawer?.title)}>{sent ? done.title : d.title}</h2>
          </div>
          <button type="button" className="mq-close" onClick={close} aria-label={d.close}>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {!sent ? <p className="mq-lead" {...edit?.drawer?.lead}>{d.lead}</p> : null}

        {/* The build travelling with the request: same numbers as the configurator. */}
        <section className="mq-build" aria-label={d.build_label}>
          <div className="mq-build-top">
            <p className="mq-build-label">
              <span className="mq-led" aria-hidden="true" />
              <span {...edit?.drawer?.build_label}>{d.build_label}</span>
            </p>
            {!sent ? (
              <button type="button" className="mq-edit" onClick={close} {...edit?.drawer?.edit}>
                {d.edit}
              </button>
            ) : null}
          </div>
          <div className="mq-build-main">
            <p className="mq-build-units">
              <strong>{headline.units}</strong>
              <span>{headline.unitWord}</span>
            </p>
            <div className="mq-build-mods" aria-hidden="true" data-count={shown}>
              {Array.from({ length: shown }).map((_, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={moduleImg}
                  alt=""
                  draggable={false}
                  className={inputs.redundancy && i === result.units - 1 ? "spare" : undefined}
                  style={{ animationDelay: `${Math.min(i * 60, 420)}ms` }}
                />
              ))}
              {result.units > shown ? <span className="mq-build-more">+{result.units - shown}</span> : null}
            </div>
          </div>
          <p className="mq-build-sub">{headline.sub}</p>
          <dl className="mq-specs">
            {specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <dl className="mq-specs mq-specs--out">
            {metrics.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {sent ? (
          <div className="mq-done" role="status">
            {state.ref ? (
              <>
                <p className="mq-ref">
                  <span {...edit?.done?.ref_label}>{done.ref_label}</span>
                  <strong>{state.ref}</strong>
                </p>
                <p className="mq-done-text">
                  {fill(state.emailed ? done.emailed : state.pdf ? done.not_emailed : done.no_pdf, { email: state.email ?? "" })}
                </p>
                <div className="mq-done-actions">
                  {pdfUrl && state.pdf ? (
                    <a className="btn solid" href={pdfUrl} download={state.pdf.filename} {...edit?.done?.download}>
                      {done.download}
                    </a>
                  ) : null}
                  <button type="button" className="btn ghost" onClick={close} {...edit?.done?.back}>
                    {done.back}
                  </button>
                </div>
              </>
            ) : (
              <p className="mq-done-text">{state.message}</p>
            )}
          </div>
        ) : (
          <form action={formAction} className="contact-form mq-form" noValidate>
            <input type="hidden" name="lang" value={lang} />
            {/* The configuration, recomputed on the server from these inputs. */}
            <input type="hidden" name="power" value={inputs.power} />
            <input type="hidden" name="application" value={inputs.application} />
            <input type="hidden" name="circuit" value={inputs.circuit} />
            <input type="hidden" name="ambient" value={inputs.ambient} />
            <input type="hidden" name="altitude" value={inputs.altitude} />
            <input type="hidden" name="redundancy" value={inputs.redundancy ? "1" : "0"} />

            <div className="hp-field" aria-hidden="true">
              <label>
                Leave this field empty
                <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span {...edit?.fields?.name}>{f.name}</span>
                <input type="text" name="name" required autoComplete="name" maxLength={200} defaultValue={typed?.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "mq-err-name" : undefined} />
                {errors.name ? <em className="form-error" id="mq-err-name" role="alert">{errors.name}</em> : null}
              </label>
              <label className="form-field">
                <span {...edit?.fields?.company}>{f.company}</span>
                <input type="text" name="company" required autoComplete="organization" maxLength={200} defaultValue={typed?.company} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "mq-err-company" : undefined} />
                {errors.company ? <em className="form-error" id="mq-err-company" role="alert">{errors.company}</em> : null}
              </label>
              <label className="form-field">
                <span {...edit?.fields?.email}>{f.email}</span>
                <input type="email" name="email" required autoComplete="email" maxLength={200} defaultValue={typed?.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "mq-err-email" : undefined} />
                {errors.email ? <em className="form-error" id="mq-err-email" role="alert">{errors.email}</em> : null}
              </label>
              <label className="form-field">
                <span {...edit?.fields?.phone}>{f.phone}</span>
                <input type="tel" name="phone" autoComplete="tel" maxLength={50} defaultValue={typed?.phone} />
              </label>
              <label className="form-field">
                <span {...edit?.drawer?.location}>{d.location}</span>
                <input type="text" name="location" autoComplete="off" maxLength={150} placeholder={d.location_placeholder} defaultValue={typed?.location} />
              </label>
              <label className="form-field">
                <span {...edit?.fields?.timeline}>{f.timeline}</span>
                <select id="mq-timeline" name="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                  <option value="" disabled>{f.select_placeholder}</option>
                  <option value="under-3m">{f.timeline_3m}</option>
                  <option value="3-6m">{f.timeline_6m}</option>
                  <option value="6-12m">{f.timeline_12m}</option>
                  <option value="exploring">{f.timeline_exploring}</option>
                </select>
              </label>
            </div>

            <label className="form-field full">
              <span {...edit?.drawer?.notes}>{d.notes}</span>
              <textarea
                name="notes"
                rows={3}
                maxLength={4000}
                placeholder={d.notes_placeholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            <label className="form-check">
              <input type="checkbox" name="consent" required defaultChecked={typed?.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "mq-err-consent" : undefined} />
              <span>
                <EditSpan a={edit?.fields?.consent}>{f.consent}</EditSpan>{" "}
                <a href={localePath(lang, "/legal")} target="_blank" {...edit?.fields?.consent_link}>{f.consent_link}</a>
                <EditSpan a={edit?.fields?.consent_end}>{f.consent_end}</EditSpan>
              </span>
            </label>
            {errors.consent ? <em className="form-error" id="mq-err-consent" role="alert">{errors.consent}</em> : null}

            <p className="mq-note" {...edit?.drawer?.email_note}>{d.email_note}</p>

            <div className="form-actions">
              <SubmitButton label={d.submit} pendingLabel={d.sending} />
              {state.status === "error" ? (
                <p className="form-status error" role="status">{state.message}</p>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

