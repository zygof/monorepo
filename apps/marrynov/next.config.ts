import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone", // requis pour le Dockerfile multi-stage
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  // Transpiler les packages du monorepo qui ne sont pas compilés
  transpilePackages: ["@marrynov/monitoring"],
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Release = SHA du commit (injecté par CI/CD via GITHUB_SHA)
  // Permet de lier chaque erreur Sentry au déploiement exact
  release: process.env.GITHUB_SHA ? { name: process.env.GITHUB_SHA } : undefined,
  // Pas d'upload de sourcemaps en local (CI only)
  sourcemaps: {
    disable: process.env.NODE_ENV !== "production",
  },
  // Pas de telemetrie Sentry
  telemetry: false,
  // Pas d'overlay d'erreur Sentry en dev (on garde Next.js natif)
  disableLogger: true,
});
