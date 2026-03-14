import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Calendar,
  Navigation,
} from 'lucide-react';
import { Button } from '@marrynov/ui';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CtaBanner } from '@/components/sections/cta-banner';
import { ContactForm } from '@/components/sections/contact-form';
import { salonConfig } from '@/config/salon.config';
import { hasBooking, getPrimaryCta } from '@/lib/offers';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Contact — ${salonConfig.name}`,
  description: `Contactez le salon ${salonConfig.name} à ${salonConfig.contact.city}. Adresse, téléphone, horaires d'ouverture et formulaire de contact.`,
  alternates: {
    canonical: `${salonConfig.seo.siteUrl}/contact`,
  },
  openGraph: {
    title: `Contact — ${salonConfig.name}`,
    description: `Retrouvez toutes les informations pour nous joindre : adresse, téléphone, horaires. Salon ${salonConfig.name} à ${salonConfig.contact.city}.`,
    url: `${salonConfig.seo.siteUrl}/contact`,
    images: [{ url: salonConfig.seo.ogImageUrl, alt: salonConfig.seo.ogImageAlt }],
  },
};

/* ── JSON-LD Structured Data ───────────────────────────────────────────── */

function ContactJsonLd(): JSX.Element {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: salonConfig.seo.siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: `${salonConfig.seo.siteUrl}/contact`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
    />
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function ContactPage(): JSX.Element {
  const { contactSection, contact, schedule } = salonConfig;
  const showBooking = hasBooking();
  const cta = getPrimaryCta();

  return (
    <>
      <ContactJsonLd />
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
              Contact
            </span>
          </nav>

          {/* ── Hero de la page ─────────────────────── */}
          <header className="mb-12">
            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-text lg:text-5xl">
              {contactSection.heading.split('-').length > 1 ? (
                contactSection.heading
              ) : (
                <>
                  {contactSection.heading.split(' ').slice(0, 1).join(' ')}{' '}
                  <span className="bg-primary bg-clip-text text-transparent">
                    {contactSection.heading.split(' ').slice(1).join(' ')}
                  </span>
                </>
              )}
            </h1>
            <p className="text-lg leading-relaxed text-text-subtle">{contactSection.description}</p>
          </header>
        </div>

        {/* ── Grille principale : Infos + Formulaire ────────────────── */}
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-14">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* ── Colonne gauche : Informations ────── */}
              <div className="flex flex-col gap-8 lg:col-span-2">
                {/* Coordonnées */}
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                  <h2 className="mb-6 font-serif text-xl font-bold text-text">Nos Coordonnées</h2>
                  <ul className="flex flex-col gap-5">
                    <li className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                        <MapPin size={18} className="text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">Adresse</p>
                        <address className="mt-0.5 text-sm not-italic leading-relaxed text-text-subtle">
                          {contact.address}
                          <br />
                          {contact.postalCode} {contact.city}
                          <br />
                          {contact.region}
                        </address>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                        <Phone size={18} className="text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">Téléphone</p>
                        <a
                          href={`tel:${contact.phoneRaw}`}
                          className="mt-0.5 block text-sm text-text-subtle hover:text-primary transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </li>

                    {contact.email && (
                      <li className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                          <Mail size={18} className="text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">Email</p>
                          <a
                            href={`mailto:${contact.email}`}
                            className="mt-0.5 block text-sm text-text-subtle hover:text-primary transition-colors"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </li>
                    )}

                    {contact.whatsapp && (
                      <li className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                          <MessageCircle size={18} className="text-primary" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">WhatsApp</p>
                          <a
                            href={`https://wa.me/${contact.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 block text-sm text-text-subtle hover:text-primary transition-colors"
                          >
                            Envoyer un message
                          </a>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Horaires */}
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                  <div className="mb-6 flex items-center gap-2">
                    <Clock size={18} className="text-primary" aria-hidden="true" />
                    <h2 className="font-serif text-xl font-bold text-text">
                      Horaires d&apos;ouverture
                    </h2>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {Object.entries(schedule).map(([day, hours]) => (
                      <li
                        key={day}
                        className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-sm font-medium text-text">{day}</span>
                        <span
                          className={
                            hours
                              ? 'rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-text-subtle'
                              : 'rounded-full bg-background px-3 py-1 text-xs font-medium text-text-muted'
                          }
                        >
                          {hours ?? 'Fermé'}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {showBooking && (
                    <Button asChild variant="default" size="sm" className="mt-6 w-full rounded-xl">
                      <Link href={cta.href}>
                        <Calendar size={14} aria-hidden="true" />
                        Prendre rendez-vous
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* ── Colonne droite : Formulaire ──────── */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-card lg:col-span-3 lg:p-8">
                <ContactForm
                  heading={contactSection.formHeading}
                  description={contactSection.formDescription}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Google Maps ─────────────────────────────────────────────── */}
        <section aria-labelledby="map-heading" className="bg-primary-light py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-14">
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Navigation size={18} className="text-secondary" aria-hidden="true" />
                  <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
                    Nous trouver
                  </p>
                </div>
                <h2
                  id="map-heading"
                  className="font-serif text-3xl font-bold text-text lg:text-4xl"
                >
                  Comment venir au salon
                </h2>
              </div>
              <p className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-muted">
                {contact.address}, {contact.postalCode} {contact.city}
              </p>
            </div>

            {/* Carte */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <iframe
                src={contactSection.mapEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Plan d'accès — ${salonConfig.name}`}
                className="w-full"
              />
            </div>

            {/* Info accès */}
            <div className="mt-6 rounded-2xl border border-border bg-surface px-6 py-5">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-text-subtle">
                  <span className="font-semibold text-text">Accès & Parking</span> —{' '}
                  {contactSection.accessInfo}
                </p>
              </div>
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>

      <Footer />
    </>
  );
}
