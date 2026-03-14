'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtimeRefresh } from '@/hooks/use-realtime-refresh';
import {
  Search,
  Phone,
  Mail,
  Calendar,
  StickyNote,
  Send,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
} from 'lucide-react';
import { Button, Input, Badge, cn } from '@marrynov/ui';

// ── Types ───────────────────────────────────────────────────────────────

interface ClientNote {
  id: string;
  content: string;
  createdAt: string;
  author: { firstName: string; lastName: string };
}

interface ClientAppointment {
  id: string;
  date: string;
  startTime: string;
  status: string;
  totalPrice: number;
  services: Array<{ service: { name: string } }>;
  stylist?: { firstName: string } | null;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  appointments: ClientAppointment[];
  clientNotes: ClientNote[];
  loyalty?: { currentVisits: number; totalVisits: number; rewardsEarned: number } | null;
  _count: { appointments: number };
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'En attente', cls: 'text-warning' },
  CONFIRMED: { label: 'Confirmé', cls: 'text-success' },
  IN_PROGRESS: { label: 'En cours', cls: 'text-primary' },
  COMPLETED: { label: 'Terminé', cls: 'text-text-muted' },
  CANCELLED: { label: 'Annulé', cls: 'text-error' },
  NO_SHOW: { label: 'Absent', cls: 'text-error' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ── Component ───────────────────────────────────────────────────────────

export function ClientsManager({ initialClients }: { initialClients: Client[] }) {
  const router = useRouter();
  useRealtimeRefresh();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = initialClients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
    );
  });

  async function addNote(clientId: string) {
    if (!noteText.trim()) return;
    setSaving(true);
    await fetch(`/api/staff/clients/${clientId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText.trim() }),
    });
    setSaving(false);
    setNoteText('');
    router.refresh();
  }

  return (
    <>
      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client (nom, email, téléphone)..."
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Stats */}
      <div className="mb-6 flex gap-4">
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
          <p className="text-2xl font-bold text-primary">{initialClients.length}</p>
          <p className="text-xs text-text-muted">Clients</p>
        </div>
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center">
          <p className="text-2xl font-bold text-text">
            {initialClients.reduce((sum, c) => sum + c._count.appointments, 0)}
          </p>
          <p className="text-xs text-text-muted">RDV total</p>
        </div>
      </div>

      {/* Liste clients */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">Aucun client trouvé.</p>
        )}

        {filtered.map((client) => {
          const isExpanded = expandedId === client.id;
          const initials = `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();

          return (
            <div
              key={client.id}
              className="rounded-2xl border border-border bg-surface shadow-card transition-all"
            >
              {/* Header client */}
              <button
                onClick={() => {
                  setExpandedId(isExpanded ? null : client.id);
                  setNoteText('');
                }}
                className="flex w-full cursor-pointer items-center gap-4 p-4 text-left sm:p-5"
              >
                {/* Avatar */}
                {client.avatarUrl ? (
                  <img
                    src={client.avatarUrl}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shrink-0">
                    {initials}
                  </div>
                )}

                {/* Infos */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-text">
                      {client.firstName} {client.lastName}
                    </span>
                    {client.clientNotes.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        <StickyNote size={10} className="mr-1" />
                        {client.clientNotes.length} note{client.clientNotes.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Mail size={10} /> {client.email}
                    </span>
                    {client.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={10} /> {client.phone}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-text-muted">
                    <span>{client._count.appointments} RDV</span>
                    {client.loyalty && (
                      <span className="flex items-center gap-1">
                        <Star size={10} className="text-warning" />
                        {client.loyalty.currentVisits}/8 fidélité
                      </span>
                    )}
                    <span>Client depuis {formatDate(client.createdAt)}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={18} className="text-text-muted" />
                  )}
                </div>
              </button>

              {/* Expanded: historique + notes */}
              {isExpanded && (
                <div className="border-t border-border px-4 py-4 sm:px-5">
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Derniers RDV */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-text flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        Derniers rendez-vous
                      </h3>
                      {client.appointments.length === 0 ? (
                        <p className="text-sm text-text-muted">Aucun rendez-vous.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {client.appointments.map((apt) => {
                            const st = STATUS_LABELS[apt.status];
                            return (
                              <div key={apt.id} className="rounded-xl bg-background p-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-text">
                                    {formatDate(apt.date)} · {apt.startTime}
                                  </span>
                                  <span className={cn('text-xs font-medium', st?.cls)}>
                                    {st?.label ?? apt.status}
                                  </span>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {apt.services.map((s, i) => (
                                    <span key={i} className="text-xs text-text-muted">
                                      {s.service.name}
                                      {i < apt.services.length - 1 ? ', ' : ''}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                                  {apt.stylist && <span>Avec {apt.stylist.firstName}</span>}
                                  <span className="font-medium text-text">
                                    {(apt.totalPrice / 100).toFixed(0)} €
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-text flex items-center gap-2">
                        <StickyNote size={14} className="text-warning" />
                        Notes internes
                      </h3>

                      {/* Ajouter une note */}
                      <div className="mb-3 flex gap-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          rows={2}
                          className="flex-1 rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          placeholder="Ajouter une note sur ce client..."
                        />
                        <Button
                          size="icon"
                          onClick={() => addNote(client.id)}
                          disabled={saving || !noteText.trim()}
                          className="cursor-pointer shrink-0 rounded-xl self-end"
                        >
                          <Send size={16} />
                        </Button>
                      </div>

                      {/* Liste des notes */}
                      {client.clientNotes.length === 0 ? (
                        <p className="text-sm text-text-muted">Aucune note pour ce client.</p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {client.clientNotes.map((note) => (
                            <div
                              key={note.id}
                              className="rounded-xl bg-warning/5 border border-warning/20 p-3"
                            >
                              <p className="text-sm text-text">{note.content}</p>
                              <p className="mt-1.5 flex items-center gap-1 text-[10px] text-text-muted">
                                <Clock size={10} />
                                {note.author.firstName} {note.author.lastName} ·{' '}
                                {formatDate(note.createdAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
