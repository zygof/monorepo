'use client';

import Image from 'next/image';
import { Clock, CalendarDays, User, ShoppingBag, Scissors } from 'lucide-react';
import { cn } from '@marrynov/ui';
import type { BookingState, TeamMember } from '@/types/salon';

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(dateStr + 'T00:00:00'));
}

function formatTime(slot: string): string {
  return slot.replace(':', 'h');
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
}

interface BookingSummaryProps {
  state: BookingState;
  teamMembers: TeamMember[];
  className?: string;
}

export function BookingSummary({ state, teamMembers, className }: BookingSummaryProps) {
  const { selectedServices, selectedProducts, stylistId, date, timeSlot } = state;

  const servicesTotal = selectedServices.reduce((sum, s) => sum + s.startingPrice, 0);
  const productsTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const grandTotal = servicesTotal + productsTotal;
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.durationMin ?? 60), 0);

  const stylist = stylistId !== 'any' ? teamMembers.find((m) => m.id === stylistId) : null;

  const isEmpty = selectedServices.length === 0 && selectedProducts.length === 0;

  return (
    <aside
      className={cn('rounded-2xl border border-border bg-surface p-6', className)}
      aria-label="Récapitulatif de votre réservation"
    >
      <h2 className="mb-5 text-base font-bold text-text">Mon récapitulatif</h2>

      {isEmpty ? (
        <p className="text-sm text-text-muted text-center py-4">
          Votre récap apparaîtra ici au fur et à mesure.
        </p>
      ) : (
        <div className="space-y-5">
          {/* Services */}
          {selectedServices.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <Scissors size={12} aria-hidden="true" />
                Prestations
              </div>
              <ul className="space-y-2">
                {selectedServices.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text leading-snug">{s.name}</p>
                      {s.durationMin && (
                        <p className="text-xs text-text-muted">
                          <Clock size={10} className="inline mr-1" aria-hidden="true" />
                          {formatDuration(s.durationMin)}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-text whitespace-nowrap">
                      à partir de {s.startingPrice}€
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Products */}
          {selectedProducts.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <ShoppingBag size={12} aria-hidden="true" />
                Produits
              </div>
              <ul className="space-y-2">
                {selectedProducts.map((p) => (
                  <li key={p.id} className="flex items-start justify-between gap-2">
                    <p className="flex-1 text-sm font-medium text-text leading-snug">{p.name}</p>
                    <span className="text-sm font-semibold text-text whitespace-nowrap">
                      {p.price}€
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Durée estimée */}
          {totalDuration > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-primary-light px-3 py-2 text-sm text-primary">
              <Clock size={14} aria-hidden="true" />
              <span>
                Durée estimée : <strong>{formatDuration(totalDuration)}</strong>
              </span>
            </div>
          )}

          {/* Stylist + Date */}
          {(stylistId || date || timeSlot) && (
            <div className="space-y-2 border-t border-border pt-4">
              {stylist ? (
                <div className="flex items-center gap-2">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full bg-primary-light shrink-0">
                    <Image
                      src={stylist.imageUrl}
                      alt={stylist.name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text">{stylist.name}</p>
                    <p className="text-xs text-text-muted">{stylist.role}</p>
                  </div>
                </div>
              ) : (
                stylistId === 'any' && (
                  <div className="flex items-center gap-2 text-xs text-text-subtle">
                    <User size={14} className="text-text-muted" aria-hidden="true" />
                    <span>Premier(e) styliste disponible</span>
                  </div>
                )
              )}
              {date && (
                <div className="flex items-center gap-2 text-xs text-text-subtle">
                  <CalendarDays size={14} className="text-text-muted" aria-hidden="true" />
                  <span className="capitalize">
                    {formatDate(date)}
                    {timeSlot ? ` · ${formatTime(timeSlot)}` : ''}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Total */}
          <div className="border-t border-border pt-4">
            {productsTotal > 0 && (
              <div className="mb-1 flex justify-between text-xs text-text-muted">
                <span>Prestations</span>
                <span>à partir de {servicesTotal}€</span>
              </div>
            )}
            {productsTotal > 0 && (
              <div className="mb-2 flex justify-between text-xs text-text-muted">
                <span>Produits</span>
                <span>{productsTotal}€</span>
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-text">Total estimé</span>
              <span className="text-xl font-bold text-primary">à partir de {grandTotal}€</span>
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Le tarif définitif est confirmé lors du rendez-vous selon diagnostic.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
