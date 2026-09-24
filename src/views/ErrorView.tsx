"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { localePath } from "@/lib/i18n";

// Fixed texts on purpose: when something broke, the panel may be the cause.
const TEXT = {
  en: {
    kicker: "UNEXPECTED ERROR",
    title: "Something broke on our side.",
    body: "We've logged the issue. You can try the page again or head back to the home page in the meantime.",
    retry: "Try again",
    home: "Back to home",
  },
  it: {
    kicker: "ERRORE IMPREVISTO",
    title: "Qualcosa non ha funzionato da parte nostra.",
    body: "Abbiamo registrato il problema. Potete riprovare a caricare la pagina o tornare alla home.",
    retry: "Riprova",
    home: "Torna alla home",
  },
};

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
  const { lang } = useI18n();
  const t = TEXT[lang];
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
        background: "linear-gradient(170deg, var(--deep-blue), var(--deep-blue-2))",
        color: "#f4f8ff",
        fontFamily: "var(--font-urbanist, system-ui, sans-serif)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 540 }}>
        <p
          style={{
            color: "var(--brand)",
            fontWeight: 600,
            letterSpacing: "0.16em",
            margin: 0,
          }}
        >
          {t.kicker}
        </p>
        <h1 style={{ margin: "12px 0 16px", fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          {t.title}
        </h1>
        <p style={{ color: "#bcc8dc", lineHeight: 1.55, margin: 0 }}>
          {t.body}
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
              background: "var(--brand)",
              color: "var(--deep-blue-2)",
              border: "none",
              padding: "11px 22px",
              borderRadius: 999,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.retry}
          </button>
          <Link
            href={localePath(lang, "/")}
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
            {t.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
