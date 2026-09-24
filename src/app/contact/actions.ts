"use server";

import { cookies, headers } from "next/headers";
import { getContent, sendKiwiContact } from "@/lib/kiwi";
import { fill } from "@/lib/content-format";
import { CONTACT_FORM } from "@/content/contact";
import { GLOBAL } from "@/content/global";
import { sendFormSubmit, TARGET_INBOX } from "@/lib/formsubmit";

/** What the visitor typed in the uncontrolled fields, handed back on an error. */
export type ContactFormValues = { name: string; company: string; email: string; phone: string; consent: boolean };

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company" | "message" | "consent", string>>;
  /**
   * On "error" only: the submitted values, used as the fields' defaultValue.
   * React 19 resets an action <form> after every submission, error or not;
   * without these the visitor would retype everything after one typo.
   */
  values?: ContactFormValues;
};

// Every lead is stored in the Kiwi panel ("Messaggi") AND emailed to the
// company inbox through FormSubmit, as before the integration. Only the email
// reaches a person today: Kiwi notifies the company's "owner" member, and
// Enfrio has none yet. So the visitor sees success only when the email went
// out; with the Kiwi copy alone they get the "email us directly" error (the
// copy stays in the panel all the same).
// Per-browser rate limit. Set after a successful send, blocks resubmits
// from the same browser for RATE_LIMIT_SECONDS. Not a defence against
// determined bots (a fresh cookie jar bypasses it) but it's a cheap
// brake against the "user clicks send three times in panic" pattern and
// against scripted reload-and-resubmit loops.
const RATE_LIMIT_SECONDS = 30;
const RATE_LIMIT_COOKIE = "enfrio_contact_sent";

// /api/site/contact refuses (400) a message longer than this.
const KIWI_MAX_MESSAGE = 10_000;

// Only the company data section of the global blocks (same slugs).
const COMPANY_DATA = { id: GLOBAL.id, sections: { company: GLOBAL.sections.company } };

function isValidEmail(email: string): boolean {
  // Require at least a 2-letter TLD so we don't accept "a@b.c". Still
  // intentionally permissive — formsubmit.co does the real validation.
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email);
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const cookieJar = await cookies();
  const [{ messages: m }, { company: companyData }] = await Promise.all([
    getContent(CONTACT_FORM),
    getContent(COMPANY_DATA),
  ]);
  const withEmail = (text: string) => fill(text, { email: companyData.email });

  // Reject same-browser resubmits inside the rate window. We return
  // success-shape so a bot/spammer can't probe the cookie state.
  if (cookieJar.get(RATE_LIMIT_COOKIE)?.value === "1") {
    return { status: "success", message: m.repeat };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const projectScope = String(formData.get("projectScope") ?? "").trim();
  const timeline = String(formData.get("timeline") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const consent = formData.get("consent") === "on" || formData.get("consent") === "true";
  const honeypot = String(formData.get("company_url") ?? "").trim();
  const values: ContactFormValues = { name, company, email, phone, consent };

  if (honeypot) {
    return { status: "success", message: m.spam_success };
  }

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = m.name_required;
  if (!email) fieldErrors.email = m.email_required;
  else if (!isValidEmail(email)) fieldErrors.email = m.email_invalid;
  if (!company) fieldErrors.company = m.company_required;
  if (!message || message.length < 20) fieldErrors.message = m.message_short;
  if (!consent) fieldErrors.consent = m.consent_required;

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: m.review,
      fieldErrors,
      values,
    };
  }

  // FormSubmit (https://formsubmit.co) — zero-setup forwarding service.
  // First send to a given inbox triggers a one-time confirmation email
  // that the inbox owner must approve. After that every submission is
  // forwarded to the inbox.
  const payload = {
    _subject: `Enfrio website inquiry — ${company}`,
    _replyto: email,
    _template: "table",
    _captcha: "false",
    name,
    company,
    email,
    phone: phone || "—",
    projectScope: projectScope || "—",
    timeline: timeline || "—",
    message,
  };

  // Same lead for the Kiwi panel: the extra fields go in the message body
  // (the panel shows name / email / phone / message) and in metadata.
  const kiwiMessage = [
    `Company: ${company}`,
    `Project scope: ${projectScope || "—"}`,
    `Timeline: ${timeline || "—"}`,
    "",
    message,
  ]
    .join("\n")
    // Capped to what Kiwi accepts, so a very long message is still stored
    // there (the email carries it in full).
    .slice(0, KIWI_MAX_MESSAGE);

  // Kiwi rate-limits /api/site/contact per caller IP, and the caller is this
  // server: hand it the visitor's IP too (signed, see sendKiwiContact).
  const requestHeaders = await headers();
  const visitor = {
    ip:
      (requestHeaders.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
      (requestHeaders.get("x-real-ip") ?? "").trim(),
    userAgent: requestHeaders.get("user-agent") ?? "",
  };

  try {
    const [{ stored: storedInKiwi }, emailed] = await Promise.all([
      sendKiwiContact({
        name,
        email,
        phone: phone || undefined,
        message: kiwiMessage,
        source: "enfrio.it/contact",
        metadata: { company, projectScope, timeline, consent: true },
      }, visitor),
      sendFormSubmit(payload, "/contact"),
    ]);

    if (!emailed) {
      // Nobody is notified of a lead that exists only in the Kiwi panel:
      // the visitor is asked to write directly (and can retry).
      console.error(
        "[contact] email to", TARGET_INBOX, "not delivered —",
        storedInKiwi ? "lead kept in the Kiwi panel only" : "lead not stored anywhere",
        "— visitor asked to email directly",
      );
      return { status: "error", message: withEmail(m.not_delivered), values };
    }
    if (!storedInKiwi) {
      console.warn("[contact] lead emailed but NOT stored in the Kiwi panel");
    }

    // Drop a short-lived cookie so the same browser can't pound the
    // endpoint. The cookie is HttpOnly so client JS can't flush it.
    cookieJar.set({
      name: RATE_LIMIT_COOKIE,
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: RATE_LIMIT_SECONDS,
      path: "/",
    });

    return { status: "success", message: m.success };
  } catch (error) {
    console.error("[contact] unexpected error", error);
    return { status: "error", message: withEmail(m.unexpected), values };
  }
}

