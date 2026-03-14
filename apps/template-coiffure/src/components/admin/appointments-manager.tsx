'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtimeRefresh } from '@/hooks/use-realtime-refresh';
import {
  CalendarCheck,
  Clock,
  User,
  ArrowRightLeft,
  Check,
  X,
  AlertCircle,
  Filter,
  MessageSquare,
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
  Input,
  Badge,
  cn,
} from '@marrynov/ui';

// ── Types ───────────────────────────────────────────────────────────────────

interface ModRequest {
  id: string;
  type: string;
  reason: string;
  status: string;
  createdAt: string;
  requester: { firstName: string; lastName: string };
}

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  isWalkIn: boolean;
  notes?: string | null;
  cancelReason?: string | null;
  client: { id: string; firstName: string; lastName: string; phone?: string | null; email: string };
  stylist?: { id: string; firstName: string; lastName: string } | null;
  services: Array<{ service: { name: string; durationMin: number } }>;
  modRequests: ModRequest[];
}

interface Stylist {
  id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  initialAppointments: Appointment[];
  stylists: Stylist[];
  pendingRequestsCount: number;
}

// ── Status maps ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'En attente', cls: 'bg-warning/10 text-warning border-warning/30' },
  CONFIRMED: { label: 'Confirmé', cls: 'bg-success/10 text-success border-success/30' },
  IN_PROGRESS: { label: 'En cours', cls: 'bg-primary/10 text-primary border-primary/30' },
  COMPLETED: { label: 'Terminé', cls: 'bg-text-muted/10 text-text-muted border-text-muted/30' },
  CANCELLED: { label: 'Annulé', cls: 'bg-error/10 text-error border-error/30' },
  NO_SHOW: { label: 'Absent', cls: 'bg-error/10 text-error border-error/30' },
  WALK_IN: { label: 'Sans RDV', cls: 'bg-secondary/10 text-secondary border-secondary/30' },
};

