import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Layers, ArrowRight, Calendar, Phone } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { TrustBadgePill } from '@/components/ui/trust-badge-pill';
import { salonConfig } from '@/config/salon.config';
import { hasBooking, getPrimaryCta } from '@/lib/offers';

/**
 * Hero Section — première section visible au chargement.
 * S'adapte au tier MARRYNOV :
 * - Standard : CTA → contact/téléphone, pas de bandeau urgence
 * - Expert+  : CTA → réservation, bandeau d'urgence disponibilités
 */
export function HeroSection(): JSX.Element {
  const { stats, servicesUrl, hero, contact } = salonConfig;
  const showBooking = hasBooking();
  const cta = getPrimaryCta();

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-background pt-20"
      aria-label="Présentation du salon"
    >
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.imageSrc}
          alt={hero.imageAlt}
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'var(--gradient-hero-overlay)' }}
          aria-hidden="true"
        />
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-14">
          <div className="max-w-3xl">
            {/* Trust badge pills */}
            <ul
              className="mb-8 flex flex-wrap items-center gap-3 list-none p-0 m-0"
              aria-label="Certifications du salon"
            >
              <li>
                <TrustBadgePill
                  icon={
                    <span className="flex items-center" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className="fill-secondary text-secondary" />
                      ))}
                    </span>
                  }
                  label={`${stats.rating}/5 (${stats.reviewCount} avis)`}
                />
              </li>
              <li>
                <TrustBadgePill
                  icon={<Clock size={14} aria-hidden="true" />}
                  label={`Depuis ${stats.yearsOpen} ans`}
                />
              </li>
              <li>
                <TrustBadgePill
                  icon={<Layers size={14} aria-hidden="true" />}
                  label={stats.speciality}
                />
              </li>
            </ul>

            {/* Heading H1 */}
            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-text lg:text-6xl">
              {hero.headingPart1}{' '}
              <span className="bg-linear-to-r from-primary-rose to-secondary bg-clip-text text-transparent">
                {hero.headingGradient}
              </span>
              {hero.headingPart2 && (
                <>
                  <br />
                  {hero.headingPart2}
                </>
              )}
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-text-subtle">
              {hero.description}
            </p>

            {/* CTAs */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button
                asChild
                variant="default"
                size="pill"
                className="w-full shadow-primary-glow hover:bg-primary-dark sm:w-auto"
              >
                <Link href={cta.href}>
                  {showBooking ? hero.ctaPrimary : cta.label}
                  {showBooking ? (
                    <Calendar size={16} aria-hidden="true" />
                  ) : (
                    <Phone size={16} aria-hidden="true" />
                  )}
                </Link>
              </Button>

              <Button asChild variant="outline" size="pill" className="w-full sm:w-auto">
                <Link href={servicesUrl}>{hero.ctaSecondary}</Link>
              </Button>
            </div>

            {/* Bandeau urgence — Expert+ uniquement */}
            {showBooking && (
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2 shadow-pill"
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true">⏰</span>
                <p className="text-sm">
                  <span className="font-semibold text-primary">{hero.urgencyMessage}</span>
                  <span className="text-text-subtle"> {hero.urgencyDate} — </span>
                  <Link
                    href="/reserver"
                    className="font-medium text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    {hero.urgencyCta}
                  </Link>
                </p>
                <ArrowRight size={14} className="text-secondary" aria-hidden="true" />
              </div>
            )}

            {/* Bandeau contact — Standard uniquement */}
            {!showBooking && (
              <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2 shadow-pill">
                <Phone size={14} className="text-primary" aria-hidden="true" />
                <p className="text-sm">
                  <span className="text-text-subtle">Appelez-nous au </span>
                  <a
                    href={`tel:${contact.phoneRaw}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {contact.phone}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
