import { NextRequest, NextResponse } from "next/server";

/**
 * Kiwi editor bootstrap. The editor opens `https://www.enfrio.it/<path>?kiwi_edit=1&token=<jwt>`
 * in an iframe; the token is handed to /api/kiwi-edit/init, which verifies it,
 * turns on draft mode + the edit cookie and redirects back to the clean path
 * (so the token doesn't linger in the URL or the history).
 *
 * The matcher only fires on URLs carrying `kiwi_edit`: normal visits never
 * run this code.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const token = url.searchParams.get("token");
  if (url.searchParams.get("kiwi_edit") !== "1" || !token || url.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  const clean = url.clone();
  clean.searchParams.delete("kiwi_edit");
  clean.searchParams.delete("token");

  const init = url.clone();
  init.pathname = "/api/kiwi-edit/init";
  init.search = "";
  init.searchParams.set("token", token);
  init.searchParams.set("next", clean.pathname + clean.search);
  return NextResponse.redirect(init, 307);
}

export const config = {
  matcher: [{ source: "/:path*", has: [{ type: "query", key: "kiwi_edit" }] }],
};
