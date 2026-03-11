import type { JSX } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button, Badge, cn } from '@marrynov/ui';
import type { EventPackage } from '@/types/salon';

interface EventPackageCardProps {
  pkg: EventPackage;
  bookingUrl: string;
  className?: string;
}

/**
 * Carte forfait événement — utilisée dans la section Forfaits Événements de la page services.
 *
 * Variante featured : fond gold (secondary), bordure accentuée, CTA filled.
 * Variante standard : fond surface, bordure subtile.
 */
export function EventPackageCard({
  pkg,
  bookingUrl,
  className,
}: EventPackageCardProps): JSX.Element {
  const { name, description, price, features, featured, badge } = pkg;
  const headingId = `pkg-${pkg.id}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        'relative flex flex-col rounded-2xl p-8',
        'transition-shadow duration-300',
        featured
          ? 'bg-secondary text-white shadow-[0_8px_30px_0_rgba(201,168,76,0.35)]'
          : 'bg-surface border border-border shadow-card hover:shadow-card-hover',
        className,
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            variant={featured ? 'default' : 'secondary'}
            className="px-4 py-1 text-xs uppercase tracking-wider rounded-full shadow-sm"
          >
            {badge}
          </Badge>
        </div>
      )}

      {/* Prix */}
      <div className="mb-4 flex items-baseline gap-1">
        <span
          className={cn('text-4xl font-bold font-serif', featured ? 'text-white' : 'text-text')}
        >
          {price}€
        </span>
        <span className={cn('text-sm', featured ? 'text-white/80' : 'text-text-muted')}>
          / prestation
        </span>
      </div>

      {/* Nom & description */}
      <h3
        id={headingId}
        className={cn('mb-2 text-xl font-bold', featured ? 'text-white' : 'text-text')}
      >
        {name}
      </h3>
      <p
        className={cn(
          'mb-6 text-sm leading-relaxed',
          featured ? 'text-white/80' : 'text-text-subtle',
        )}
      >
        {description}
      </p>

      {/* Features */}
      <ul
        className="mb-8 flex flex-1 flex-col gap-3"
        aria-label={`Prestations incluses dans ${name}`}
      >
        {features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-3">
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                featured ? 'bg-white/20' : 'bg-secondary/10',
              )}
              aria-hidden="true"
            >
              <Check size={12} className={cn(featured ? 'text-white' : 'text-secondary')} />
            </span>
            <span
              className={cn(
                'text-sm leading-snug',
                featured ? 'text-white/90' : 'text-text-subtle',
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        asChild
        variant={featured ? 'outline' : 'secondary'}
        size="pill"
        className={cn(
          'w-full',
          featured
            ? 'border-transparent text-secondary hover:bg-secondary-light hover:text-secondary'
            : 'hover:bg-secondary-dark',
        )}
      >
        <Link href={bookingUrl}>Réserver ce forfait</Link>
      </Button>
    </article>
  );
}
