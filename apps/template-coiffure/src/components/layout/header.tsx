import type { JSX } from 'react';
import Link from 'next/link';
import { Scissors, Phone, User, Menu } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { salonConfig } from '@/config/salon.config';

/**
 * Header sticky avec backdrop blur.
 * Server Component — pas d'état client.
 *
 * TODO (mobile) : extraire la nav en client component pour le menu hamburger.
 * TODO (auth) : remplacer l'icône User par le menu compte connecté.
 */
export function Header(): JSX.Element {
  const { name, contact, navLinks, bookingUrl } = salonConfig;

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
            <Link
              key={link.href}
              href={link.href}
              className="relative h-full flex items-center px-4 text-base font-medium text-text transition-colors hover:text-primary
                [&.active]:text-primary [&.active]:after:absolute [&.active]:after:bottom-0
                [&.active]:after:left-0 [&.active]:after:right-0 [&.active]:after:h-0.5
                [&.active]:after:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-4">
          {/* Téléphone */}
          <a
            href={`tel:${contact.phoneRaw}`}
            className="hidden lg:flex items-center gap-2 text-base font-medium text-text hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Appeler le ${contact.phone}`}
          >
            <Phone size={14} aria-hidden="true" />
            <span>{contact.phone}</span>
          </a>

          {/* Compte utilisateur — TODO: connecter à next-auth */}
          <Button
            variant="outline"
            size="icon"
            className="hidden lg:flex rounded-full border-border hover:border-primary"
            aria-label="Mon compte"
          >
            <User size={16} aria-hidden="true" />
          </Button>

          {/* CTA Réserver */}
          <Button
            asChild
            variant="secondary"
            size="pill-sm"
            className="hidden lg:inline-flex shadow-sm hover:bg-secondary-dark"
          >
            <Link href={bookingUrl}>Prendre RDV</Link>
          </Button>

          {/* Hamburger mobile — TODO: implémenter le menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-md"
            aria-label="Ouvrir le menu"
            aria-expanded="false"
            aria-controls="mobile-menu"
          >
            <Menu size={22} className="text-text" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
