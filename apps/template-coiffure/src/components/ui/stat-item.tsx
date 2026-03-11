import type { ReactNode, JSX } from 'react';
import { cn } from '@marrynov/ui';

interface StatItemProps {
  icon: ReactNode;
  value: string;
  label: string;
  /** Affiche une bordure gauche (séparateur vertical) */
  withDivider?: boolean;
  className?: string;
}

/**
 * Stat affiché dans la section Trust Badges (barre de réassurance).
 * Icône centrée dans un cercle primary-light + valeur + label.
 */
export function StatItem({
  icon,
  value,
  label,
  withDivider = false,
  className,
}: StatItemProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col items-center px-4',
        withDivider && 'border-l border-border/50',
        className,
      )}
    >
      <div className="mb-2 flex h-10 w-10 items-center justify-center">
        <span className="text-primary">{icon}</span>
      </div>
      <p className="text-lg font-semibold text-text">{value}</p>
      <p className="text-sm text-text-muted text-center">{label}</p>
    </div>
  );
}
