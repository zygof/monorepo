'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  User,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  MessageSquareWarning,
  CheckCircle2,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@marrynov/ui';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'En attente', cls: 'bg-warning/10 text-warning border-warning/30' },
  CONFIRMED: { label: 'Confirmé', cls: 'bg-success/10 text-success border-success/30' },
  IN_PROGRESS: { label: 'En cours', cls: 'bg-primary/10 text-primary border-primary/30' },
  COMPLETED: { label: 'Terminé', cls: 'bg-text-muted/10 text-text-muted border-text-muted/30' },
  CANCELLED: { label: 'Annulé', cls: 'bg-error/10 text-error border-error/30' },
  NO_SHOW: { label: 'Absent', cls: 'bg-error/10 text-error border-error/30' },
  WALK_IN: { label: 'Sans RDV', cls: 'bg-secondary/10 text-secondary border-secondary/30' },
};

const MOD_REASONS = [
  { value: 'indisponible', label: 'Je ne suis pas disponible' },
  { value: 'maladie', label: 'Arrêt maladie' },
  { value: 'conge', label: 'Congé / jour de repos' },
  { value: 'surcharge', label: 'Planning surchargé' },
  { value: 'competence', label: 'Prestation hors de mes compétences' },
  { value: 'custom', label: 'Autre (préciser)' },
];

