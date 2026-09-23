import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { KIWI_TAG } from "@/lib/kiwi";

/**
 * On-demand revalidation webhook, called by the Kiwi panel after a publish
 * (companies.site_revalidate_url = https://www.enfrio.it/api/revalidate).
 *
 *   POST /api/revalidate?secret=<KIWI_REVALIDATE_SECRET>&path=/...
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
  const secret = req.nextUrl.searchParams.get("secret") ?? req.headers.get("x-kiwi-secret");
  if (!secretMatches(secret)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  revalidateTag(KIWI_TAG, "max");

  return NextResponse.json({
    revalidated: true,
    tags: [KIWI_TAG],
    paths: req.nextUrl.searchParams.getAll("path"),
    now: Date.now(),
  });
}
