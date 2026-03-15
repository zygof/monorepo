'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Edit3,
  X,
  Phone as PhoneIcon,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  cn,
  toast,
} from '@marrynov/ui';
import type { Appointment, AppointmentStatus, TeamMember } from '@/types/salon';
import { ReviewForm } from './review-form';

/* ── Helpers ─────────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; cls: string }> = {
  confirmed: {
    label: 'Confirmé',
    cls: 'bg-success/10 text-success border-success/30',
  },
  pending: {
    label: 'En attente',
    cls: 'bg-warning/10 text-warning border-warning/30',
  },
  cancelled: {
    label: 'Annulé',
    cls: 'bg-error/10 text-error border-error/30',
  },
  completed: {
    label: 'Terminé',
    cls: 'bg-text-muted/10 text-text-muted border-text-muted/30',
  },
};

function formatDate(dateStr: string): {
  day: string;
  month: string;
  weekday: string;
  full: string;
} {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
  const weekday = date.toLocaleDateString('fr-FR', { weekday: 'long' });
  const full = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  return { day, month, weekday, full };
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m.toString().padStart(2, '0')}min`;
}

function getStylistName(stylistId: string, members: TeamMember[]): string {
  const member = members.find((m) => m.id === stylistId);
  return member ? (member.name.split(' ')[0] ?? member.name) : 'Non assigné';
}

/* ── Star Rating Display ─────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} étoiles sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'fill-secondary text-secondary' : 'text-border'}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* ── Appointment Card ────────────────────────────────────────────────── */

interface AppointmentCardProps {
  appointment: Appointment;
  teamMembers: TeamMember[];
  isPast: boolean;
  salonPhone: string;
}

