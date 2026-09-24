import "server-only";

// FormSubmit (https://formsubmit.co) — zero-setup forwarding service. The
// first send to a given inbox triggers a one-time confirmation email that the
// inbox owner must approve; after that every submission is forwarded.
export const TARGET_INBOX = process.env.CONTACT_TO ?? "info@enfrio.eu";
// FormSubmit ties a form to its referring domain and rejects server-side
// calls that don't look like they came from it. Must match the live origin.
const SITE_ORIGIN = process.env.SITE_URL ?? "https://www.enfrio.it";

// Only production writes to Enfrio's real inbox. A preview (or a local
// `next start`) would otherwise email the company for every test: there the
// send is skipped and reported as delivered, unless CONTACT_TO is set
// explicitly for that environment.
const DRY_RUN = process.env.VERCEL_ENV !== "production" && !process.env.CONTACT_TO;

/** Email a lead to the company inbox through FormSubmit. Never throws. */
export async function sendFormSubmit(payload: Record<string, string>, refererPath: string): Promise<boolean> {
  if (DRY_RUN) {
    console.info(`[formsubmit] ${process.env.VERCEL_ENV ?? "local"}: email to ${TARGET_INBOX} skipped (not production)`);
    return true;
  }
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
        Referer: `${SITE_ORIGIN}${refererPath}`,
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
