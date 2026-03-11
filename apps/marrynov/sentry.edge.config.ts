import * as Sentry from "@sentry/nextjs";
import { sentryBeforeSend } from "@marrynov/monitoring/sentry";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
  beforeSend: sentryBeforeSend,
  tracesSampleRate: 0.1,
});
