import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Camera } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CtaBanner } from '@/components/sections/cta-banner';
import { GalleryGrid } from '@/components/sections/gallery-grid';
import { salonConfig, galleryItems } from '@/config/salon.config';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Galerie — ${salonConfig.name}`,
  description: `Découvrez les réalisations du salon ${salonConfig.name} à ${salonConfig.contact.city}. Balayages, coupes, extensions, lissages, coiffures de mariage et soins capillaires en images.`,
  alternates: {
    canonical: `${salonConfig.seo.siteUrl}/galerie`,
  },
  openGraph: {
    title: `Galerie — ${salonConfig.name}`,
    description: `Les plus belles réalisations du salon ${salonConfig.name}. Transformations, couleurs, coiffures protectrices et looks de mariage.`,
    url: `${salonConfig.seo.siteUrl}/galerie`,
    images: [{ url: salonConfig.seo.ogImageUrl, alt: salonConfig.seo.ogImageAlt }],
  },
};

/* ── JSON-LD Structured Data ───────────────────────────────────────────── */

function GalleryJsonLd(): JSX.Element {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: salonConfig.seo.siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Galerie',
        item: `${salonConfig.seo.siteUrl}/galerie`,
      },
    ],
  };

  const imageGallery = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `Galerie — ${salonConfig.name}`,
    description: salonConfig.gallerySection.description,
    url: `${salonConfig.seo.siteUrl}/galerie`,
    about: {
      '@type': 'BeautySalon',
      name: salonConfig.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallery) }}
      />
    </>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function GaleriePage(): JSX.Element {
  const { gallerySection, contact } = salonConfig;

  return (
    <>
      <GalleryJsonLd />
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
              Galerie
            </span>
          </nav>

          {/* ── Hero de la page ─────────────────────── */}
          <header className="mb-12">
            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-text lg:text-5xl">
              {gallerySection.heading.split(' ').slice(0, 1).join(' ')}{' '}
              <span className="bg-primary bg-clip-text text-transparent">
                {gallerySection.heading.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-text-subtle">{gallerySection.description}</p>
          </header>

          {/* ── Grille galerie avec filtres ─────────── */}
          <GalleryGrid items={galleryItems} />
        </div>

        {/* ── Séparateur ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 lg:px-14 pt-20 lg:pt-14">
          <hr className="border-border" />
        </div>

        {/* ── Section Instagram ──────────────────────────────────────── */}
        {contact.instagram && (
          <section className="py-20">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center lg:px-14">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <Camera size={24} className="text-primary" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-text lg:text-4xl">
                Suivez-nous sur Instagram
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-text-subtle">
                Retrouvez nos dernières réalisations, les coulisses du salon et l&apos;inspiration
                au quotidien. Identifiez-nous sur vos photos avec{' '}
                <span className="font-semibold text-primary">#BeautéCréole</span>
              </p>
              <Button asChild variant="outline" size="pill">
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Voir notre Instagram
                </a>
              </Button>
            </div>
          </section>
        )}

        <CtaBanner />
      </main>

      <Footer />
    </>
  );
}
