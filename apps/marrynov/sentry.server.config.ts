import * as Sentry from "@sentry/nextjs";
import { sentryBeforeSend } from "@marrynov/monitoring/sentry";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
  beforeSend: sentryBeforeSend,
  // tracesSampler remplace tracesSampleRate — les deux ensemble = tracesSampleRate ignoré
  tracesSampler: (samplingContext) => {
    const url = samplingContext.request?.url ?? "";
    // 100% des traces sur les routes de paiement/réservation
    if (url.includes("/api/checkout") || url.includes("/api/reservation")) {
      return 1.0;
    }
    return 0.1;
  },
});
