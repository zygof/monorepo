import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Info, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CtaBanner } from '@/components/sections/cta-banner';
import { ServicesCatalog } from '@/components/sections/services-catalog';
import { EventPackageCard } from '@/components/ui/event-package-card';
import { ProductCard } from '@/components/ui/product-card';
import { salonConfig, allServices, eventPackages, beautyProducts } from '@/config/salon.config';
import { getPrimaryCta, hasBooking } from '@/lib/offers';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Services & Tarifs — ${salonConfig.name}`,
  description: `Découvrez tous nos services de coiffure : coupes, colorations, soins, lissage, extensions et forfaits événements. Tarifs transparents pour le salon ${salonConfig.name} à ${salonConfig.contact.city}.`,
  alternates: {
    canonical: `${salonConfig.seo.siteUrl}/services`,
  },
  openGraph: {
    title: `Services & Tarifs — ${salonConfig.name}`,
    description: `Coupe, balayage, lissage, extensions… Des prestations haut de gamme adaptées à toutes les textures de cheveux à ${salonConfig.contact.city}.`,
    url: `${salonConfig.seo.siteUrl}/services`,
    images: [{ url: salonConfig.seo.ogImageUrl, alt: salonConfig.seo.ogImageAlt }],
  },
};

/* ── JSON-LD Structured Data ───────────────────────────────────────────── */

function ServicesJsonLd(): JSX.Element {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Services de ${salonConfig.name}`,
    description: salonConfig.description,
    url: `${salonConfig.seo.siteUrl}/services`,
    itemListElement: allServices.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: service.startingPrice,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: salonConfig.seo.siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services & Tarifs',
        item: `${salonConfig.seo.siteUrl}/services`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
    </>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function ServicesPage(): JSX.Element {
  const { contact } = salonConfig;
  const bookingUrl = getPrimaryCta().href;

  return (
    <>
      <ServicesJsonLd />
      <Header />

      <main id="main-content">
        <div className="mx-auto max-w-7xl px-6 lg:px-14">
          {/* ── Breadcrumb ──────────────────────────── */}
          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center gap-1.5 pt-28 pb-6 text-sm text-text-muted"
          >
            <Link
              href="/"
              className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Accueil
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-text font-medium" aria-current="page">
              Services & Tarifs
            </span>
          </nav>

          {/* ── Hero de la page ─────────────────────── */}
          <header className="mb-6">
            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-text lg:text-5xl">
              Notre Catalogue{' '}
              <span className="bg-primary bg-clip-text text-transparent">de Services</span>
            </h1>
            <p className="text-lg leading-relaxed text-text-subtle">
              Des prestations haut de gamme adaptées à toutes les textures de cheveux. Chaque soin
              est réalisé avec des produits d&apos;exception par nos stylistes experts.
            </p>
          </header>

          {/* ── Bandeau info consultation ────────────── */}
          <div
            className="mb-4 flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 px-5 py-4"
            role="note"
            aria-label="Conseil du salon"
          >
            <Info size={18} className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-text-subtle">
              <span className="font-semibold text-text">Balayage, lissage et extensions :</span>{' '}
              nous recommandons une consultation préalable gratuite afin d&apos;établir le
              diagnostic capillaire adapté à votre texture.{' '}
              <Link
                href={bookingUrl}
                className="font-medium text-secondary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                {hasBooking() ? 'Prendre rendez-vous →' : 'Nous contacter →'}
              </Link>
            </p>
          </div>

          {/* ── Catalogue avec onglets ───────────────── */}
          <ServicesCatalog services={allServices} bookingUrl={bookingUrl} />
        </div>

        {/* ── Forfaits Événements ──────────────────────────────────────── */}
        <section
          id="evenements"
          aria-labelledby="evenements-heading"
          className="bg-primary-light py-20"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-14">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">
                Moments uniques
              </p>
              <h2
                id="evenements-heading"
                className="mb-4 font-serif text-3xl font-bold text-text lg:text-4xl"
              >
                Forfaits Événements
              </h2>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-text-subtle">
                Mariage, cérémonie, shooting photo… Confiez-nous votre coiffure pour les instants
                qui comptent. Nous créons votre look sur mesure.
              </p>
            </div>

            <ul
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Forfaits événements disponibles"
            >
              {eventPackages.map((pkg) => (
                <li key={pkg.id}>
                  <EventPackageCard pkg={pkg} bookingUrl={bookingUrl} className="h-full" />
                </li>
              ))}
            </ul>

            <p className="mt-8 text-center text-sm text-text-muted">
              Des besoins spécifiques ?{' '}
              <Link
                href={`tel:${contact.phoneRaw}`}
                className="font-medium text-primary hover:underline"
              >
                Appelez-nous
              </Link>{' '}
              pour un devis sur mesure.
            </p>
          </div>
        </section>

        {/* ── Produits Beauté ──────────────────────────────────────────── */}
        <section id="produits-beaute" aria-labelledby="produits-heading" className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-14">
            <div className="mb-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-secondary" aria-hidden="true" />
                  <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
                    Boutique capillaire
                  </p>
                </div>
                <h2
                  id="produits-heading"
                  className="font-serif text-3xl font-bold text-text lg:text-4xl"
                >
                  Nos Produits Beauté
                </h2>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-text-subtle">
                  Les produits professionnels que nous utilisons en salon — sélectionnés pour leur
                  efficacité sur les cheveux texturés, crépus et bouclés.
                </p>
              </div>
              <p className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-muted">
                Disponibles en salon à {contact.city}
              </p>
            </div>

            <ul
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Produits beauté disponibles en salon"
            >
              {beautyProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} bookingUrl={bookingUrl} className="h-full" />
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-border bg-surface px-6 py-5">
              <p className="text-sm leading-relaxed text-text-subtle text-center">
                <span className="font-semibold text-text">Conseil professionnel offert</span> — lors
                de votre visite, nos stylistes vous guident dans le choix des produits adaptés à
                votre routine capillaire à domicile.
              </p>
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>

      <Footer />
    </>
  );
}
