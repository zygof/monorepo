import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Award, Quote, Calendar, Instagram } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CtaBanner } from '@/components/sections/cta-banner';
import { salonConfig, teamMembers } from '@/config/salon.config';
import { hasBooking, getPrimaryCta } from '@/lib/offers';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Notre Équipe — ${salonConfig.name}`,
  description: `Découvrez l'équipe de stylistes experts du salon ${salonConfig.name} à ${salonConfig.contact.city}. Des artistes passionnés dédiés à sublimer toutes les textures de cheveux.`,
  alternates: {
    canonical: `${salonConfig.seo.siteUrl}/equipe`,
  },
  openGraph: {
    title: `Notre Équipe — ${salonConfig.name}`,
    description: `Rencontrez les stylistes du salon ${salonConfig.name}. Expertise Afro-Créole, passion et savoir-faire à ${salonConfig.contact.city}.`,
    url: `${salonConfig.seo.siteUrl}/equipe`,
    images: [{ url: salonConfig.seo.ogImageUrl, alt: salonConfig.seo.ogImageAlt }],
  },
};

/* ── JSON-LD Structured Data ───────────────────────────────────────────── */

function TeamJsonLd(): JSX.Element {
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: salonConfig.seo.siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Notre Équipe',
        item: `${salonConfig.seo.siteUrl}/equipe`,
      },
    ],
  };

  const persons = teamMembers.map((member) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    worksFor: {
      '@type': 'BeautySalon',
      name: salonConfig.name,
    },
    ...(member.instagram ? { sameAs: [member.instagram] } : {}),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      {persons.map((person, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      ))}
    </>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function EquipePage(): JSX.Element {
  const { teamSection } = salonConfig;
  const showBooking = hasBooking();
  const cta = getPrimaryCta();

  return (
    <>
      <TeamJsonLd />
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
              Notre Équipe
            </span>
          </nav>

          {/* ── Hero de la page ─────────────────────── */}
          <header className="mb-16">
            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-text lg:text-5xl">
              {teamSection.heading.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="bg-primary bg-clip-text text-transparent">
                {teamSection.heading.split(' ').slice(-2).join(' ')}
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-text-subtle">{teamSection.description}</p>
          </header>
        </div>

        {/* ── Équipe — Cartes membres ──────────────────────────────────── */}
        <section aria-labelledby="team-heading" className="pb-20">
          <h2 id="team-heading" className="sr-only">
            Membres de l&apos;équipe
          </h2>

          <div className="mx-auto max-w-7xl px-6 lg:px-14">
            <ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-3" aria-label="Nos stylistes">
              {teamMembers.map((member) => (
                <li key={member.id}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover">
                    {/* Photo */}
                    <div className="relative aspect-square overflow-hidden bg-primary-light">
                      <Image
                        src={member.imageUrl}
                        alt={`${member.name} — ${member.role}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Overlay gradient bas */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-1/3"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
                        }}
                        aria-hidden="true"
                      />
                      {/* Badge expérience */}
                      {member.yearsExperience && (
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-text backdrop-blur-sm">
                          <Award size={14} className="text-secondary" aria-hidden="true" />
                          {member.yearsExperience} ans d&apos;exp.
                        </span>
                      )}
                      {/* Lien Instagram */}
                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Instagram de ${member.name}`}
                          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text-subtle backdrop-blur-sm transition-colors hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          <Instagram size={16} aria-hidden="true" />
                        </a>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-text">{member.name}</h3>
                        <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                      </div>

                      <p className="flex-1 text-sm leading-relaxed text-text-subtle">
                        {member.bio}
                      </p>

                      {/* Citation */}
                      {member.quote && (
                        <blockquote className="flex items-start gap-2.5 rounded-xl bg-primary-light/60 px-4 py-3">
                          <Quote
                            size={16}
                            className="mt-0.5 shrink-0 text-primary/40"
                            aria-hidden="true"
                          />
                          <p className="text-sm italic leading-relaxed text-text-subtle">
                            &laquo;&nbsp;{member.quote}&nbsp;&raquo;
                          </p>
                        </blockquote>
                      )}

                      {/* Spécialités */}
                      <ul
                        className="flex flex-wrap gap-2"
                        aria-label={`Spécialités de ${member.name}`}
                      >
                        {member.specialities.map((spec) => (
                          <li
                            key={spec}
                            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-text-subtle"
                          >
                            {spec}
                          </li>
                        ))}
                      </ul>

                      {/* CTA — Réserver (Expert+) ou Contacter (Standard) */}
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="mt-auto w-full rounded-xl"
                      >
                        <Link href={`${cta.href}?stylist=${member.id}`}>
                          <Calendar size={14} aria-hidden="true" />
                          {showBooking
                            ? `Réserver avec ${member.name.split(' ')[0]}`
                            : `Contacter ${member.name.split(' ')[0]}`}
                        </Link>
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Nos Valeurs ──────────────────────────────────────────────── */}
        <section id="valeurs" aria-labelledby="valeurs-heading" className="bg-primary-light py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-14">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-secondary">
                Ce qui nous anime
              </p>
              <h2
                id="valeurs-heading"
                className="mb-4 font-serif text-3xl font-bold text-text lg:text-4xl"
              >
                {teamSection.valuesHeading}
              </h2>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-text-subtle">
                {teamSection.valuesDescription}
              </p>
            </div>

            <ul className="grid gap-8 md:grid-cols-3" aria-label="Nos valeurs">
              {teamSection.values.map((value, index) => (
                <li key={index}>
                  <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-serif text-lg font-bold text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-text">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-text-subtle">{value.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Rejoindre l'équipe ───────────────────────────────────────── */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-14">
            <h2 className="mb-4 font-serif text-3xl font-bold text-text lg:text-4xl">
              Envie de rejoindre l&apos;aventure&nbsp;?
            </h2>
            <p className="mb-8 text-base leading-relaxed text-text-subtle">
              Nous sommes toujours à la recherche de talents passionnés par la coiffure et les
              cheveux texturés. Si vous partagez nos valeurs et souhaitez évoluer dans un
              environnement bienveillant et stimulant, contactez-nous.
            </p>
            <Button asChild variant="outline" size="pill">
              <a
                href={`mailto:${salonConfig.contact.email}?subject=Candidature — ${salonConfig.name}`}
              >
                Envoyer ma candidature
              </a>
            </Button>
          </div>
        </section>

        <CtaBanner />
      </main>

      <Footer />
    </>
  );
}
