"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary. Next.js mounts this when a rendering or runtime
 * error escapes a route segment. We don't wrap with SiteShell because
 * the shell itself uses `usePathname` and other client hooks that could
 * be the source of the error — keep this page deliberately minimal.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the server logs / Vercel function logs so we notice in
    // production. The digest is what Next.js correlates against its
    // server-side stack trace.
    console.error("[error-boundary]", error.message, error.digest);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 24px",
        background: "linear-gradient(170deg, #0c1422, #131f33)",
        color: "#f4f8ff",
        fontFamily: "var(--font-body, system-ui, sans-serif)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 540 }}>
        <p
          style={{
            color: "#add934",
            fontWeight: 600,
            letterSpacing: "0.16em",
            margin: 0,
          }}
        >
          UNEXPECTED ERROR
        </p>
        <h1 style={{ margin: "12px 0 16px", fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Something broke on our side.
        </h1>
        <p style={{ color: "#bcc8dc", lineHeight: 1.55, margin: 0 }}>
          We&apos;ve logged the issue. You can try the page again or head back
          to the home page in the meantime.
        </p>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#add934",
              color: "#0c1422",
              border: "none",
              padding: "11px 22px",
              borderRadius: 999,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              background: "transparent",
              color: "#f4f8ff",
              border: "1px solid rgba(244, 248, 255, 0.32)",
              padding: "10px 22px",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
