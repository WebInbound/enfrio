import { NextResponse } from "next/server";
import { endEditSession } from "@/lib/kiwi-edit-session";

export const dynamic = "force-dynamic";

/**
 * POST /api/kiwi-edit/logout — the overlay calls it (sendBeacon) when the
 * editor closes or the iframe unloads: draft mode off, edit cookie deleted.
 */
export async function POST() {
  await endEditSession();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
