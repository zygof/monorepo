import type { JSX } from 'react';
import Link from 'next/link';
import { Scissors, MapPin, Phone, MessageCircle } from 'lucide-react';
import { salonConfig } from '@/config/salon.config';

/**
 * Footer — 4 colonnes : Marque, Contact, Horaires, Liens Rapides.
 * Server Component.
 */
export function Footer(): JSX.Element {
  const { name, description, contact, schedule, navLinks, bookingUrl, copyright, footerLabels } =
    salonConfig;

  const focusClasses =
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Colonne 1 — Marque */}
          <div className="flex flex-col gap-6">
            <Link href="/" className={`flex items-center gap-2 ${focusClasses}`}>
              <Scissors size={24} className="text-primary" aria-hidden="true" />
              <span className="font-serif text-xl font-bold tracking-tight text-primary">
                {name}
              </span>
            </Link>
            <p className="text-base leading-relaxed text-text-subtle">{description}</p>
            {/* Réseaux sociaux */}
            <div className="flex gap-4">
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary-light hover:text-primary transition-colors ${focusClasses}`}
                >
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {contact.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary-light hover:text-primary transition-colors ${focusClasses}`}
                >
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {contact.tiktok && (
                <a
                  href={contact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-background hover:bg-primary-light hover:text-primary transition-colors text-sm font-bold ${focusClasses}`}
                >
                  TK
                </a>
              )}
            </div>
          </div>

          {/* Colonne 2 — Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold text-text">
              {footerLabels.contactHeading}
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                <address className="not-italic text-base text-text-subtle leading-relaxed">
                  {contact.address}
                  <br />
                  {contact.postalCode} {contact.city}
                  <br />
                  {contact.region}
                </address>
              </li>
              <li>
                <a
                  href={`tel:${contact.phoneRaw}`}
                  aria-label={`Appeler le ${contact.phone}`}
                  className={`flex items-center gap-3 text-base text-text-subtle hover:text-primary transition-colors ${focusClasses}`}
                >
                  <Phone size={16} className="text-primary" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
              {contact.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-base text-text-subtle hover:text-primary transition-colors ${focusClasses}`}
                  >
                    <MessageCircle size={16} className="text-primary" aria-hidden="true" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Colonne 3 — Horaires */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold text-text">
              {footerLabels.scheduleHeading}
            </h3>
            <ul className="flex flex-col gap-2">
              {Object.entries(schedule).map(([day, hours]) => (
                <li key={day} className="flex items-center justify-between text-base">
                  <span className="text-text-subtle">{day}</span>
                  <span className={hours ? 'text-text-subtle' : 'text-text-muted'}>
                    {hours ?? 'Fermé'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 — Liens rapides */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-lg font-bold text-text">{footerLabels.linksHeading}</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href={bookingUrl}
                  className={`text-base text-text-subtle hover:text-primary transition-colors ${focusClasses}`}
                >
                  {footerLabels.bookOnline}
                </Link>
              </li>
              {navLinks.slice(1).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-base text-text-subtle hover:text-primary transition-colors ${focusClasses}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/mentions-legales"
                  className={`text-base text-text-subtle hover:text-primary transition-colors ${focusClasses}`}
                >
                  {footerLabels.legalNotice}
                </Link>
              </li>
              <li>
                <Link
                  href="/cgv"
                  className={`text-base text-text-subtle hover:text-primary transition-colors ${focusClasses}`}
                >
                  {footerLabels.termsAndConditions}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-text-muted">{copyright}</p>
          <p className="text-sm text-text-muted">{footerLabels.byline}</p>
        </div>
      </div>
    </footer>
  );
}
