'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@marrynov/ui';
import type { NavLink as NavLinkType } from '@/types/salon';

interface DesktopNavLinkProps {
  link: NavLinkType;
}

/**
 * Lien de navigation desktop avec état actif via usePathname.
 * Client Component isolé pour garder le Header en Server Component.
 *
 * Actif si pathname === href (correspondance exacte).
 * aria-current="page" pour l'accessibilité.
 */
export function DesktopNavLink({ link }: DesktopNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative h-full flex items-center px-4 text-base font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-transform after:duration-200',
        isActive
          ? 'text-primary after:bg-primary after:scale-x-100'
          : 'text-text hover:text-primary after:bg-primary after:scale-x-0 hover:after:scale-x-100',
      )}
    >
      {link.label}
    </Link>
  );
}

interface MobileNavLinkProps {
  link: NavLinkType;
  onClick: () => void;
}

/**
 * Lien de navigation mobile avec état actif.
 * Utilisé dans MobileMenu (déjà Client Component).
 */
export function MobileNavLink({ link, onClick }: MobileNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        isActive
          ? 'bg-primary-light text-primary font-semibold'
          : 'text-text hover:bg-primary-light hover:text-primary',
      )}
    >
      {link.label}
    </Link>
  );
}