const MOD_TYPE_LABELS: Record<string, string> = {
  REASSIGN: 'Réassigner',
  REFUSE: 'Refuser le RDV',
  RESCHEDULE: 'Reporter',
  OTHER: 'Autre demande',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// ── Component ───────────────────────────────────────────────────────────────

export function AppointmentsManager({
  initialAppointments,
  stylists,
  pendingRequestsCount,
}: Props) {
  const router = useRouter();
  useRealtimeRefresh();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [showRequests, setShowRequests] = useState(false);

  // Reassign dialog
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignApt, setReassignApt] = useState<Appointment | null>(null);
  const [newStylistId, setNewStylistId] = useState('');
  const [saving, setSaving] = useState(false);

  // Mod request dialog
  const [modRequestOpen, setModRequestOpen] = useState(false);
  const [selectedModRequest, setSelectedModRequest] = useState<{
    apt: Appointment;
    req: ModRequest;
  } | null>(null);
  const [modAction, setModAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [modNote, setModNote] = useState('');
  const [modNewStylistId, setModNewStylistId] = useState('');

  // ── Filtrage ────────────────────────────────────────────────────────────

  const filtered = initialAppointments.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (filterDate && !a.date.startsWith(filterDate)) return false;
    return true;
  });

  // Séparer les RDV avec demandes en cours
  const withRequests = filtered.filter((a) => a.modRequests.length > 0);
  const displayList = showRequests ? withRequests : filtered;

  // Compteurs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = initialAppointments.filter((a) => a.date.startsWith(todayStr!)).length;
  const activeCount = initialAppointments.filter((a) =>
    ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(a.status),
  ).length;

  // ── Actions ─────────────────────────────────────────────────────────────

  function openReassign(apt: Appointment) {
    setReassignApt(apt);
    setNewStylistId(apt.stylist?.id ?? '');
    setReassignOpen(true);
  }

  async function handleReassign() {
    if (!reassignApt || !newStylistId) return;
    setSaving(true);
    await fetch(`/api/admin/appointments/${reassignApt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stylistId: newStylistId }),
    });
    setSaving(false);
    setReassignOpen(false);
    router.refresh();
  }

  function openModRequest(apt: Appointment, req: ModRequest) {
    setSelectedModRequest({ apt, req });
    setModAction('APPROVED');
    setModNote('');
    setModNewStylistId('');
    setModRequestOpen(true);
  }

  async function handleModRequest() {
    if (!selectedModRequest) return;
    setSaving(true);
    await fetch(`/api/admin/modification-requests/${selectedModRequest.req.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: modAction,
        adminNote: modNote || null,
        newStylistId: modNewStylistId || null,
      }),
    });
    setSaving(false);
    setModRequestOpen(false);
    router.refresh();
  }

  async function quickStatusChange(aptId: string, newStatus: string) {
    await fetch(`/api/admin/appointments/${aptId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      {/* Stats résumé */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-3xl font-bold text-primary">{todayCount}</p>
          <p className="text-xs text-text-muted">Aujourd&apos;hui</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-3xl font-bold text-success">{activeCount}</p>
          <p className="text-xs text-text-muted">Actifs</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-3xl font-bold text-text">{initialAppointments.length}</p>
          <p className="text-xs text-text-muted">Total</p>
        </div>
        <button
          onClick={() => setShowRequests(!showRequests)}
          className={cn(
            'cursor-pointer rounded-xl border p-4 text-center transition-colors',
            showRequests
              ? 'border-warning bg-warning/5'
              : pendingRequestsCount > 0
                ? 'border-warning/50 bg-surface animate-pulse'
                : 'border-border bg-surface',
          )}
        >
          <p className="text-3xl font-bold text-warning">{pendingRequestsCount}</p>
          <p className="text-xs text-text-muted">Demandes en cours</p>
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Filter size={14} className="text-text-muted" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 rounded-xl">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="CONFIRMED">Confirmé</SelectItem>
            <SelectItem value="IN_PROGRESS">En cours</SelectItem>
            <SelectItem value="COMPLETED">Terminé</SelectItem>
            <SelectItem value="CANCELLED">Annulé</SelectItem>
            <SelectItem value="NO_SHOW">Absent</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-40 rounded-xl"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="cursor-pointer text-xs text-text-muted hover:text-error"
          >
            Effacer date
          </button>
        )}
        {showRequests && (
          <Badge variant="secondary" className="text-xs">
            Filtre : demandes uniquement
          </Badge>
        )}
      </div>

      {/* Liste des RDV */}
      <div className="flex flex-col gap-3">
        {displayList.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">Aucun rendez-vous trouvé.</p>
        )}

        {displayList.map((apt) => {
          const status = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG.PENDING!;
          const hasPendingReq = apt.modRequests.length > 0;

          return (
            <div
              key={apt.id}
              className={cn(
                'rounded-2xl border bg-surface p-4 shadow-card transition-all sm:p-5',
                hasPendingReq ? 'border-warning/40 ring-1 ring-warning/20' : 'border-border',
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CalendarCheck size={14} className="text-text-muted shrink-0" />
                    <span className="text-sm font-medium text-text-muted">
                      {formatDate(apt.date)}
                    </span>
                    <span className="text-lg font-bold text-text">
                      {apt.startTime} — {apt.endTime}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-xs font-semibold',
                        status.cls,
                      )}
                    >
                      {apt.isWalkIn ? 'Sans RDV' : status.label}
                    </span>
                  </div>

                  {/* Client */}
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <User size={14} className="text-text-muted shrink-0" />
                    <span className="font-medium text-text">
                      {apt.client.firstName} {apt.client.lastName}
                    </span>
                    <span className="text-text-muted">— {apt.client.email}</span>
                  </div>

                  {/* Styliste */}
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-text-muted shrink-0" />
                    <span className="text-text-muted">
                      Styliste :{' '}
                      {apt.stylist
                        ? `${apt.stylist.firstName} ${apt.stylist.lastName}`
                        : 'Non assigné'}
                    </span>
                    <span className="font-medium text-text">
                      · {(apt.totalPrice / 100).toFixed(0)} €
                    </span>
                  </div>

                  {/* Services */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {apt.services.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary"
                      >
                        {s.service.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button
                    onClick={() => openReassign(apt)}
                    className="cursor-pointer rounded-xl p-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                    title="Réassigner le styliste"
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                  {['PENDING', 'CONFIRMED'].includes(apt.status) && (
                    <button
                      onClick={() => quickStatusChange(apt.id, 'CANCELLED')}
                      className="cursor-pointer rounded-xl p-2 text-text-muted transition-colors hover:bg-error/10 hover:text-error"
                      title="Annuler le RDV"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Demandes de modification en cours */}
              {hasPendingReq && (
                <div className="mt-3 space-y-2">
                  {apt.modRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-3"
                    >
                      <AlertCircle size={16} className="mt-0.5 shrink-0 text-warning" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text">
                          {req.requester.firstName} {req.requester.lastName} —{' '}
                          {MOD_TYPE_LABELS[req.type] ?? req.type}
                        </p>
                        <p className="mt-0.5 text-sm text-text-muted flex items-start gap-1">
                          <MessageSquare size={12} className="mt-0.5 shrink-0" />
                          {req.reason}
                        </p>
                        <p className="mt-1 text-xs text-text-muted">
                          {new Date(req.createdAt).toLocaleDateString('fr-FR')} à{' '}
                          {new Date(req.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          onClick={() => openModRequest(apt, req)}
                          className="cursor-pointer rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedModRequest({ apt, req });
                            setModAction('REJECTED');
                            setModNote('');
                            handleModRequestDirect(req.id, 'REJECTED');
                          }}
                          className="cursor-pointer rounded-lg bg-error/10 px-3 py-1.5 text-xs font-medium text-error transition-colors hover:bg-error/20"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialog réassignation styliste */}
      <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Réassigner le styliste</DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {reassignApt && (
                <>
                  RDV de {reassignApt.client.firstName} {reassignApt.client.lastName} le{' '}
                  {formatDate(reassignApt.date)} à {reassignApt.startTime}. Le client sera notifié
                  du changement.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-text">Nouveau styliste</label>
              <Select value={newStylistId} onValueChange={setNewStylistId}>
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue placeholder="Choisir un styliste" />
                </SelectTrigger>
                <SelectContent>
                  {stylists.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.firstName} {s.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setReassignOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={handleReassign}
                disabled={saving || !newStylistId || newStylistId === reassignApt?.stylist?.id}
                className="rounded-xl"
              >
                {saving ? 'Enregistrement...' : 'Réassigner'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog traitement demande de modification */}
      <Dialog open={modRequestOpen} onOpenChange={setModRequestOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Traiter la demande</DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {selectedModRequest && (
                <>
                  {selectedModRequest.req.requester.firstName} demande :{' '}
                  <strong>{MOD_TYPE_LABELS[selectedModRequest.req.type]}</strong>
                  <br />
                  Motif : {selectedModRequest.req.reason}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setModAction('APPROVED')}
                className={cn(
                  'cursor-pointer flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
                  modAction === 'APPROVED'
                    ? 'border-success bg-success/10 text-success'
                    : 'border-border text-text-muted hover:border-success/50',
                )}
              >
                Approuver
              </button>
              <button
                onClick={() => setModAction('REJECTED')}
                className={cn(
                  'cursor-pointer flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
                  modAction === 'REJECTED'
                    ? 'border-error bg-error/10 text-error'
                    : 'border-border text-text-muted hover:border-error/50',
                )}
              >
                Rejeter
              </button>
            </div>

            {/* Si REASSIGN approuvé → choisir nouveau styliste */}
            {modAction === 'APPROVED' && selectedModRequest?.req.type === 'REASSIGN' && (
              <div>
                <label className="text-sm font-medium text-text">Nouveau styliste</label>
                <Select value={modNewStylistId} onValueChange={setModNewStylistId}>
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue placeholder="Choisir un styliste" />
                  </SelectTrigger>
                  <SelectContent>
                    {stylists.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.firstName} {s.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-text">Note admin (optionnel)</label>
              <textarea
                value={modNote}
                onChange={(e) => setModNote(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Note pour le client ou le styliste..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setModRequestOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={handleModRequest}
                disabled={saving}
                className={cn(
                  'rounded-xl',
                  modAction === 'REJECTED' ? 'bg-error hover:bg-error/90' : '',
                )}
              >
                {saving ? 'Traitement...' : modAction === 'APPROVED' ? 'Approuver' : 'Rejeter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // Helper : rejet rapide sans dialog
  async function handleModRequestDirect(reqId: string, status: 'APPROVED' | 'REJECTED') {
    await fetch(`/api/admin/modification-requests/${reqId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote: null }),
    });
    router.refresh();
  }
}
