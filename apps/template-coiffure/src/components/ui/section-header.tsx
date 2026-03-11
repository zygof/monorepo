import type { JSX } from 'react';
import { cn } from '@marrynov/ui';

interface SectionHeaderProps {
  /** ID utilisé par aria-labelledby sur la section parente */
  id: string;
  heading: string;
  description?: string;
  /** Couleur du titre : primary (défaut) ou text */
  headingColor?: 'primary' | 'text';
  /** Centré (défaut) ou aligné à gauche */
  align?: 'center' | 'left';
  className?: string;
}

/**
 * En-tête de section réutilisable — titre + description facultative.
 *
 * Utilisé dans : ServicesSection, et futures sections Équipe, Galerie, Avis.
 * Le `id` est passé à `aria-labelledby` sur la balise `<section>` parente.
 */
export function SectionHeader({
  id,
  heading,
  description,
  headingColor = 'primary',
  align = 'center',
  className,
}: SectionHeaderProps): JSX.Element {
  return (
    <div
      className={cn(
        'mb-16',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      <h2
        id={id}
        className={cn(
          'mb-4 font-serif text-4xl font-bold',
          headingColor === 'primary' && 'text-primary',
          headingColor === 'text' && 'text-text',
        )}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={cn(
            'text-base leading-relaxed text-text-subtle',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
