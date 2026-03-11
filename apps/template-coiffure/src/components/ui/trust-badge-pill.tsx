import type { ReactNode, JSX } from 'react';
import { cn } from '@marrynov/ui';

interface TrustBadgePillProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

/**
 * Pill glassmorphism utilisée dans le Hero.
 * Fond blanc semi-transparent + backdrop blur + bordure subtile.
 */
export function TrustBadgePill({ icon, label, className }: TrustBadgePillProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0',
        'bg-white/80 backdrop-blur-sm',
        'border border-border-subtle',
        'shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
        className,
      )}
    >
      <span className="shrink-0 text-primary">{icon}</span>
      <span className="text-sm text-text whitespace-nowrap">{label}</span>
    </div>
  );
}
