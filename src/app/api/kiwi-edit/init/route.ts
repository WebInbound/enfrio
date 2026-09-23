import { NextRequest, NextResponse } from "next/server";
import { verifyEditToken } from "@/lib/kiwi-edit";
import { safeNext, startEditSession } from "@/lib/kiwi-edit-session";

export const dynamic = "force-dynamic";

/**
 * GET  /api/kiwi-edit/init?token=<jwt>&next=/path — first load of the editor
 *      iframe (via src/proxy.ts): valid token → draft mode + edit cookie →
 *      redirect to `next`. Invalid/missing token → plain redirect, nothing set.
 * POST /api/kiwi-edit/init { token } — the editor re-mints the 5-minute token
 *      every ~4 minutes; the overlay posts it here to renew the cookie.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  const payload = await verifyEditToken(token);
  if (payload && token) await startEditSession(token, payload);
  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token : "";
  const payload = await verifyEditToken(token);
  if (!payload) return NextResponse.json({ ok: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
  await startEditSession(token, payload);
  return NextResponse.json({ ok: true, exp: payload.exp }, { headers: { "Cache-Control": "no-store" } });
}
