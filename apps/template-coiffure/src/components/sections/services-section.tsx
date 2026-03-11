import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ServiceCard } from '@/components/ui/service-card';
import { salonConfig, featuredServices } from '@/config/salon.config';

/**
 * Section Services — 3 cartes services signatures.
 *
 * TODO (backend) : remplacer featuredServices par un fetch
 *   const services = await fetch('/api/services?featured=true&limit=3').then(r => r.json())
 */
export function ServicesSection(): JSX.Element {
  const { bookingUrl, servicesUrl, servicesSection } = salonConfig;

  return (
    <section
      id="services"
      className="bg-background py-24 px-6 lg:px-14"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* En-tête de section */}
        <div className="mb-16 text-center">
          <h2 id="services-heading" className="mb-4 font-serif text-4xl font-bold text-primary">
            {servicesSection.heading}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-subtle">
            {servicesSection.description}
          </p>
        </div>

        {/* Grille des 3 services */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} bookingUrl={bookingUrl} />
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
