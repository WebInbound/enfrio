import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { KIWI_TAG } from "@/lib/kiwi";

/**
 * On-demand revalidation webhook, called by the Kiwi panel after a publish
 * (companies.site_revalidate_url = https://www.enfrio.it/api/revalidate).
 *
 *   POST /api/revalidate?path=/...
 *   x-kiwi-secret: <KIWI_REVALIDATE_SECRET>
 *
 * The secret travels in the header, never in the URL (a query string ends up
 * in access logs). `?secret=` is still accepted for panels older than
 * 25 Sep 2026. A wrong header gets 401, not 403: the panel falls back to
 * `?secret=` only on the 403 of old sites, so a new secret (halfway through a
 * rotation) never lands in a URL. See docs/siti-clienti-revalidate-header.md
 * in kiwi-network.
 *
 * Every Kiwi read of the site (blocks + collections) carries the `kiwi`
 * cache tag, and a block can appear on any page, so the whole tag is marked
 * stale whatever paths Kiwi sends. "max" = stale-while-revalidate: the next
 * visitor still gets the previous page instantly while it regenerates in the
 * background, and if Kiwi fails during that regeneration the last good
 * content is kept (never the defaults, never an error page).
 */
export const dynamic = "force-dynamic";

function secretMatches(given: string | null): boolean {
  const expected = process.env.KIWI_REVALIDATE_SECRET ?? "";
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const fromHeader = req.headers.get("x-kiwi-secret");
  if (!secretMatches(fromHeader ?? req.nextUrl.searchParams.get("secret"))) {
    return NextResponse.json({ error: "forbidden" }, { status: fromHeader ? 401 : 403 });
  }

  revalidateTag(KIWI_TAG, "max");

  return NextResponse.json({
    revalidated: true,
    tags: [KIWI_TAG],
    paths: req.nextUrl.searchParams.getAll("path"),
    now: Date.now(),
  });
}
