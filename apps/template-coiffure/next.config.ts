import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
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
