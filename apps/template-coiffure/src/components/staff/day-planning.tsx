'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { AppointmentCard } from './appointment-card';
import { DayStats } from './day-stats';
import { WalkInDialog } from './walk-in-dialog';
import { useRealtimeRefresh } from '@/hooks/use-realtime-refresh';

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  isWalkIn: boolean;
  totalPrice: number;
  notes?: string | null;
  internalNotes?: string | null;
  delayMinutes?: number | null;
  client: { firstName: string; lastName: string; phone?: string | null; email: string };
  services: Array<{ service: { name: string; durationMin: number } }>;
}

interface DayPlanningProps {
  initialDate: string;
  appointments: Appointment[];
  userId: string;
}

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

function formatDateFR(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  return `${DAYS_FR[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]}`;
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split('T')[0] as string;
}

export function DayPlanning({ initialDate, appointments, userId }: DayPlanningProps) {
  const router = useRouter();
  const [walkInOpen, setWalkInOpen] = useState(false);
  useRealtimeRefresh();

  const today = new Date().toISOString().split('T')[0];
  const isToday = initialDate === today;

  function navigate(offset: number) {
    const newDate = addDays(initialDate, offset);
    router.push(`/staff?date=${newDate}`);
  }

  // Séparer actifs vs terminés/annulés
  const active = appointments.filter((a) =>
    ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(a.status),
  );
  const past = appointments.filter((a) => ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(a.status));

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation date */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer rounded-full p-2 text-text-muted transition-colors hover:bg-background hover:text-text"
          aria-label="Jour précédent"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center">
          <h1 className="font-serif text-xl font-bold text-text">
            {isToday ? "Aujourd'hui" : formatDateFR(initialDate)}
          </h1>
          {isToday && <p className="text-sm text-text-muted">{formatDateFR(initialDate)}</p>}
        </div>

        <button
          onClick={() => navigate(1)}
          className="cursor-pointer rounded-full p-2 text-text-muted transition-colors hover:bg-background hover:text-text"
          aria-label="Jour suivant"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Stats du jour */}
      <DayStats appointments={appointments} />

      {/* Bouton walk-in */}
      <Button
        variant="outline"
        onClick={() => setWalkInOpen(true)}
        className="w-full rounded-full gap-2"
      >
        <UserPlus size={16} aria-hidden="true" />
        Client sans rendez-vous
      </Button>

      {/* RDV actifs */}
      {active.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            À venir ({active.length})
          </h2>
          <div className="flex flex-col gap-3">
            {active.map((a) => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </section>
      )}

      {/* RDV terminés */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Terminés ({past.length})
          </h2>
          <div className="flex flex-col gap-3">
            {past.map((a) => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </section>
      )}

      {/* Aucun RDV */}
      {appointments.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
          <p className="text-lg font-serif font-bold text-text">Aucun rendez-vous</p>
          <p className="mt-1 text-sm text-text-muted">
            Pas de rendez-vous prévu pour cette journée.
          </p>
        </div>
      )}

      {/* Walk-in dialog */}
      <WalkInDialog open={walkInOpen} onOpenChange={setWalkInOpen} currentUserId={userId} />
    </div>
  );
}
