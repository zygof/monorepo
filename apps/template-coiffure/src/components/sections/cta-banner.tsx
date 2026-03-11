import type { JSX } from 'react';
import Link from 'next/link';
import { salonConfig } from '@/config/salon.config';

/**
 * Bandeau CTA — fond primary, titre, description, bouton gold.
 * Incite à la prise de rendez-vous.
 *
 * TODO : A/B tester le texte du bouton et le message d'urgence.
 */
export function CtaBanner(): JSX.Element {
  const { bookingUrl, ctaBanner } = salonConfig;

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-primary py-20 px-6 lg:px-14"
      aria-labelledby="cta-heading"
    >
      {/* Texture de fond subtile */}
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 id="cta-heading" className="font-serif text-4xl font-bold text-white">
          {ctaBanner.heading}
        </h2>

        <p className="max-w-2xl text-lg leading-relaxed text-white/80">{ctaBanner.description}</p>

        <Link
          href={bookingUrl}
          className="inline-flex items-center justify-center rounded-full bg-secondary px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-secondary-dark hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {ctaBanner.buttonLabel}
        </Link>
      </div>
    </section>
  );
}
