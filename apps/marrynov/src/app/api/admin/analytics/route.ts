import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/analytics
 *
 * Retourne les métriques GA4 des 30 derniers jours via la GA4 Data API.
 * Auth : compte de service Google Cloud (variables d'env server-side).
 *
 * Mettre en place côté Google Cloud :
 * 1. Créer un compte de service dans Google Cloud Console
 * 2. Lui donner le rôle "Viewer" sur la propriété GA4
 * 3. Télécharger le fichier JSON de clé
 * 4. Ajouter GA4_SERVICE_ACCOUNT_KEY (JSON stringifié) dans .env
 * 5. Ajouter GA4_PROPERTY_ID (format "properties/XXXXXXXXX") dans .env
 */

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SERVICE_ACCOUNT_KEY = process.env.GA4_SERVICE_ACCOUNT_KEY;

// Revalidation quotidienne — pas besoin de temps réel
export const revalidate = 86400; // 24h

function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (!SERVICE_ACCOUNT_KEY) {
    throw new Error("GA4_SERVICE_ACCOUNT_KEY manquant");
  }
  const credentials = JSON.parse(SERVICE_ACCOUNT_KEY) as Record<string, string>;
  return new BetaAnalyticsDataClient({ credentials });
}

export async function GET() {
  if (!PROPERTY_ID || !SERVICE_ACCOUNT_KEY) {
    return NextResponse.json({ error: "GA4 non configuré" }, { status: 503 });
  }

  try {
    const client = getAnalyticsClient();

    // Rapport 1 : métriques globales (28 derniers jours)
    const [overviewReport] = await client.runReport({
      property: PROPERTY_ID,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    });

    // Rapport 2 : visiteurs par jour (28 derniers jours) — pour le graphique
    const [dailyReport] = await client.runReport({
      property: PROPERTY_ID,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    });

    // Rapport 3 : sources de trafic
    const [sourceReport] = await client.runReport({
      property: PROPERTY_ID,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 6,
    });

    // Rapport 4 : pages les plus vues
    const [pagesReport] = await client.runReport({
      property: PROPERTY_ID,
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 5,
    });

    // --- Transformation des données ---

    const overviewRow = overviewReport.rows?.[0];
    const overview = {
      activeUsers: Number(overviewRow?.metricValues?.[0]?.value ?? 0),
      sessions: Number(overviewRow?.metricValues?.[1]?.value ?? 0),
      pageViews: Number(overviewRow?.metricValues?.[2]?.value ?? 0),
      bounceRate: Number(overviewRow?.metricValues?.[3]?.value ?? 0),
      avgSessionDuration: Number(overviewRow?.metricValues?.[4]?.value ?? 0),
    };

    const daily = (dailyReport.rows ?? []).map((row) => ({
      date: row.dimensionValues?.[0]?.value ?? "",
      users: Number(row.metricValues?.[0]?.value ?? 0),
      sessions: Number(row.metricValues?.[1]?.value ?? 0),
    }));

    const sources = (sourceReport.rows ?? []).map((row) => ({
      channel: row.dimensionValues?.[0]?.value ?? "Autre",
      sessions: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    const topPages = (pagesReport.rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "",
      title: row.dimensionValues?.[1]?.value ?? "",
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    return NextResponse.json({
      period: "28 derniers jours",
      generatedAt: new Date().toISOString(),
      overview,
      daily,
      sources,
      topPages,
    });
  } catch (err) {
    console.error("[GA4 API]", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données GA4" },
      { status: 500 },
    );
  }
}
