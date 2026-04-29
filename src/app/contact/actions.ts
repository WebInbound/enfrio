"use server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company" | "message" | "consent", string>>;
};

const TARGET_INBOX = process.env.CONTACT_TO ?? "info@enfrio.eu";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
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
    return { status: "success", message: "Thank you. We will be in touch shortly." };
  }

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!email) fieldErrors.email = "Email is required.";
  else if (!isValidEmail(email)) fieldErrors.email = "Enter a valid email address.";
  if (!company) fieldErrors.company = "Company is required.";
  if (!message || message.length < 20) fieldErrors.message = "Tell us a bit more about your project (at least 20 characters).";
  if (!consent) fieldErrors.consent = "We need your consent to process this request.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please review the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // FormSubmit (https://formsubmit.co) — zero-setup forwarding service.
  // First send to a given inbox triggers a one-time confirmation email
  // that the inbox owner must approve. After that every submission is
  // forwarded to the inbox.
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(TARGET_INBOX)}`;

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

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "<no body>");
      console.error("[contact] FormSubmit error", response.status, detail);
      return {
        status: "error",
        message:
          "We couldn't deliver your message right now. Please retry shortly or email info@enfrio.eu directly.",
      };
    }

    return {
      status: "success",
      message: "Thank you. Your inquiry was sent to the Enfrio team — we will reply within one business day.",
    };
  } catch (error) {
    console.error("[contact] unexpected error", error);
    return {
      status: "error",
      message:
        "Something went wrong sending the message. Please retry shortly or email info@enfrio.eu directly.",
    };
  }
}
