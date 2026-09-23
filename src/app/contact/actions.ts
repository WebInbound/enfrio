"use server";

import { cookies } from "next/headers";
import { getContent, sendKiwiContact } from "@/lib/kiwi";
import { fill } from "@/lib/content-format";
import { CONTACT_FORM } from "@/content/contact";
import { GLOBAL } from "@/content/global";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company" | "message" | "consent", string>>;
};

// Leads are delivered twice, independently: stored in the Kiwi panel
// ("Messaggi") AND emailed to the company inbox through FormSubmit, as
// before the integration. The visitor sees success if at least one of the
// two worked, so a lead is never lost because one channel is down.
const TARGET_INBOX = process.env.CONTACT_TO ?? "info@enfrio.eu";
// FormSubmit ties a form to its referring domain and rejects server-side
// calls that don't look like they came from it. Must match the live origin.
const SITE_ORIGIN = process.env.SITE_URL ?? "https://www.enfrio.it";

// Per-browser rate limit. Set after a successful send, blocks resubmits
// from the same browser for RATE_LIMIT_SECONDS. Not a defence against
// determined bots (a fresh cookie jar bypasses it) but it's a cheap
// brake against the "user clicks send three times in panic" pattern and
// against scripted reload-and-resubmit loops.
const RATE_LIMIT_SECONDS = 30;
const RATE_LIMIT_COOKIE = "enfrio_contact_sent";

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
  ].join("\n");

  try {
    const [storedInKiwi, emailed] = await Promise.all([
      sendKiwiContact({
        name,
        email,
        phone: phone || undefined,
        message: kiwiMessage,
        source: "enfrio.it/contact",
        metadata: { company, projectScope, timeline, consent: true },
      }),
      sendFormSubmit(payload),
    ]);

    if (!storedInKiwi && !emailed) {
      return { status: "error", message: withEmail(m.not_delivered) };
    }
    if (!emailed) {
      console.error("[contact] lead stored ONLY in the Kiwi panel — email to", TARGET_INBOX, "not delivered");
    } else if (!storedInKiwi) {
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
    return { status: "error", message: withEmail(m.unexpected) };
  }
}

/** Email the lead to the company inbox through FormSubmit. Never throws. */
async function sendFormSubmit(payload: Record<string, string>): Promise<boolean> {
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(TARGET_INBOX)}`;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // FormSubmit's anti-abuse check rejects server-side calls with no
        // browser Origin/Referer ("...open this page through a web server"),
        // and it's the domain it ties the form + activation to. This runs as
        // a server action, so set them explicitly to the live site origin.
        Origin: SITE_ORIGIN,
        Referer: `${SITE_ORIGIN}/contact`,
      },
      body: JSON.stringify(payload),
    });

    // FormSubmit returns HTTP 200 even on logical failures (missing referer,
    // form not yet activated, captcha, etc.) with {"success":"false"}. Only
    // checking response.ok would report a FALSE success and silently drop the
    // lead — so validate the JSON success flag (it comes back as a string).
    const result = (await response.json().catch(() => null)) as
      | { success?: string | boolean; message?: string }
      | null;
    const delivered =
      response.ok &&
      (result?.success === true || result?.success === "true");

    if (!delivered) {
      console.error(
        "[contact] FormSubmit not delivered",
        response.status,
        result?.message ?? "<no body>",
      );
    }
    return delivered;
  } catch (error) {
    console.error("[contact] FormSubmit unreachable", error instanceof Error ? error.name : error);
    return false;
  }
}
