'use client';

import Link from 'next/link';
import { Trophy, Gift, Phone, MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import { Button, cn } from '@marrynov/ui';
import type { LoyaltyInfo, PromoOffer } from '@/types/salon';

/* ── Loyalty Widget ──────────────────────────────────────────────────── */

interface LoyaltyWidgetProps {
  loyalty: LoyaltyInfo;
  onNavigateToLoyalty: () => void;
}

export function LoyaltyWidget({ loyalty, onNavigateToLoyalty }: LoyaltyWidgetProps) {
  const progress = (loyalty.currentVisits / loyalty.targetVisits) * 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <Trophy size={20} className="text-secondary" />
        <h3 className="font-serif text-lg font-bold text-text">Programme Fidélité</h3>
      </div>

      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-text">
          {loyalty.currentVisits}/{loyalty.targetVisits} visites
        </span>
        <span className="font-semibold text-primary">
          {loyalty.discount} à la {loyalty.targetVisits}e
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-border/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Dots */}
      <div className="mb-4 flex items-center justify-between gap-1">
        {Array.from({ length: loyalty.targetVisits }, (_, i) => {
          const isCompleted = i < loyalty.currentVisits;
          const isTarget = i === loyalty.targetVisits - 1;

          return (
            <div
              key={i}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                isCompleted && 'bg-primary text-white',
                !isCompleted && !isTarget && 'border border-border bg-background text-text-muted',
                isTarget &&
                  !isCompleted &&
                  'border border-secondary bg-secondary/10 text-secondary',
              )}
            >
              {isCompleted ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : isTarget ? (
                <Gift size={12} aria-hidden="true" />
              ) : (
                i + 1
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-text-subtle">
        Plus que {loyalty.targetVisits - loyalty.currentVisits} visite
        {loyalty.targetVisits - loyalty.currentVisits > 1 ? 's' : ''} pour obtenir votre{' '}
        {loyalty.reward}.
      </p>

      <button
        type="button"
        onClick={onNavigateToLoyalty}
        className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Voir le détail
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── Quick Actions Widget ────────────────────────────────────────────── */

interface QuickActionsProps {
  phone: string;
  phoneRaw: string;
  whatsapp?: string;
  address: string;
}

export function QuickActionsWidget({ phone, phoneRaw, whatsapp, address }: QuickActionsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card">
      <h3 className="mb-4 font-serif text-lg font-bold text-text">Besoin d&apos;aide ?</h3>
      <div className="flex flex-col gap-3">
        <a
          href={`tel:${phoneRaw}`}
          className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 text-sm text-text-subtle transition-colors hover:bg-primary-light hover:text-primary"
        >
          <Phone size={18} className="shrink-0 text-primary" aria-hidden="true" />
          Appeler le salon ({phone})
        </a>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 text-sm text-text-subtle transition-colors hover:bg-primary-light hover:text-primary"
          >
            <MessageCircle size={18} className="shrink-0 text-primary" aria-hidden="true" />
            WhatsApp
          </a>
        )}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl bg-background px-4 py-3 text-sm text-text-subtle transition-colors hover:bg-primary-light hover:text-primary"
        >
          <MapPin size={18} className="shrink-0 text-primary" aria-hidden="true" />
          Itinéraire Google Maps
        </a>
      </div>
    </div>
  );
}

/* ── Promo Widget ────────────────────────────────────────────────────── */

interface PromoWidgetProps {
  promo: PromoOffer;
}

export function PromoWidget({ promo }: PromoWidgetProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-card">
      <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest">
        {promo.badge}
      </span>
      <h3 className="mb-2 font-serif text-xl font-bold">{promo.title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-white/80">{promo.description}</p>
      <Button
        asChild
        variant="secondary"
        size="pill"
        className="w-full bg-white text-primary hover:bg-white/90"
      >
        <Link href={promo.ctaHref}>{promo.ctaLabel}</Link>
      </Button>
    </div>
  );
}
