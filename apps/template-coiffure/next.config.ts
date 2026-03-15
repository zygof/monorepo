import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      // Scripts : self + GTM + GA4 + Stripe + Sentry + nonce inline
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://*.sentry.io",
      // Styles : self + inline (Tailwind, Stripe Elements)
      "style-src 'self' 'unsafe-inline'",
      // Images : self + data URIs + Google + placeholders dev
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://placehold.co https://picsum.photos",
      // Fonts : self + Google Fonts CDN
      "font-src 'self'",
      // Connexions API : self + GTM + GA4 + Stripe + Sentry
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://api.stripe.com https://*.sentry.io https://*.ingest.sentry.io",
      // Frames : Stripe 3DS + Google Maps
      'frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com https://maps.google.com',
      // Workers : Sentry replay
      "worker-src 'self' blob:",
    ];

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; '),
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
        // HSTS uniquement en production (pas en dev HTTP)
        ...(process.env.NODE_ENV === 'production'
          ? {}
          : { missing: [{ type: 'header' as const, key: 'x-dev-bypass' }] }),
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'www.figma.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  transpilePackages: ['@marrynov/ui', '@marrynov/design-tokens', '@marrynov/monitoring'],
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  release: process.env.GITHUB_SHA ? { name: process.env.GITHUB_SHA } : undefined,
  sourcemaps: {
    disable: process.env.NODE_ENV !== 'production',
  },
  telemetry: false,
  disableLogger: true,
});
