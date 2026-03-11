import type { ReactNode, JSX } from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { salonConfig } from '@/config/salon.config';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(salonConfig.seo.siteUrl),
  title: {
    template: `%s | ${salonConfig.name}`,
    default: `${salonConfig.name} — Salon de Coiffure Afro-Créole à La Réunion`,
  },
  description: salonConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: salonConfig.name,
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: salonConfig.seo.ogImageUrl,
        width: 1200,
        height: 630,
        alt: salonConfig.seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [salonConfig.seo.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** JSON-LD — BeautySalon schema pour les moteurs de recherche */
function buildJsonLd() {
  const { name, description, contact, stats, seo } = salonConfig;
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name,
    description,
    url: seo.siteUrl,
    telephone: contact.phone,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      addressLocality: contact.city,
      postalCode: contact.postalCode,
      addressRegion: contact.region,
      addressCountry: 'FR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: stats.rating.toString(),
      reviewCount: stats.reviewCount.toString(),
      bestRating: '5',
    },
    sameAs: [contact.instagram, contact.facebook, contact.tiktok].filter(Boolean),
    image: `${seo.siteUrl}${seo.ogImageUrl}`,
  };
}

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
      </head>
      <body>
        {/* Skip link — accessibilité clavier */}
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:rounded-lg focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  );
}
