'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { Button } from '@marrynov/ui';
import type { NavLink } from '@/types/salon';
import { hasAuth, hasBooking } from '@/lib/offers';
import { MobileNavLink } from './nav-link';

interface MobileMenuProps {
  navLinks: NavLink[];
  bookingUrl: string;
  phone: string;
  phoneRaw: string;
}

/**
 * Menu de navigation mobile — Client Component (état open/close).
 * S'adapte au tier : Vitrine masque les sections auth/booking.
 */
export function MobileMenu({ navLinks, bookingUrl, phone, phoneRaw }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const showAuth = hasAuth();
  const showBooking = hasBooking();
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  /* Escape key + scroll lock + focus trap */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
        return;
      }

      // Focus trap : Tab/Shift+Tab dans le menu
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Déplacer le focus dans le menu à l'ouverture
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a[href], button');
    firstLink?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Bouton hamburger */}
      <Button
        ref={triggerRef}
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
        ref={menuRef}
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

          {/* Section auth — Standard+ uniquement */}
          {showAuth && <MobileMenuAuth onClose={close} />}

          {/* Séparateur */}
          <div className="my-1 h-px bg-border" aria-hidden="true" />

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

          {/* CTA */}
          <div className="mt-2 flex flex-col gap-2">
            <Button
              asChild
              variant="secondary"
              size="pill"
              className="w-full shadow-sm hover:bg-secondary-dark"
            >
              <Link href={bookingUrl} onClick={close}>
                {showBooking ? 'Prendre RDV' : 'Nous Contacter'}
                {showBooking && <Calendar size={16} aria-hidden="true" />}
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}

// ── Sous-composant auth (Standard+) ──────────────────────────────────
// Isolé pour que useSession/signOut ne soient importés que quand l'auth est active.

import { useSession, signOut } from 'next-auth/react';
import { User, Heart, LogOut, Shield, Scissors } from 'lucide-react';
import { useAuthModal } from '@/components/providers';

function MobileMenuAuth({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const { openAuth } = useAuthModal();

  if (session?.user) {
    return (
      <>
        <Link
          href="/compte"
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-text transition-colors hover:bg-primary-light"
        >
          <User size={16} aria-hidden="true" />
          Mon compte
        </Link>
        <Link
          href="/compte?tab=appointments"
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-text transition-colors hover:bg-primary-light"
        >
          <Calendar size={16} aria-hidden="true" />
          Mes rendez-vous
        </Link>
        <Link
          href="/compte?tab=loyalty"
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-text transition-colors hover:bg-primary-light"
        >
          <Heart size={16} aria-hidden="true" />
          Ma fidélité
        </Link>
        {/* Liens staff/admin */}
        {(session.user.role === 'ADMIN' || session.user.role === 'EMPLOYEE') && (
          <>
            <div className="my-1 h-px bg-border" aria-hidden="true" />
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-primary transition-colors hover:bg-primary-light"
              >
                <Shield size={16} aria-hidden="true" />
                Administration
              </Link>
            )}
            <Link
              href="/staff"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-primary transition-colors hover:bg-primary-light"
            >
              <Scissors size={16} aria-hidden="true" />
              Espace styliste
            </Link>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            onClose();
            signOut({ callbackUrl: '/' });
          }}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={16} aria-hidden="true" />
          Se déconnecter
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        onClose();
        openAuth('login');
      }}
      className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-text transition-colors hover:bg-primary-light"
    >
      <User size={16} aria-hidden="true" />
      Mon compte
    </button>
  );
}
