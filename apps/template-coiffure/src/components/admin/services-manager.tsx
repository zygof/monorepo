'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  Star as StarIcon,
  StarOff,
  GripVertical,
} from 'lucide-react';
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

interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  startingPrice: number;
  durationMin: number;
  featured: boolean;
  active: boolean;
  badge?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
}

const CATEGORIES = [
  { value: 'COUPE', label: 'Coupe' },
  { value: 'COLORATION', label: 'Coloration' },
  { value: 'SOIN', label: 'Soin' },
  { value: 'COIFFAGE', label: 'Coiffage' },
  { value: 'LISSAGE', label: 'Lissage' },
  { value: 'EXTENSIONS', label: 'Extensions' },
  { value: 'EVENEMENT', label: 'Événement' },
  { value: 'MARIAGE', label: 'Mariage' },
];

type FormData = {
  name: string;
  slug: string;
  description: string;
  category: string;
  startingPrice: string;
  durationMin: string;
  badge: string;
  imageUrl: string;
  featured: boolean;
};

const emptyForm: FormData = {
  name: '',
  slug: '',
  description: '',
  category: 'COUPE',
  startingPrice: '',
  durationMin: '',
  badge: '',
  imageUrl: '',
  featured: false,
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  function openCreate() {
    setEditingService(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  }

  function openEdit(s: Service) {
    setEditingService(s);
    setForm({
      name: s.name,
      slug: s.slug,
      description: s.description,
      category: s.category,
      startingPrice: (s.startingPrice / 100).toString(),
      durationMin: s.durationMin.toString(),
      badge: s.badge ?? '',
      imageUrl: s.imageUrl ?? '',
      featured: s.featured,
    });
    setError('');
    setDialogOpen(true);
  }

  function openDelete(s: Service) {
    setDeletingService(s);
    setDeleteOpen(true);
  }

  async function handleSave() {
    setError('');
    if (!form.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!form.startingPrice || isNaN(Number(form.startingPrice))) {
      setError('Prix invalide');
      return;
    }
    if (!form.durationMin || isNaN(Number(form.durationMin))) {
      setError('Durée invalide');
      return;
    }

    setSaving(true);
    const slug = form.slug || toSlug(form.name);
    const body = {
      name: form.name.trim(),
      slug,
      description: form.description.trim(),
      category: form.category,
      startingPrice: Math.round(Number(form.startingPrice) * 100),
      durationMin: Number(form.durationMin),
      badge: form.badge.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      featured: form.featured,
    };

    const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
    const method = editingService ? 'PATCH' : 'POST';

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

  async function handleDelete() {
    if (!deletingService) return;
    await fetch(`/api/admin/services/${deletingService.id}`, { method: 'DELETE' });
    setDeleteOpen(false);
    setDeletingService(null);
    router.refresh();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function toggleFeatured(id: string, featured: boolean) {
    await fetch(`/api/admin/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !featured }),
    });
    router.refresh();
  }

  const filtered = initialServices.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Rechercher un service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs h-10 rounded-xl"
        />
        <Button onClick={openCreate} variant="default" size="default" className="rounded-xl gap-2">
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
              <th className="px-4 py-3 w-8" />
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3 hidden sm:table-cell">Catégorie</th>
              <th className="px-4 py-3 text-right">Prix</th>
              <th className="px-4 py-3 hidden md:table-cell">Durée</th>
              <th className="px-4 py-3 text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  Aucun service trouvé.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr
                key={s.id}
                className={cn(
                  'border-b border-border last:border-0 transition-colors hover:bg-background',
                  !s.active && 'opacity-50',
                )}
              >
                <td className="px-4 py-3 text-text-muted">
                  <GripVertical size={14} className="cursor-grab" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={cn('font-medium', !s.active && 'line-through')}>{s.name}</span>
                    {s.badge && (
                      <Badge variant="secondary" className="text-[10px]">
                        {s.badge}
                      </Badge>
                    )}
                    {s.featured && (
                      <Badge variant="default" className="text-[10px]">
                        Vedette
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-text-muted">
                    {CATEGORIES.find((c) => c.value === s.category)?.label ?? s.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {(s.startingPrice / 100).toFixed(0)} €
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-text-muted">
                  {s.durationMin} min
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleFeatured(s.id, s.featured)}
                      className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-secondary-light hover:text-secondary transition-colors"
                      title={s.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                    >
                      {s.featured ? (
                        <StarIcon size={15} className="fill-current" />
                      ) : (
                        <StarOff size={15} />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(s)}
                      className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => toggleActive(s.id, s.active)}
                      className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-text transition-colors"
                      title={s.active ? 'Désactiver' : 'Activer'}
                    >
                      {s.active ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button
                      onClick={() => openDelete(s)}
                      className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-error/10 hover:text-error transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingService ? 'Modifier le service' : 'Nouveau service'}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {editingService
                ? 'Modifiez les informations du service.'
                : 'Ajoutez une nouvelle prestation au catalogue.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            {error && (
              <p className="rounded-xl bg-error/5 px-3 py-2 text-sm text-error border border-error/20">
                {error}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm font-medium text-text">Nom *</label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: editingService ? f.slug : toSlug(e.target.value),
                    }))
                  }
                  placeholder="Coupe & Brushing"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-sm font-medium text-text">Slug</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="coupe-brushing"
                  className="mt-1 rounded-xl text-text-muted"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Description du service…"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Catégorie *</label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-text">Prix (€) *</label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={form.startingPrice}
                  onChange={(e) => setForm((f) => ({ ...f, startingPrice: e.target.value }))}
                  placeholder="45"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Durée (min) *</label>
                <Input
                  type="number"
                  step="15"
                  min="15"
                  value={form.durationMin}
                  onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))}
                  placeholder="60"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Badge</label>
                <Input
                  value={form.badge}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  placeholder="Le plus demandé"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Image URL</label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://…"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="rounded border-border accent-primary"
              />
              <span className="text-sm font-medium text-text">Mettre en vedette</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving} className="rounded-xl">
                {saving ? 'Enregistrement…' : editingService ? 'Enregistrer' : 'Créer le service'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-error">
              Supprimer le service
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              Êtes-vous sûr de vouloir supprimer <strong>{deletingService?.name}</strong> ? Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl">
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="rounded-xl bg-error hover:bg-error/90"
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
