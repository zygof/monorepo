import type { JSX } from 'react';
import Link from 'next/link';
import { Scissors, Phone } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { salonConfig } from '@/config/salon.config';
import { hasBooking, hasAuth, getPrimaryCta } from '@/lib/offers';
import { MobileMenu } from './mobile-menu';
import { DesktopNavLink } from './nav-link';
import { UserMenu } from './user-menu';

/**
 * Header sticky avec backdrop blur.
 * Server Component — l'interactivité est déléguée aux Client Components
 * (MobileMenu, UserMenu).
 *
 * S'adapte au tier : Standard masque le CTA booking et le UserMenu.
 */
export function Header(): JSX.Element {
  const { name, contact, navLinks } = salonConfig;
  const showBooking = hasBooking();
  const showAuth = hasAuth();
  const cta = getPrimaryCta();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-14">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Scissors size={24} className="text-primary" aria-hidden="true" />
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">{name}</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden lg:flex items-center h-full" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <DesktopNavLink key={link.href} link={link} />
          ))}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-4">
          {/* Téléphone */}
          <a
            href={`tel:${contact.phoneRaw}`}
            className="hidden lg:flex items-center gap-2 text-base font-medium text-primary hover:text-primary-rose transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Appeler le ${contact.phone}`}
          >
            <Phone size={14} aria-hidden="true" />
            <span>{contact.phone}</span>
          </a>

          {/* CTA principal — Réserver (Expert+) ou Nous Contacter (Standard) */}
          <Button
            asChild
            variant="secondary"
            size="pill-sm"
            className="hidden lg:inline-flex shadow-sm hover:bg-secondary-dark"
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>

          {/* Compte utilisateur — Expert+ uniquement */}
          {showAuth && <UserMenu />}

          {/* Menu mobile */}
          <MobileMenu
            navLinks={navLinks}
            bookingUrl={showBooking ? '/reserver' : '/contact'}
            phone={contact.phone}
            phoneRaw={contact.phoneRaw}
          />
        </div>
      </div>
    </header>
  );
}
