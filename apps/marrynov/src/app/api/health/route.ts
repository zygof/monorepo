import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Endpoint de healthcheck pour Uptime Kuma.
 * Retourne 200 si l'app répond correctement.
 *
 * À configurer dans Uptime Kuma :
 * - Type : HTTP(s)
 * - URL : https://marrynov.re/api/health
 * - Intervalle : 60s
 * - Keyword attendu : "ok"
 */
export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "marrynov-site",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        // Pas de cache — Uptime Kuma doit toujours avoir une réponse fraîche
        "Cache-Control": "no-store",
      },
    },
  );
}
