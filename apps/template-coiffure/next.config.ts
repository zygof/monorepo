import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
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
    // Qualités déclarées explicitement — requis à partir de Next.js 16
    qualities: [75, 80, 90],
    remotePatterns: [
      // Figma assets (dev uniquement, expirent après 7 jours)
      {
        protocol: 'https',
        hostname: 'www.figma.com',
      },
      // Placeholders de développement
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Transpiler les packages du monorepo (TypeScript source, non compilés)
  transpilePackages: ['@marrynov/ui', '@marrynov/design-tokens'],
};

export default nextConfig;
