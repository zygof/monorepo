'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Shield, ShieldOff } from 'lucide-react';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@marrynov/ui';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  bio?: string | null;
  specialities: string[];
  yearsExperience?: number | null;
  quote?: string | null;
  instagram?: string | null;
  imageUrl?: string | null;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  specialities: string;
  yearsExperience: string;
  quote: string;
  instagram: string;
  imageUrl: string;
  password: string;
};

const emptyForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'EMPLOYEE',
  bio: '',
  specialities: '',
  yearsExperience: '',
  quote: '',
  instagram: '',
  imageUrl: '',
  password: '',
};

export function TeamManager({ initialMembers }: { initialMembers: Member[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  function openCreate() {
    setEditingMember(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  }

  function openEdit(m: Member) {
    setEditingMember(m);
    setForm({
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phone ?? '',
      role: m.role,
      bio: m.bio ?? '',
      specialities: m.specialities.join(', '),
      yearsExperience: m.yearsExperience?.toString() ?? '',
      quote: m.quote ?? '',
      instagram: m.instagram ?? '',
      imageUrl: m.imageUrl ?? '',
      password: '',
    });
    setError('');
    setDialogOpen(true);
  }

  async function handleSave() {
    setError('');
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Prénom et nom requis');
      return;
    }
    if (!form.email.trim()) {
      setError('Email requis');
      return;
    }
    if (!editingMember && !form.password) {
      setError('Mot de passe requis pour un nouveau membre');
      return;
    }

    setSaving(true);
    const specialities = form.specialities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const body: Record<string, unknown> = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      role: form.role,
      bio: form.bio.trim() || null,
      specialities,
      yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : null,
      quote: form.quote.trim() || null,
      instagram: form.instagram.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
    };

    if (form.password) body.password = form.password;

    const url = editingMember ? `/api/admin/team/${editingMember.id}` : '/api/admin/team';
    const method = editingMember ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Erreur lors de la sauvegarde');
      setSaving(false);
      return;
    }

    setSaving(false);
    setDialogOpen(false);
    router.refresh();
  }

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN';
    await fetch(`/api/admin/team/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    router.refresh();
  }

  const filtered = initialMembers.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Rechercher un membre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs h-10 rounded-xl"
        />
        <Button onClick={openCreate} variant="default" size="default" className="rounded-xl gap-2">
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.length === 0 && (
          <p className="text-sm text-text-muted col-span-2 text-center py-8">
            Aucun membre trouvé.
          </p>
        )}
        {filtered.map((m) => (
          <div
            key={m.id}
            className="flex gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-md"
          >
            {/* Avatar */}
            <div className="shrink-0">
              {m.imageUrl ? (
                <img
                  src={m.imageUrl}
                  alt={`${m.firstName} ${m.lastName}`}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-light text-lg font-bold text-primary">
                  {m.firstName[0]}
                  {m.lastName[0]}
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-text truncate">
                  {m.firstName} {m.lastName}
                </h3>
                <Badge
                  variant={m.role === 'ADMIN' ? 'default' : 'secondary'}
                  className="text-[10px] shrink-0"
                >
                  {m.role === 'ADMIN' ? 'Admin' : 'Styliste'}
                </Badge>
              </div>
              <p className="text-xs text-text-muted truncate">{m.email}</p>

              {m.specialities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.specialities.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {m.yearsExperience && (
                <p className="mt-1 text-xs text-text-muted">
                  {m.yearsExperience} ans d&apos;expérience
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => openEdit(m)}
                className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary transition-colors"
                title="Modifier"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => toggleRole(m.id, m.role)}
                className={cn(
                  'cursor-pointer rounded-lg p-1.5 transition-colors',
                  m.role === 'ADMIN'
                    ? 'text-primary hover:bg-error/10 hover:text-error'
                    : 'text-text-muted hover:bg-primary-light hover:text-primary',
                )}
                title={m.role === 'ADMIN' ? 'Rétrograder en styliste' : 'Promouvoir admin'}
              >
                {m.role === 'ADMIN' ? <ShieldOff size={15} /> : <Shield size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingMember ? 'Modifier le membre' : 'Nouveau membre'}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {editingMember
                ? 'Modifiez les informations du membre.'
                : 'Ajoutez un styliste ou un administrateur.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            {error && (
              <p className="rounded-xl bg-error/5 px-3 py-2 text-sm text-error border border-error/20">
                {error}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Prénom *</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Marie-Laure"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Nom *</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="B."
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Email *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="marie-laure@salon.re"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Téléphone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="0692 XX XX XX"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Rôle</label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Styliste</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-text">
                  {editingMember ? 'Nouveau mot de passe' : 'Mot de passe *'}
                </label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder={editingMember ? 'Laisser vide si inchangé' : '••••••••'}
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Spécialiste des soins capillaires…"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text">
                Spécialités{' '}
                <span className="text-text-muted font-normal">(séparées par des virgules)</span>
              </label>
              <Input
                value={form.specialities}
                onChange={(e) => setForm((f) => ({ ...f, specialities: e.target.value }))}
                placeholder="Balayage, Coloration, Mèches"
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Expérience (ans)</label>
                <Input
                  type="number"
                  min="0"
                  value={form.yearsExperience}
                  onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))}
                  placeholder="10"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Citation</label>
                <Input
                  value={form.quote}
                  onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  placeholder="La coiffure est un art…"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Instagram</label>
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                  placeholder="https://instagram.com/…"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text">Photo URL</label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                placeholder="https://…"
                className="mt-1 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving} className="rounded-xl">
                {saving ? 'Enregistrement…' : editingMember ? 'Enregistrer' : 'Créer le membre'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
