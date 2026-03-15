'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import {
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
  toast,
} from '@marrynov/ui';
import { ImageUpload } from '@/components/ui/image-upload';

interface GalleryItem {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description?: string | null;
  category: string;
  sortOrder: number;
  active: boolean;
}

const CATEGORIES = [
  { value: 'BALAYAGE', label: 'Balayage' },
  { value: 'COULEUR', label: 'Couleur' },
  { value: 'COUPE', label: 'Coupe' },
  { value: 'LISSAGE', label: 'Lissage' },
  { value: 'EXTENSIONS', label: 'Extensions' },
  { value: 'MARIAGE', label: 'Mariage' },
  { value: 'SOIN', label: 'Soin' },
];

type FormData = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  description: string;
  category: string;
};

const emptyForm: FormData = {
  title: '',
  imageUrl: '',
  imageAlt: '',
  description: '',
  category: 'COUPE',
};

export function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  function openCreate() {
    setEditingItem(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditingItem(item);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      description: item.description ?? '',
      category: item.category,
    });
    setError('');
    setDialogOpen(true);
  }

  async function handleSave() {
    setError('');
    if (!form.title.trim()) {
      setError('Le titre est requis');
      return;
    }
    if (!form.imageUrl.trim()) {
      setError("L'URL de l'image est requise");
      return;
    }

    setSaving(true);
    const body = {
      title: form.title.trim(),
      imageUrl: form.imageUrl.trim(),
      imageAlt: form.imageAlt.trim() || form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
    };

    const url = editingItem ? `/api/admin/gallery/${editingItem.id}` : '/api/admin/gallery';
    const method = editingItem ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Erreur lors de la sauvegarde');
      toast.error('Erreur', { description: data?.error ?? 'Impossible de sauvegarder' });
      setSaving(false);
      return;
    }

    setSaving(false);
    setDialogOpen(false);
    toast.success(editingItem ? 'Photo modifiée' : 'Photo ajoutée à la galerie');
    router.refresh();
  }

  async function handleDelete() {
    if (!deletingItem) return;
    await fetch(`/api/admin/gallery/${deletingItem.id}`, { method: 'DELETE' });
    setDeleteOpen(false);
    setDeletingItem(null);
    toast.success('Photo supprimée');
    router.refresh();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  const filtered = initialItems.filter(
    (item) => filterCategory === 'ALL' || item.category === filterCategory,
  );

  const visibleCount = initialItems.filter((i) => i.active).length;

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 rounded-xl">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes ({initialItems.length})</SelectItem>
              {CATEGORIES.map((c) => {
                const count = initialItems.filter((i) => i.category === c.value).length;
                return (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label} ({count})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span className="text-sm text-text-muted">
            {visibleCount} visible{visibleCount > 1 ? 's' : ''} / {initialItems.length} total
          </span>
        </div>
        <Button onClick={openCreate} variant="default" size="default" className="rounded-xl gap-2">
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.length === 0 && (
          <p className="text-sm text-text-muted col-span-4 text-center py-8">
            Aucune photo trouvée.
          </p>
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            className={cn(
              'group relative overflow-hidden rounded-2xl border bg-surface shadow-card transition-all hover:shadow-md',
              item.active ? 'border-border' : 'border-error/20 opacity-50',
            )}
          >
            {/* Image */}
            <div className="aspect-square bg-background overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon size={32} className="text-border" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-sm font-medium text-text truncate">{item.title}</p>
              <p className="text-xs text-text-muted">
                {CATEGORIES.find((c) => c.value === item.category)?.label ?? item.category}
              </p>
            </div>

            {/* Overlay actions */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => openEdit(item)}
                className="cursor-pointer rounded-full bg-white p-2 text-primary shadow-md hover:bg-primary-light transition-colors"
                title="Modifier"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => toggleActive(item.id, item.active)}
                className="cursor-pointer rounded-full bg-white p-2 text-text shadow-md hover:bg-background transition-colors"
                title={item.active ? 'Masquer' : 'Afficher'}
              >
                {item.active ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => {
                  setDeletingItem(item);
                  setDeleteOpen(true);
                }}
                className="cursor-pointer rounded-full bg-white p-2 text-error shadow-md hover:bg-error/5 transition-colors"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingItem ? 'Modifier la photo' : 'Ajouter une photo'}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {editingItem
                ? 'Modifiez les informations.'
                : 'Uploadez une photo et renseignez les détails.'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            {error && (
              <p className="rounded-xl bg-error/5 px-3 py-2 text-sm text-error border border-error/20">
                {error}
              </p>
            )}

            <div>
              <label className="text-sm font-medium text-text mb-2 block">Image *</label>
              <ImageUpload
                value={form.imageUrl}
                endpoint="galleryUpload"
                shape="square"
                size={200}
                hint="JPG ou PNG, max 4 Mo"
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                onRemove={() => setForm((f) => ({ ...f, imageUrl: '' }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Titre *</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Balayage Caramel"
                  className="mt-1 rounded-xl"
                />
              </div>
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
            </div>

            <div>
              <label className="text-sm font-medium text-text">Texte alternatif</label>
              <Input
                value={form.imageAlt}
                onChange={(e) => setForm((f) => ({ ...f, imageAlt: e.target.value }))}
                placeholder="Description pour l'accessibilité"
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-text">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Technique utilisée, contexte…"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving} className="rounded-xl">
                {saving ? 'Enregistrement…' : editingItem ? 'Enregistrer' : 'Ajouter la photo'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Suppression */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-error">Supprimer la photo</DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              Êtes-vous sûr de vouloir supprimer <strong>{deletingItem?.title}</strong> ?
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
