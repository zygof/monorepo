'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Button } from '@marrynov/ui';
import type { NavLink } from '@/types/salon';
import { MobileNavLink } from './nav-link';

interface MobileMenuProps {
  navLinks: NavLink[];
  bookingUrl: string;
  phone: string;
  phoneRaw: string;
}

/**
 * Menu de navigation mobile — Client Component (état open/close).
 * Extrait du Header (Server Component) pour isoler l'interactivité.
 *
 * Comportement :
 *  - Hamburger ↔ X selon l'état ouvert/fermé
 *  - Drawer slide-down sous le header, fond blanc
 *  - Fermeture sur clic lien, bouton CTA ou touche Escape
 *  - Scroll du body bloqué quand le menu est ouvert
 */
export function MobileMenu({ navLinks, bookingUrl, phone, phoneRaw }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  /* Escape key + scroll lock */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Bouton hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-md"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? (
          <X size={22} className="text-text" aria-hidden="true" />
        ) : (
          <Menu size={22} className="text-text" aria-hidden="true" />
        )}
      </Button>

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 top-20 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Drawer */}
      <nav
        id="mobile-menu"
        aria-label="Navigation mobile"
        className={[
          'fixed left-0 right-0 top-20 z-50 lg:hidden',
          'border-b border-border bg-white shadow-lg',
          'transition-all duration-300 ease-in-out',
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-1">
          {/* Nav links */}
          {navLinks.map((link) => (
            <MobileNavLink key={link.href} link={link} onClick={close} />
          ))}

          {/* Séparateur */}
          <div className="my-2 h-px bg-border" aria-hidden="true" />

          {/* Téléphone */}
          <a
            href={`tel:${phoneRaw}`}
            onClick={close}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-primary transition-colors hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Appeler le ${phone}`}
          >
            <Phone size={16} aria-hidden="true" />
            {phone}
          </a>

          {/* CTA Réserver */}
          <div className="mt-2">
            <Button
              asChild
              variant="secondary"
              size="pill"
              className="w-full shadow-sm hover:bg-secondary-dark"
            >
              <Link href={bookingUrl} onClick={close}>
                Prendre RDV
                <Calendar size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
