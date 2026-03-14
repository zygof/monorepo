import type { JSX } from 'react';
import Link from 'next/link';
import { Button } from '@marrynov/ui';
import { salonConfig } from '@/config/salon.config';
import { hasBooking, getPrimaryCta } from '@/lib/offers';

/**
 * Bandeau CTA — fond primary, titre, description, bouton gold.
 * Standard : incite au contact. Expert+ : incite à la réservation.
 */
export function CtaBanner(): JSX.Element {
  const { ctaBanner } = salonConfig;
  const showBooking = hasBooking();
  const cta = getPrimaryCta();

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
          {showBooking ? ctaBanner.heading : 'Envie d\u2019un nouveau look\u00a0?'}
        </h2>

        <p className="max-w-2xl text-lg leading-relaxed text-white/80">
          {showBooking
            ? ctaBanner.description
            : 'Contactez-nous pour discuter de vos envies et prendre rendez-vous par téléphone.'}
        </p>

        <Button
          asChild
          variant="secondary"
          size="pill"
          className="shadow-lg hover:bg-secondary-dark hover:shadow-xl focus-visible:outline-white"
        >
          <Link href={cta.href}>{showBooking ? ctaBanner.buttonLabel : 'Nous Contacter'}</Link>
        </Button>
      </div>
    </section>
  );
}
