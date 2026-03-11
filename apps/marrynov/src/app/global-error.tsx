"use client";

import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Capture les erreurs React non-catchées au niveau root (App Router).
 * Doit être un Client Component avec sa propre structure html/body.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          color: "#2c3e50",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Une erreur inattendue est survenue
        </h1>
        <p style={{ color: "#64748b", maxWidth: "400px" }}>
          L&apos;équipe a été notifiée automatiquement. Rechargez la page ou réessayez
          dans quelques instants.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.625rem 1.5rem",
            background: "#6b40a0",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            outline: "2px solid transparent",
            outlineOffset: "2px",
          }}
          onFocus={(e) => (e.currentTarget.style.outline = "2px solid #6b40a0")}
          onBlur={(e) => (e.currentTarget.style.outline = "2px solid transparent")}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
