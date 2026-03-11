import { Suspense } from "react";
import { StatsContent } from "./stats-content";

export const metadata = {
  title: "Statistiques | Admin MARRYNOV",
};

export default function StatsPage() {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--color-dark)",
          marginBottom: "0.25rem",
        }}
      >
        Statistiques du site
      </h1>
      <p
        style={{
          color: "var(--color-muted)",
          fontSize: "0.875rem",
          marginBottom: "2rem",
        }}
      >
        Données Google Analytics — 28 derniers jours · Actualisées toutes les 24h
      </p>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsContent />
      </Suspense>
    </main>
  );
}

function StatsSkeleton() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            height: "120px",
            background: "var(--color-bg)",
            borderRadius: "8px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}
