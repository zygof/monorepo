import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Badge, cn } from '@marrynov/ui';
import type { Service } from '@/types/salon';

interface ServiceCardProps {
  service: Service;
  bookingUrl: string;
  className?: string;
}

/**
 * Carte service — utilisée dans la section Services de l'accueil.
 *
 * Deux variantes visuelles :
 *  - Standard  : fond blanc, bordure primary au survol, CTA outline
 *  - Featured  : bordure gold (secondary), Badge "Le plus demandé", CTA filled
 *
 * Backend-ready : reçoit un objet Service typé (même interface que l'API).
 * Design system : utilise Button et Badge de @marrynov/ui.
 */
export function ServiceCard({ service, bookingUrl, className }: ServiceCardProps): JSX.Element {
  const { name, description, startingPrice, imageUrl, imageAlt, featured, badge } = service;
  const headingId = `service-${service.id}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        'relative flex flex-col rounded-2xl bg-surface',
        'shadow-card transition-shadow duration-300 hover:shadow-card-hover',
        featured ? 'border-2 border-secondary' : 'border border-transparent',
        className,
      )}
    >
      {/* Badge "Le plus demandé" */}
      {badge && (
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Badge
            variant="secondary"
            className="px-4 py-1 text-xs uppercase tracking-wider rounded-full"
          >
            {badge}
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={80}
        />
        {/* Badge prix */}
        <div className="absolute right-4 top-4 z-10">
          <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold backdrop-blur-sm text-primary">
            À partir de {startingPrice}€
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-6">
        <h3 id={headingId} className="mb-2 text-xl font-bold text-text">
          {name}
        </h3>
        <p className="mb-6 flex-1 text-base leading-relaxed text-text-subtle">{description}</p>

        {/* CTA */}
        <Button
          asChild
          variant={featured ? 'default' : 'outline'}
          size="pill"
          className={cn(
            'w-full',
            featured
              ? 'hover:bg-primary-dark'
              : 'border-2 border-primary text-primary hover:bg-primary-light',
          )}
        >
          <Link href={bookingUrl}>Réserver</Link>
        </Button>
      </div>
    </article>
  );
}
