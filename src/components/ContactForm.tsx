"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

const SCOPE_OPTIONS = [
  "power-generation",
  "datacenter",
  "m-tower",
  "custom",
  "other",
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn solid magnetic" disabled={pending}>
      {pending ? "Sending..." : "Send inquiry"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const errors = state.fieldErrors ?? {};

  const params = useSearchParams();

  // Pre-fill from URL when the sizer (or any external link) hands us a config
  const [scope, setScope] = useState("");
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
          <p>
            Your M Tower configuration has been added below. Review the message,
            add a name, company and email, and send.
          </p>
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
          <span>Name *</span>
          <input type="text" name="name" required autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "err-name" : undefined} />
          {errors.name ? <em className="form-error" id="err-name" role="alert">{errors.name}</em> : null}
        </label>
        <label className="form-field">
          <span>Company *</span>
          <input type="text" name="company" required autoComplete="organization" aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? "err-company" : undefined} />
          {errors.company ? <em className="form-error" id="err-company" role="alert">{errors.company}</em> : null}
        </label>
        <label className="form-field">
          <span>Work email *</span>
          <input type="email" name="email" required autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "err-email" : undefined} />
          {errors.email ? <em className="form-error" id="err-email" role="alert">{errors.email}</em> : null}
        </label>
        <label className="form-field">
          <span>Phone</span>
          <input type="tel" name="phone" autoComplete="tel" />
        </label>
        <label className="form-field">
          <span>Project scope</span>
          <select
            name="projectScope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="" disabled>Select...</option>
            <option value="power-generation">Power Generation cooling</option>
            <option value="datacenter">Datacenter cooling</option>
            <option value="m-tower">M Tower platform sizing</option>
            <option value="custom">Custom thermal architecture</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="form-field">
          <span>Timeline</span>
          <select name="timeline" defaultValue="">
            <option value="" disabled>Select...</option>
            <option value="under-3m">Under 3 months</option>
            <option value="3-6m">3 – 6 months</option>
            <option value="6-12m">6 – 12 months</option>
            <option value="exploring">Just exploring</option>
          </select>
        </label>
      </div>

      <label className="form-field full">
        <span>Tell us about your project *</span>
        <textarea
          name="message"
          rows={8}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "err-message" : undefined}
          placeholder="Engine power class, heat rejection target, installation context, anything we should know..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {errors.message ? <em className="form-error" id="err-message" role="alert">{errors.message}</em> : null}
      </label>

      <label className="form-check">
        <input type="checkbox" name="consent" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "err-consent" : undefined} />
        <span>
          I consent to Enfrio processing the data I submitted to reply to my inquiry, in line with the{" "}
          <a href="/legal">privacy policy</a>.
        </span>
      </label>
      {errors.consent ? <em className="form-error" id="err-consent" role="alert">{errors.consent}</em> : null}

      <div className="form-actions">
        <SubmitButton />
        {state.status !== "idle" ? (
          <p className={`form-status ${state.status}`} role="status">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
