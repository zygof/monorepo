import * as Sentry from '@sentry/nextjs';
import { sentryBeforeSend } from '@marrynov/monitoring/sentry';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  beforeSend: sentryBeforeSend,
  // Replay — 1% des sessions, 100% sur erreur
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      // Masquer les champs sensibles (formulaires, données perso, CB)
      maskAllInputs: true,
      blockAllMedia: false,
    }),
  ],
});
