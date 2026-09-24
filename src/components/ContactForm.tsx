"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";
import EditSpan from "@/components/EditSpan";
import type { EditAttrs } from "@/lib/kiwi-edit";

/** Form texts, resolved server-side from the Kiwi panel ("Form contatti › Campi"). */
export type ContactFormLabels = {
  name: string;
  company: string;
  email: string;
  phone: string;
  scope: string;
  timeline: string;
  select_placeholder: string;
  scope_power: string;
  scope_datacenter: string;
  scope_mtower: string;
  scope_custom: string;
  scope_other: string;
  timeline_3m: string;
  timeline_6m: string;
  timeline_12m: string;
  timeline_exploring: string;
  message: string;
  message_placeholder: string;
  consent: string;
  consent_link: string;
  consent_end: string;
  submit: string;
  sending: string;
  prefill: string;
};

const initialState: ContactFormState = { status: "idle", message: "" };

const SCOPE_OPTIONS = [
  "power-generation",
  "datacenter",
  "m-tower",
  "custom",
  "other",
] as const;

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn solid magnetic" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function ContactForm({
  labels: t,
  edit: ed,
}: {
  labels: ContactFormLabels;
  /** Kiwi editor markers, same keys as `labels` (undefined for visitors). */
  edit?: Partial<Record<keyof ContactFormLabels, EditAttrs>>;
}) {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const errors = state.fieldErrors ?? {};
  // After an error the action hands back what was typed: React resets an
  // action <form> after every submission, to these defaults (empty on success).
  const typed = state.values;

  const params = useSearchParams();

  // Pre-fill from URL when the sizer (or any external link) hands us a config
  const [scope, setScope] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!params) return;
    const scopeParam = params.get("scope") ?? "";
    const messageParam = params.get("message") ?? "";
    let didPrefill = false;
    if (SCOPE_OPTIONS.includes(scopeParam as (typeof SCOPE_OPTIONS)[number])) {
      setScope(scopeParam);
      didPrefill = true;
    }
    if (messageParam) {
      setMessage(messageParam);
      didPrefill = true;
    }
    setPrefilled(didPrefill);
  }, [params]);

  // Once the server action returns success, drop the local prefill flag
  // and reset the form's controlled fields. The native <form> resets on
  // success too (action submission), but the controlled selects/textarea
  // need an explicit nudge — otherwise the success banner sits next to a
  // still-filled-in form, which reads like the submit silently failed.
  useEffect(() => {
    if (state.status === "success") {
      setScope("");
      setTimeline("");
      setMessage("");
      setPrefilled(false);
      const form = document.getElementById("contact-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.status]);

  return (
    <form action={formAction} className="contact-form" noValidate id="contact-form">
      {prefilled ? (
        <div className="form-prefill" role="status">
          <span>✓</span>
          <p {...ed?.prefill}>{t.prefill}</p>
        </div>
      ) : null}

      {/* Honeypot: bots fill it, humans don't see it */}
      <div className="hp-field" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span {...ed?.name}>{t.name}</span>
          <input type="text" name="name" required autoComplete="name" defaultValue={typed?.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "err-name" : undefined} />
          {errors.name ? <em className="form-error" id="err-name" role="alert">{errors.name}</em> : null}
        </label>
        <label className="form-field">
          <span {...ed?.company}>{t.company}</span>
          <input type="text" name="company" required autoComplete="organization" defaultValue={typed?.company} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "err-company" : undefined} />
          {errors.company ? <em className="form-error" id="err-company" role="alert">{errors.company}</em> : null}
        </label>
        <label className="form-field">
          <span {...ed?.email}>{t.email}</span>
          <input type="email" name="email" required autoComplete="email" defaultValue={typed?.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "err-email" : undefined} />
          {errors.email ? <em className="form-error" id="err-email" role="alert">{errors.email}</em> : null}
        </label>
        <label className="form-field">
          <span {...ed?.phone}>{t.phone}</span>
          <input type="tel" name="phone" autoComplete="tel" defaultValue={typed?.phone} />
        </label>
        <label className="form-field">
          <span {...ed?.scope}>{t.scope}</span>
          <select
            name="projectScope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="" disabled>{t.select_placeholder}</option>
            <option value="power-generation">{t.scope_power}</option>
            <option value="datacenter">{t.scope_datacenter}</option>
            <option value="m-tower">{t.scope_mtower}</option>
            <option value="custom">{t.scope_custom}</option>
            <option value="other">{t.scope_other}</option>
          </select>
        </label>
        <label className="form-field">
          <span {...ed?.timeline}>{t.timeline}</span>
          <select name="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
            <option value="" disabled>{t.select_placeholder}</option>
            <option value="under-3m">{t.timeline_3m}</option>
            <option value="3-6m">{t.timeline_6m}</option>
            <option value="6-12m">{t.timeline_12m}</option>
            <option value="exploring">{t.timeline_exploring}</option>
          </select>
        </label>
      </div>

      <label className="form-field full">
        <span {...ed?.message}>{t.message}</span>
        <textarea
          name="message"
          rows={8}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "err-message" : undefined}
          placeholder={t.message_placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {errors.message ? <em className="form-error" id="err-message" role="alert">{errors.message}</em> : null}
      </label>

      <label className="form-check">
        <input type="checkbox" name="consent" required defaultChecked={typed?.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "err-consent" : undefined} />
        <span>
          <EditSpan a={ed?.consent}>{t.consent}</EditSpan>{" "}
          <a href="/legal" {...ed?.consent_link}>{t.consent_link}</a><EditSpan a={ed?.consent_end}>{t.consent_end}</EditSpan>
        </span>
      </label>
      {errors.consent ? <em className="form-error" id="err-consent" role="alert">{errors.consent}</em> : null}

      <div className="form-actions">
        <SubmitButton label={t.submit} pendingLabel={t.sending} />
        {state.status !== "idle" ? (
          <p className={`form-status ${state.status}`} role="status">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
