import type { ReactNode, JSX } from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { GtmProvider, GtmNoScript } from '@marrynov/monitoring/gtm';
import { ConsentBanner } from '@marrynov/monitoring/consent-banner';
import { salonConfig, featuredServices } from '@/config/salon.config';
import { Providers } from '@/components/providers';
import './globals.css';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

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

/** JSON-LD — BeautySalon schema enrichi pour les moteurs de recherche */
function buildJsonLd() {
  const { name, description, contact, stats, seo, schedule } = salonConfig;

  // Convertir les horaires en OpeningHoursSpecification
  const dayMap: Record<string, string[]> = {
    Lundi: ['Monday'],
    Mardi: ['Tuesday'],
    Mercredi: ['Wednesday'],
    Jeudi: ['Thursday'],
    Vendredi: ['Friday'],
    Samedi: ['Saturday'],
    Dimanche: ['Sunday'],
    'Mardi - Vendredi': ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    'Lundi - Vendredi': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  };

  const openingHours = Object.entries(schedule)
    .filter(([, hours]) => hours !== null)
    .flatMap(([day, hours]) => {
      const days = dayMap[day] ?? [];
      const [opens, closes] = (hours as string).split(' - ').map((t) => t.trim());
      return days.map((d) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: d,
        opens,
        closes,
      }));
    });

  // Services proposés (featured)
  const offeredServices = featuredServices.map((s) => ({
    '@type': 'Service',
    name: s.name,
    description: s.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: s.startingPrice.toString(),
    },
  }));

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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-20.8823',
      longitude: '55.4504',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: stats.rating.toString(),
      reviewCount: stats.reviewCount.toString(),
      bestRating: '5',
    },
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card',
    openingHoursSpecification: openingHours,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Nos prestations',
      itemListElement: offeredServices,
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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {GTM_ID && <GtmProvider gtmId={GTM_ID} />}
      </head>
      <body>
        {GTM_ID && <GtmNoScript gtmId={GTM_ID} />}
        <Providers>
          {/* Skip link — accessibilité clavier */}
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:rounded-lg focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Aller au contenu principal
          </a>
          {children}
        </Providers>
        <ConsentBanner />
      </body>
    </html>
  );
}
