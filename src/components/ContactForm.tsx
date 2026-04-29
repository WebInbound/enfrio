"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn solid" disabled={pending}>
      {pending ? "Sending..." : "Send inquiry"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="contact-form" noValidate>
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
          <input type="text" name="name" required autoComplete="name" aria-invalid={Boolean(errors.name)} />
          {errors.name ? <em className="form-error">{errors.name}</em> : null}
        </label>
        <label className="form-field">
          <span>Company *</span>
          <input type="text" name="company" required autoComplete="organization" aria-invalid={Boolean(errors.company)} />
          {errors.company ? <em className="form-error">{errors.company}</em> : null}
        </label>
        <label className="form-field">
          <span>Work email *</span>
          <input type="email" name="email" required autoComplete="email" aria-invalid={Boolean(errors.email)} />
          {errors.email ? <em className="form-error">{errors.email}</em> : null}
        </label>
        <label className="form-field">
          <span>Phone</span>
          <input type="tel" name="phone" autoComplete="tel" />
        </label>
        <label className="form-field">
          <span>Project scope</span>
          <select name="projectScope" defaultValue="">
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
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          placeholder="Engine power class, heat rejection target, installation context, anything we should know..."
        />
        {errors.message ? <em className="form-error">{errors.message}</em> : null}
      </label>

      <label className="form-check">
        <input type="checkbox" name="consent" required aria-invalid={Boolean(errors.consent)} />
        <span>
          I consent to Enfrio processing the data I submitted to reply to my inquiry, in line with the{" "}
          <a href="/legal">privacy policy</a>.
        </span>
      </label>
      {errors.consent ? <em className="form-error">{errors.consent}</em> : null}

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
