import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone", // requis pour le Dockerfile multi-stage
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Turbopack : indiquer la racine du monorepo pour la résolution des modules
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Pas d'upload de sourcemaps en local (CI only)
  sourcemaps: {
    disable: process.env.NODE_ENV !== "production",
  },
  // Pas de telemetrie Sentry
  telemetry: false,
  // Pas d'overlay d'erreur Sentry en dev (on garde Next.js natif)
  disableLogger: true,
});
