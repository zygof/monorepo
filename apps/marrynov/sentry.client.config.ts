import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Désactivé en développement
  enabled: process.env.NODE_ENV === "production",
  // Traces de performance — 10% en prod pour commencer
  tracesSampleRate: 0.1,
  // Replay — 1% des sessions, 100% sur erreur
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
});
