"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface AnalyticsData {
  period: string;
  generatedAt: string;
  overview: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  daily: Array<{ date: string; users: number; sessions: number }>;
  sources: Array<{ channel: string; sessions: number }>;
  topPages: Array<{ path: string; title: string; views: number }>;
}

const SOURCE_COLORS = ["#6b40a0", "#e67e22", "#22c55e", "#3b82f6", "#ec4899", "#64748b"];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

function formatDate(yyyymmdd: string): string {
  // "20260101" → "1 jan"
  const d = new Date(
    `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`,
  );
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function StatsContent() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((json: AnalyticsData | { error: string }) => {
        if ("error" in json) {
          setError(json.error);
        } else {
          setData(json);
        }
      })
      .catch(() => setError("Impossible de charger les données"));
  }, []);

  if (error) {
    return (
      <div
        style={{
          padding: "1.5rem",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          color: "#dc2626",
        }}
      >
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ color: "var(--color-muted)", textAlign: "center", padding: "3rem" }}>
        Chargement des données…
      </div>
    );
  }

  const { overview, daily, sources, topPages } = data;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {[
          {
            label: "Visiteurs uniques",
            value: overview.activeUsers.toLocaleString("fr"),
          },
          { label: "Sessions", value: overview.sessions.toLocaleString("fr") },
          { label: "Pages vues", value: overview.pageViews.toLocaleString("fr") },
          {
            label: "Taux de rebond",
            value: `${(overview.bounceRate * 100).toFixed(1)}%`,
          },
          {
            label: "Durée moy. session",
            value: formatDuration(overview.avgSessionDuration),
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              padding: "1rem 1.25rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "var(--color-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </p>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--color-primary)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Graphique visiteurs par jour */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          padding: "1.25rem",
        }}
      >
        <p
          style={{
            margin: "0 0 1rem",
            fontWeight: 600,
            color: "var(--color-dark)",
          }}
        >
          Visiteurs par jour — 28 derniers jours
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={daily.map((d) => ({
              ...d,
              dateLabel: formatDate(d.date),
            }))}
          >
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: "var(--color-muted)" }}
              interval={6}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--color-muted)" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              name="Visiteurs"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              name="Sessions"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Sources de trafic */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            padding: "1.25rem",
          }}
        >
          <p style={{ margin: "0 0 1rem", fontWeight: 600, color: "var(--color-dark)" }}>
            Sources de trafic
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sources} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-muted)" }} />
              <YAxis
                type="category"
                dataKey="channel"
                width={100}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
              />
              <Tooltip />
              <Bar dataKey="sessions" name="Sessions" radius={[0, 4, 4, 0]}>
                {sources.map((_, index) => (
                  <Cell key={index} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pages les plus vues */}
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            padding: "1.25rem",
          }}
        >
          <p style={{ margin: "0 0 1rem", fontWeight: 600, color: "var(--color-dark)" }}>
            Pages les plus vues
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {topPages.map((page, i) => (
              <li
                key={page.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0",
                  borderBottom:
                    i < topPages.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <span
                  style={{
                    minWidth: "1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--color-muted)",
                  }}
                >
                  #{i + 1}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: "0.85rem",
                    color: "var(--color-body)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={page.title}
                >
                  {page.path}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--color-primary)",
                  }}
                >
                  {page.views.toLocaleString("fr")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--color-muted)",
          textAlign: "right",
        }}
      >
        Mis à jour le{" "}
        {new Date(data.generatedAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
