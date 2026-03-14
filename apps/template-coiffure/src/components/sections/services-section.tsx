import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceCard } from '@/components/ui/service-card';
import { SectionHeader } from '@/components/ui/section-header';
import { salonConfig, featuredServices } from '@/config/salon.config';
import { getPrimaryCta } from '@/lib/offers';

/**
 * Section Services — 3 cartes services signatures.
 * Les CTAs des cartes s'adaptent au tier (réservation ou contact).
 */
export function ServicesSection(): JSX.Element {
  const { servicesUrl, servicesSection } = salonConfig;
  const cta = getPrimaryCta();

  return (
    <section
      id="services"
      className="bg-background py-24 px-6 lg:px-14"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="services-heading"
          heading={servicesSection.heading}
          description={servicesSection.description}
        />

        {/* Grille des 3 services */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} bookingUrl={cta.href} />
          ))}
        </div>

        {/* Lien "Voir tous les tarifs" */}
        <div className="mt-12 flex justify-center">
          <Link
            href={servicesUrl}
            className="inline-flex items-center gap-2 text-base font-medium text-primary transition-all hover:gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {servicesSection.viewAllLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