interface AppointmentCardProps {
  appointment: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    isWalkIn: boolean;
    totalPrice: number;
    notes?: string | null;
    internalNotes?: string | null;
    delayMinutes?: number | null;
    hasPendingModRequest?: boolean;
    client: { firstName: string; lastName: string; phone?: string | null; email: string };
    services: Array<{ service: { name: string; durationMin: number } }>;
  };
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState('');
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [modType, setModType] = useState('REFUSE');
  const [modReasonSelect, setModReasonSelect] = useState('');
  const [modReasonText, setModReasonText] = useState('');
  const [modSending, setModSending] = useState(false);
  const [modSent, setModSent] = useState(false);
  const [modError, setModError] = useState('');

  const status = STATUS_MAP[appointment.status] ?? {
    label: 'En attente',
    cls: 'bg-warning/10 text-warning border-warning/30',
  };
  const isActive = ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(appointment.status);
  const totalDuration = appointment.services.reduce((sum, s) => sum + s.service.durationMin, 0);

  async function submitModRequest() {
    setModError('');
    const reason =
      modReasonSelect === 'custom'
        ? modReasonText.trim()
        : (MOD_REASONS.find((r) => r.value === modReasonSelect)?.label ?? modReasonText.trim());

    if (!reason) {
      setModError('Veuillez préciser un motif');
      return;
    }

    setModSending(true);
    const res = await fetch('/api/staff/modification-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: appointment.id,
        type: modType,
        reason,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setModError(data?.error ?? "Erreur lors de l'envoi");
      setModSending(false);
      return;
    }

    setModSending(false);
    setModSent(true);
    setTimeout(() => {
      setModDialogOpen(false);
      setModSent(false);
      router.refresh();
    }, 1500);
  }

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    await fetch(`/api/staff/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading('');
    router.refresh();
  }

  async function setDelay(minutes: number) {
    setLoading('delay');
    await fetch(`/api/staff/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delayMinutes: minutes }),
    });
    setLoading('');
    router.refresh();
  }

  async function saveNotes(notes: string) {
    await fetch(`/api/staff/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internalNotes: notes }),
    });
    router.refresh();
  }

  return (
    <div
      className={cn(
        'rounded-2xl border bg-surface shadow-card transition-shadow',
        appointment.status === 'IN_PROGRESS'
          ? 'border-primary/40 shadow-primary-glow/20'
          : 'border-border',
      )}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between p-4 sm:p-5">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-text">
              {appointment.startTime} — {appointment.endTime}
            </span>
            <span
              className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold', status.cls)}
            >
              {appointment.isWalkIn ? 'Sans RDV' : status.label}
            </span>
            {appointment.delayMinutes ? (
              <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">
                <AlertTriangle size={12} aria-hidden="true" />+{appointment.delayMinutes} min
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-text">
            <User size={14} className="text-text-muted" aria-hidden="true" />
            <span className="font-medium">
              {appointment.client.firstName} {appointment.client.lastName}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap gap-1.5">
            {appointment.services.map((s, i) => (
              <span
                key={i}
                className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {s.service.name}
              </span>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock size={12} aria-hidden="true" />
              {totalDuration} min
            </span>
            <span className="font-medium text-text">
              {(appointment.totalPrice / 100).toFixed(0)} €
            </span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer ml-2 shrink-0 rounded-full p-2 text-text-muted transition-colors hover:bg-background hover:text-text"
          aria-label={expanded ? 'Réduire' : 'Détails'}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Zone étendue */}
      {expanded && (
        <div className="border-t border-border px-4 py-4 sm:px-5">
          {/* Contact */}
          <div className="flex flex-wrap gap-3 text-sm">
            {appointment.client.phone && (
              <a
                href={`tel:${appointment.client.phone}`}
                className="flex items-center gap-1.5 rounded-xl bg-background px-3 py-1.5 text-text hover:bg-primary-light hover:text-primary transition-colors"
              >
                <Phone size={14} aria-hidden="true" />
                {appointment.client.phone}
              </a>
            )}
            <span className="flex items-center gap-1.5 text-text-muted">
              {appointment.client.email}
            </span>
          </div>

          {/* Notes client */}
          {appointment.notes && (
            <div className="mt-3 rounded-xl bg-secondary-light/50 p-3 text-sm">
              <span className="text-xs font-semibold text-secondary-dark">Note cliente :</span>
              <p className="mt-0.5 text-text">{appointment.notes}</p>
            </div>
          )}

          {/* Notes internes */}
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-text-muted">
              Notes internes
            </label>
            <textarea
              defaultValue={appointment.internalNotes ?? ''}
              onBlur={(e) => {
                if (e.target.value !== (appointment.internalNotes ?? '')) {
                  saveNotes(e.target.value);
                }
              }}
              rows={2}
              placeholder="Notes visibles uniquement par l'équipe…"
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Actions */}
          {isActive && (
            <div className="mt-4 flex flex-wrap gap-2">
              {appointment.status === 'CONFIRMED' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => updateStatus('IN_PROGRESS')}
                  disabled={loading === 'IN_PROGRESS'}
                  className="rounded-full"
                >
                  {loading === 'IN_PROGRESS' ? '…' : 'Démarrer'}
                </Button>
              )}
              {appointment.status === 'IN_PROGRESS' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => updateStatus('COMPLETED')}
                  disabled={loading === 'COMPLETED'}
                  className="rounded-full bg-success hover:bg-success/90"
                >
                  {loading === 'COMPLETED' ? '…' : 'Terminer'}
                </Button>
              )}
              {appointment.status !== 'IN_PROGRESS' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateStatus('NO_SHOW')}
                  disabled={loading === 'NO_SHOW'}
                  className="rounded-full"
                >
                  {loading === 'NO_SHOW' ? '…' : 'Absent(e)'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateStatus('CANCELLED')}
                disabled={loading === 'CANCELLED'}
                className="rounded-full text-error hover:bg-error/5"
              >
                {loading === 'CANCELLED' ? '…' : 'Annuler'}
              </Button>

              {/* Retard */}
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-xs text-text-muted">Retard :</span>
                {[10, 15, 30].map((m) => (
                  <button
                    key={m}
                    onClick={() => setDelay(m)}
                    disabled={loading === 'delay'}
                    className={cn(
                      'cursor-pointer rounded-full border px-2 py-0.5 text-xs font-medium transition-colors',
                      appointment.delayMinutes === m
                        ? 'border-warning bg-warning/10 text-warning'
                        : 'border-border text-text-muted hover:border-warning hover:text-warning',
                    )}
                  >
                    +{m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Demander modification */}
          {isActive && (
            <div className="mt-3 border-t border-border pt-3">
              {appointment.hasPendingModRequest ? (
                <div className="flex items-center gap-2 text-xs text-warning">
                  <CheckCircle2 size={14} />
                  Demande de modification en cours — en attente de réponse admin
                </div>
              ) : (
                <button
                  onClick={() => {
                    setModType('REFUSE');
                    setModReasonSelect('');
                    setModReasonText('');
                    setModError('');
                    setModDialogOpen(true);
                  }}
                  className="cursor-pointer flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-warning transition-colors hover:bg-warning/10"
                >
                  <MessageSquareWarning size={14} />
                  Demander une modification à l&apos;admin
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dialog demande de modification */}
      <Dialog open={modDialogOpen} onOpenChange={setModDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Demander une modification</DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              RDV de {appointment.client.firstName} {appointment.client.lastName} à{' '}
              {appointment.startTime}. L&apos;admin sera notifié et traitera votre demande.
            </DialogDescription>
          </DialogHeader>

          {modSent ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle2 size={40} className="text-success" />
              <p className="text-sm font-medium text-success">Demande envoyée avec succès</p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {modError && (
                <p className="rounded-xl bg-error/5 px-3 py-2 text-sm text-error border border-error/20">
                  {modError}
                </p>
              )}

              <div>
                <label className="text-sm font-medium text-text">Type de demande</label>
                <Select value={modType} onValueChange={setModType}>
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REFUSE">Refuser ce rendez-vous</SelectItem>
                    <SelectItem value="REASSIGN">Réassigner à un(e) collègue</SelectItem>
                    <SelectItem value="RESCHEDULE">Demander un report</SelectItem>
                    <SelectItem value="OTHER">Autre demande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-text">Motif</label>
                <Select value={modReasonSelect} onValueChange={setModReasonSelect}>
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue placeholder="Choisir un motif..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOD_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {modReasonSelect === 'custom' && (
                <div>
                  <label className="text-sm font-medium text-text">Préciser votre motif</label>
                  <textarea
                    value={modReasonText}
                    onChange={(e) => setModReasonText(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="Expliquez votre demande..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setModDialogOpen(false)}
                  className="rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  onClick={submitModRequest}
                  disabled={modSending || !modReasonSelect}
                  className="rounded-xl bg-warning text-white hover:bg-warning/90"
                >
                  {modSending ? 'Envoi...' : 'Envoyer la demande'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
