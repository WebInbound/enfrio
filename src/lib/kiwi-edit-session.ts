import "server-only";
import { cookies, draftMode } from "next/headers";
import { EDIT_COOKIE, type EditPayload } from "@/lib/kiwi-edit";

// Next's draft mode cookie (next/dist/server/api-utils COOKIE_NAME_PRERENDER_BYPASS).
const DRAFT_COOKIE = "__prerender_bypass";

// The editor iframe is cross-site (kiwienterprise.it → enfrio.it): cookies
// must be SameSite=None; Secure, and Partitioned so that browsers blocking
// third-party cookies keep them inside the editor — and so they are never
// sent when someone opens www.enfrio.it directly.
const base = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  partitioned: true,
};

/** Turn the editor session on (draft mode + edit token cookie). Route handlers only. */
export async function startEditSession(token: string, payload: EditPayload) {
  const dm = await draftMode();
  dm.enable();
  const jar = await cookies();
  const bypass = jar.get(DRAFT_COOKIE)?.value;
  if (bypass) jar.set({ ...base, name: DRAFT_COOKIE, value: bypass });
  const maxAge = Math.max(60, payload.exp - Math.floor(Date.now() / 1000));
  jar.set({ ...base, name: EDIT_COOKIE, value: token, maxAge });
}

/** Turn it off (editor closed). */
export async function endEditSession() {
  const dm = await draftMode();
  dm.disable();
  const jar = await cookies();
  const expired = { ...base, value: "", expires: new Date(0) };
  jar.set({ ...expired, name: DRAFT_COOKIE });
  jar.set({ ...expired, name: EDIT_COOKIE });
}

/** Relative same-site path only (no open redirect). */
export function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}
