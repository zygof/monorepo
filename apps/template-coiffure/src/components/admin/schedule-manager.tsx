'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Check } from 'lucide-react';
import { Button, Input, cn } from '@marrynov/ui';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

interface Slot {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
}

export function ScheduleManager({ initialSlots }: { initialSlots: Slot[] }) {
  const router = useRouter();
  const [slots, setSlots] = useState(initialSlots);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateSlot(dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) {
    setSlots((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, [field]: value || null } : s)),
    );
    setSaved(false);
  }

  function toggleClosed(dayOfWeek: number) {
    setSlots((prev) =>
      prev.map((s) =>
        s.dayOfWeek === dayOfWeek
          ? { ...s, openTime: s.openTime ? null : '09:00', closeTime: s.closeTime ? null : '18:00' }
          : s,
      ),
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/admin/schedule', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        slots.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          openTime: s.openTime,
          closeTime: s.closeTime,
        })),
      ),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="flex flex-col gap-4">
        {DAYS.map((day, i) => {
          const slot = slots.find((s) => s.dayOfWeek === i);
          const isClosed = !slot?.openTime;

          return (
            <div
              key={day}
              className={cn(
                'flex flex-wrap items-center gap-4 rounded-xl p-4 transition-colors',
                isClosed ? 'bg-error/5' : 'bg-background',
              )}
            >
              <span className="w-24 text-sm font-semibold text-text">{day}</span>

              {isClosed ? (
                <span className="text-sm text-error font-medium">Fermé</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot?.openTime ?? ''}
                    onChange={(e) => updateSlot(i, 'openTime', e.target.value)}
                    className="h-9 w-28 rounded-lg text-center text-sm"
                  />
                  <span className="text-text-muted">—</span>
                  <Input
                    type="time"
                    value={slot?.closeTime ?? ''}
                    onChange={(e) => updateSlot(i, 'closeTime', e.target.value)}
                    className="h-9 w-28 rounded-lg text-center text-sm"
                  />
                </div>
              )}

              <button
                onClick={() => toggleClosed(i)}
                className={cn(
                  'ml-auto rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  isClosed
                    ? 'bg-success/10 text-success hover:bg-success/20'
                    : 'bg-error/10 text-error hover:bg-error/20',
                )}
              >
                {isClosed ? 'Ouvrir' : 'Fermer'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="default"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full gap-2"
        >
          {saved ? (
            <>
              <Check size={16} aria-hidden="true" />
              Enregistré
            </>
          ) : (
            <>
              <Save size={16} aria-hidden="true" />
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