function AppointmentCard({ appointment, teamMembers, isPast, salonPhone }: AppointmentCardProps) {
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleMessage, setRescheduleMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { day, month, full } = formatDate(appointment.date);
  const status = STATUS_CONFIG[appointment.status];
  const stylistName = getStylistName(appointment.stylistId, teamMembers);

  async function handleCancel() {
    setLoading(true);
    const res = await fetch(`/api/account/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', reason: cancelReason }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess('Rendez-vous annulé');
      toast.success('Rendez-vous annulé', {
        description: 'Un email de confirmation vous a été envoyé.',
      });
      setTimeout(() => {
        setCancelOpen(false);
        router.refresh();
      }, 1200);
    } else {
      toast.error("Impossible d'annuler le rendez-vous");
    }
  }

  async function handleReschedule() {
    setLoading(true);
    const res = await fetch(`/api/account/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reschedule', message: rescheduleMessage }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess('Demande de report envoyée au salon');
      toast.success('Demande envoyée', {
        description: 'Le salon vous recontactera pour un nouveau créneau.',
      });
      setTimeout(() => {
        setRescheduleOpen(false);
        setSuccess('');
      }, 2000);
    } else {
      toast.error("Impossible d'envoyer la demande de report");
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex gap-4 p-5 sm:p-6">
        {/* Date badge */}
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-light">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {month}
          </span>
          <span className="font-serif text-2xl font-bold leading-none text-text">{day}</span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-text">
                {appointment.services.join(' + ')}
              </h3>
              <span
                className={cn(
                  'mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                  status.cls,
                )}
              >
                {status.label}
              </span>
            </div>
            <span className="shrink-0 font-serif text-lg font-bold text-text">
              {appointment.price}&nbsp;€
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-subtle">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" aria-hidden="true" />
              {full}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary" aria-hidden="true" />
              {appointment.time} ({formatDuration(appointment.durationMin)})
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-primary" aria-hidden="true" />
              Avec {stylistName}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!isPast && appointment.status !== 'cancelled' && (
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-3 sm:px-6">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1.5 rounded-lg text-xs"
            onClick={() => {
              setRescheduleMessage('');
              setRescheduleOpen(true);
            }}
          >
            <Edit3 size={12} aria-hidden="true" />
            Reporter
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer gap-1.5 rounded-lg text-xs text-error hover:text-error hover:bg-error/5"
            onClick={() => {
              setCancelReason('');
              setCancelOpen(true);
            }}
          >
            <X size={12} aria-hidden="true" />
            Annuler
          </Button>
          <div className="ml-auto flex gap-3">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg text-xs" asChild>
              <a href={`tel:${salonPhone}`}>
                <PhoneIcon size={12} aria-hidden="true" />
                Contacter le salon
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Dialog annulation */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-error">
              Annuler le rendez-vous
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {appointment.services.join(' + ')} le {full} à {appointment.time}. Le salon sera
              informé de votre annulation.
            </DialogDescription>
          </DialogHeader>
          {success ? (
            <p className="py-4 text-center text-sm font-medium text-success">{success}</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-text">Motif (optionnel)</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Raison de l'annulation..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(false)}
                  className="cursor-pointer rounded-xl"
                >
                  Retour
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={loading}
                  className="cursor-pointer rounded-xl bg-error hover:bg-error/90"
                >
                  {loading ? 'Annulation...' : "Confirmer l'annulation"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog report */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Reporter le rendez-vous</DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              Le salon recevra votre demande et vous recontactera pour trouver un nouveau créneau.
            </DialogDescription>
          </DialogHeader>
          {success ? (
            <p className="py-4 text-center text-sm font-medium text-success">{success}</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-text">Précisions (optionnel)</label>
                <textarea
                  value={rescheduleMessage}
                  onChange={(e) => setRescheduleMessage(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Indiquez vos disponibilités ou le motif du report..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setRescheduleOpen(false)}
                  className="cursor-pointer rounded-xl"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={loading}
                  className="cursor-pointer rounded-xl"
                >
                  {loading ? 'Envoi...' : 'Envoyer la demande'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Past: review section */}
      {isPast && appointment.status === 'completed' && (
        <div className="border-t border-border bg-background/50 px-5 py-4 sm:px-6">
          {appointment.review ? (
            /* Existing review */
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <StarRating rating={appointment.review.rating} />
              </div>
              <p className="text-sm italic text-text-subtle">
                &laquo;&nbsp;{appointment.review.comment}&nbsp;&raquo;
              </p>
            </div>
          ) : showReviewForm ? (
            /* Review form */
            <ReviewForm
              appointmentId={appointment.id}
              onCancel={() => setShowReviewForm(false)}
              onSubmit={() => setShowReviewForm(false)}
            />
          ) : (
            /* CTA to leave review */
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">Laissez un avis sur votre prestation</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReviewForm(true)}
                className="gap-1.5 text-primary hover:text-primary"
              >
                Laisser un commentaire
                <ArrowRight size={14} aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ── Tab Appointments ────────────────────────────────────────────────── */

interface TabAppointmentsProps {
  appointments: Appointment[];
  teamMembers: TeamMember[];
  bookingUrl: string;
  salonPhone: string;
}

export function TabAppointments({
  appointments,
  teamMembers,
  bookingUrl,
  salonPhone,
}: TabAppointmentsProps) {
  const [showAllPast, setShowAllPast] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = appointments
    .filter((a) => a.date >= today && a.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = appointments
    .filter((a) => a.date < today || a.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  const visiblePast = showAllPast ? past : past.slice(0, 2);

  return (
    <div className="flex flex-col gap-10">
      {/* ── À venir ──────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-text">À venir</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-primary hover:text-primary"
            asChild
          >
            <Link href={bookingUrl}>
              Prendre un nouveau RDV
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
            <MapPin size={32} className="mx-auto mb-3 text-text-muted" />
            <p className="mb-1 font-medium text-text">Aucun rendez-vous à venir</p>
            <p className="mb-4 text-sm text-text-subtle">
              Réservez votre prochaine prestation en quelques clics.
            </p>
            <Button asChild size="pill" className="shadow-primary-glow">
              <Link href={bookingUrl}>Réserver maintenant</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                teamMembers={teamMembers}
                isPast={false}
                salonPhone={salonPhone}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Passés ───────────────────────────────────── */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-xl font-bold text-text">Passés</h2>

          <div className="flex flex-col gap-4">
            {visiblePast.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                teamMembers={teamMembers}
                isPast={true}
                salonPhone={salonPhone}
              />
            ))}
          </div>

          {past.length > 2 && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllPast(!showAllPast)}
                className="gap-1.5 text-primary hover:text-primary"
              >
                {showAllPast ? (
                  <>
                    Voir moins
                    <ChevronUp size={14} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Voir tout l&apos;historique ({past.length})
                    <ChevronDown size={14} aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
