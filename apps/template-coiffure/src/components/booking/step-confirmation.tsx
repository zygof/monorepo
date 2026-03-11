'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Scissors,
  User,
  CalendarDays,
  MapPin,
  Info,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import { Button, cn } from '@marrynov/ui';
import type { BookingState, TeamMember } from '@/types/salon';

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatDateLong(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr + 'T00:00:00'));
}

function toISOLocal(dateStr: string, timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  return `${dateStr.replace(/-/g, '')}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
}

function buildGoogleCalendarUrl(state: BookingState, salonName: string, address: string): string {
  if (!state.date || !state.timeSlot) return '#';
  const [h, m] = state.timeSlot.split(':').map(Number);
  const start = new Date(
    `${state.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`,
  );
  const totalDuration = state.selectedServices.reduce((sum, s) => sum + (s.durationMin ?? 60), 0);
  const end = new Date(start.getTime() + totalDuration * 60000);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;

  const text = encodeURIComponent(
    `RDV ${salonName} — ${state.selectedServices.map((s) => s.name).join(' + ')}`,
  );
  const dates = `${fmt(start)}/${fmt(end)}`;
  const loc = encodeURIComponent(address);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${loc}`;
}

function downloadIcs(state: BookingState, salonName: string, address: string): void {
  if (!state.date || !state.timeSlot) return;
  const [h, m] = state.timeSlot.split(':').map(Number);
  const start = new Date(
    `${state.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`,
  );
  const totalDuration = state.selectedServices.reduce((sum, s) => sum + (s.durationMin ?? 60), 0);
  const end = new Date(start.getTime() + totalDuration * 60000);
  const dtStart = toISOLocal(state.date, state.timeSlot);
  const [hEnd, mEnd] = [end.getHours(), end.getMinutes()];
  const endStr = `${state.date.replace(/-/g, '')}T${String(hEnd).padStart(2, '0')}${String(mEnd).padStart(2, '0')}00`;
  const summary = `RDV ${salonName} — ${state.selectedServices.map((s) => s.name).join(' + ')}`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MARRYNOV//Booking//FR',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `LOCATION:${address}`,
    `DESCRIPTION:Rendez-vous confirmé au salon ${salonName}.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rendez-vous.ics';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── WhatsApp SVG ────────────────────────────────────────────────────── */

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ── InfoRow ─────────────────────────────────────────────────────────── */

interface InfoRowProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function InfoRow({ label, icon, children }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
        {icon}
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>
        <div className="text-sm font-medium text-text">{children}</div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */

interface StepConfirmationProps {
  state: BookingState;
  teamMembers: TeamMember[];
  salonName: string;
  phone: string;
  phoneRaw: string;
  whatsapp?: string;
  address: string;
  bookingInstructions?: string[];
}

export function StepConfirmation({
  state,
  teamMembers,
  salonName,
  phoneRaw,
  whatsapp,
  address,
  bookingInstructions,
}: StepConfirmationProps) {
  const { selectedServices, selectedProducts, stylistId, date, timeSlot, contact } = state;
  const [registerEmail, setRegisterEmail] = useState(contact.email);

  const stylist = stylistId !== 'any' ? teamMembers.find((m) => m.id === stylistId) : null;
  const servicesLabel = selectedServices.map((s) => s.name).join(' + ');
  const googleUrl = buildGoogleCalendarUrl(state, salonName, address);
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Bonjour ${salonName}, je confirme mon RDV du ${date ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(date + 'T00:00:00')) : ''} à ${timeSlot?.replace(':', 'h') ?? ''}.`)}`
    : undefined;

  return (
    <section aria-labelledby="confirmation-heading" className="mx-auto max-w-2xl py-10">
      {/* ── Header ── */}
      <div className="mb-10 text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 size={48} className="text-success" strokeWidth={1.5} aria-hidden="true" />
          </div>
        </div>
        <h1 id="confirmation-heading" className="mb-2 font-serif text-3xl font-bold text-text">
          Votre rendez-vous est confirmé&nbsp;!
        </h1>
        <p className="text-base text-text-subtle">
          Un email de confirmation a été envoyé à{' '}
          <strong className="text-text">{contact.email}</strong>.
        </p>
      </div>

      {/* ── Recap cards ── */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Left — Récapitulatif RDV */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
          <h2 className="text-base font-bold text-text">Récapitulatif</h2>

          <InfoRow
            label="Service"
            icon={<Scissors size={18} className="text-primary" aria-hidden="true" />}
          >
            {servicesLabel}
            {selectedProducts.length > 0 && (
              <p className="mt-0.5 text-xs font-normal text-text-muted">
                + {selectedProducts.length} produit{selectedProducts.length > 1 ? 's' : ''}
              </p>
            )}
          </InfoRow>

          <InfoRow
            label="Styliste"
            icon={
              stylist ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={stylist.imageUrl}
                    alt={stylist.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <User size={18} className="text-primary" aria-hidden="true" />
              )
            }
          >
            {stylist ? stylist.name : 'Premier(e) disponible'}
          </InfoRow>

          {date && timeSlot && (
            <InfoRow
              label="Date & Heure"
              icon={<CalendarDays size={18} className="text-primary" aria-hidden="true" />}
            >
              <span className="capitalize">{formatDateLong(date)}</span>
              <p className="font-semibold text-primary">{timeSlot.replace(':', 'h')}</p>
            </InfoRow>
          )}
        </div>

        {/* Right — Lieu & Infos */}
        <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
          <h2 className="text-base font-bold text-text">Lieu & Infos</h2>

          <InfoRow
            label="Adresse"
            icon={<MapPin size={18} className="text-primary" aria-hidden="true" />}
          >
            {address.split(', ').map((line, i) => (
              <span key={i} className={cn('block', i > 0 && 'font-normal text-text-subtle')}>
                {line}
              </span>
            ))}
          </InfoRow>

          {bookingInstructions && bookingInstructions.length > 0 && (
            <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-secondary">
                <Info size={14} aria-hidden="true" />
                Instructions
              </p>
              <ul className="space-y-1.5">
                {bookingInstructions.map((inst, i) => (
                  <li key={i} className="text-xs leading-relaxed text-text-subtle">
                    {inst}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Calendar actions ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Button
          asChild
          variant="outline"
          size="default"
          className="gap-2 rounded-xl border-border text-sm"
        >
          <a href={googleUrl} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path
                d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                fill="#4285F4"
              />
            </svg>
            Ajouter à Google
          </a>
        </Button>

        <Button
          variant="outline"
          size="default"
          className="gap-2 rounded-xl border-border text-sm"
          onClick={() => downloadIcs(state, salonName, address)}
        >
          <Calendar size={15} aria-hidden="true" />
          Télécharger .ics
        </Button>

        {whatsappUrl ? (
          <Button
            asChild
            variant="outline"
            size="default"
            className="col-span-2 gap-2 rounded-xl border-[#25D366] text-[#25D366] hover:bg-[#25D366] text-sm sm:col-span-1"
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={15} />
              WhatsApp
            </a>
          </Button>
        ) : (
          <a
            href={`tel:${phoneRaw}`}
            className={cn(
              'col-span-2 flex items-center justify-center gap-2 rounded-xl border border-border',
              'px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary-light sm:col-span-1',
            )}
          >
            Appeler le salon
          </a>
        )}
      </div>

      {/* ── Account creation upsell ── */}
      {/* TODO (auth) : masquer ce bloc si l'utilisateur est déjà connecté */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h3 className="mb-1 text-base font-bold text-primary">
              Gérez vos rendez-vous plus facilement
            </h3>
            <p className="text-sm text-text-subtle">
              Créez un compte pour modifier ou annuler vos RDV en un clic.
            </p>
          </div>
          <form
            action="/inscription"
            method="get"
            className="flex shrink-0 flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="register-email" className="sr-only">
              Votre adresse email
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="client@email.com"
              className={cn(
                'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text',
                'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary',
              )}
            />
            <Button type="submit" variant="default" size="pill-sm" className="whitespace-nowrap">
              Créer mon compte
            </Button>
          </form>
        </div>
      </div>

      {/* ── Back home ── */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
