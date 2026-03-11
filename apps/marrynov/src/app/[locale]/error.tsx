"use client";

import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Capture les erreurs React dans les routes du layout [locale].
 * Affiche une page d'erreur stylée avec le design MARRYNOV.
 */
export default function LocaleError({
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
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <p
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#6b40a0",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Erreur
      </p>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#2c3e50",
          maxWidth: "480px",
        }}
      >
        Une erreur est survenue sur cette page
      </h1>
      <p style={{ color: "#64748b", maxWidth: "400px" }}>
        Le problème a été signalé automatiquement. Vous pouvez réessayer ou revenir à
        l&apos;accueil.
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
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
        <a
          href="/"
          style={{
            padding: "0.625rem 1.5rem",
            background: "transparent",
            color: "#6b40a0",
            border: "1px solid #6b40a0",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Retour à l&apos;accueil
        </a>
      </div>
    </main>
  );
}
