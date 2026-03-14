'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Check } from 'lucide-react';
import { Button, Input } from '@marrynov/ui';

const FIELDS = [
  { key: 'salon_name', label: 'Nom du salon' },
  { key: 'salon_address', label: 'Adresse' },
  { key: 'salon_city', label: 'Ville' },
  { key: 'salon_postal_code', label: 'Code postal' },
  { key: 'salon_phone', label: 'Téléphone' },
  { key: 'salon_email', label: 'Email' },
  { key: 'salon_instagram', label: 'Instagram' },
  { key: 'salon_facebook', label: 'Facebook' },
  { key: 'salon_tiktok', label: 'TikTok' },
  { key: 'salon_whatsapp', label: 'WhatsApp' },
];

export function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-medium text-text">{f.label}</label>
            <Input
              value={values[f.key] ?? ''}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.label}
              className="h-11 rounded-xl"
            />
          </div>
        ))}
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
