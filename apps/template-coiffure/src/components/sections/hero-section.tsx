import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Layers, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { TrustBadgePill } from '@/components/ui/trust-badge-pill';
import { salonConfig } from '@/config/salon.config';

/**
 * Hero Section — première section visible au chargement.
 *
 * Composition :
 *  - Image full-bleed avec dégradé blanc gauche
 *  - Trust badge pills (note, ancienneté, spécialité)
 *  - H1 avec dégradé coloré sur la 2ème ligne
 *  - Deux CTAs via Button asChild (pas de <a> dans <button>)
 *  - Bandeau d'urgence (disponibilités)
 *
 * TODO : le bandeau d'urgence doit être dynamique (API disponibilités)
 * TODO : image hero à remplacer par asset validé en production
 */
export function HeroSection(): JSX.Element {
  const { stats, bookingUrl, servicesUrl, hero } = salonConfig;

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
                <Link href={bookingUrl}>
                  {hero.ctaPrimary}
                  <Calendar size={16} aria-hidden="true" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="pill" className="w-full sm:w-auto">
                <Link href={servicesUrl}>{hero.ctaSecondary}</Link>
              </Button>
            </div>

            {/* Bandeau urgence — TODO: rendre dynamique via API disponibilités */}
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
                  href={bookingUrl}
                  className="font-medium text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  {hero.urgencyCta}
                </Link>
              </p>
              <ArrowRight size={14} className="text-secondary" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
