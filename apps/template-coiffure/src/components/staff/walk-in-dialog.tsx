'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  cn,
} from '@marrynov/ui';

interface WalkInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

interface ServiceOption {
  id: string;
  name: string;
  startingPrice: number;
  durationMin: number;
}

export function WalkInDialog({ open, onOpenChange, currentUserId }: WalkInDialogProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetch('/api/services')
        .then((r) => r.json())
        .then(setServices)
        .catch(() => {});
    }
  }, [open]);

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('Nom et prénom requis');
      return;
    }
    if (selectedServices.length === 0) {
      setError('Sélectionnez au moins une prestation');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/staff/walk-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        serviceIds: selectedServices,
        stylistId: currentUserId,
        notes: notes.trim() || undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Erreur lors de l'enregistrement");
      return;
    }

    // Reset et fermer
    setFirstName('');
    setLastName('');
    setPhone('');
    setNotes('');
    setSelectedServices([]);
    onOpenChange(false);
    router.refresh();
  }

  const totalPrice = services
    .filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.startingPrice, 0);

  const totalDuration = services
    .filter((s) => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.durationMin, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto rounded-2xl p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl font-bold text-text">
            <UserPlus size={20} className="text-primary" aria-hidden="true" />
            Client sans rendez-vous
          </DialogTitle>
          <DialogDescription className="text-sm text-text-muted">
            Enregistrer une cliente de passage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-error/5 px-3 py-2 text-sm text-error border border-error/20"
            >
              {error}
            </p>
          )}

          {/* Identité */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Prénom *</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Marie"
                className="h-11 rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Nom *</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Téléphone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0692 12 34 56"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Prestations */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text">Prestations *</label>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    selectedServices.includes(s.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-muted hover:border-primary/40 hover:text-text',
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Résumé */}
          {selectedServices.length > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-primary-light/50 px-4 py-2.5 text-sm">
              <span className="text-text-muted">
                {selectedServices.length} prestation{selectedServices.length > 1 ? 's' : ''} ·{' '}
                {totalDuration} min
              </span>
              <span className="font-bold text-text">{(totalPrice / 100).toFixed(0)} €</span>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Notes internes…"
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="w-full rounded-full py-3"
          >
            {loading ? 'Enregistrement…' : 'Enregistrer le walk-in'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
