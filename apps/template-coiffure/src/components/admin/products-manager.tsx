'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  cn,
} from '@marrynov/ui';

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  badge?: string | null;
  imageUrl?: string | null;
  externalUrl?: string | null;
  active: boolean;
}

type FormData = {
  name: string;
  brand: string;
  description: string;
  price: string;
  badge: string;
  imageUrl: string;
  externalUrl: string;
};

const emptyForm: FormData = {
  name: '',
  brand: '',
  description: '',
  price: '',
  badge: '',
  imageUrl: '',
  externalUrl: '',
};

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  function openCreate() {
    setEditingProduct(null);
    setForm(emptyForm);
    setError('');
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditingProduct(p);
    setForm({
      name: p.name,
      brand: p.brand,
      description: p.description,
      price: (p.price / 100).toString(),
      badge: p.badge ?? '',
      imageUrl: p.imageUrl ?? '',
      externalUrl: p.externalUrl ?? '',
    });
    setError('');
    setDialogOpen(true);
  }

  async function handleSave() {
    setError('');
    if (!form.name.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!form.brand.trim()) {
      setError('La marque est requise');
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      setError('Prix invalide');
      return;
    }

    setSaving(true);
    const body = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
      price: Math.round(Number(form.price) * 100),
      badge: form.badge.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      externalUrl: form.externalUrl.trim() || null,
    };

    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = editingProduct ? 'PATCH' : 'POST';

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
    if (!deletingProduct) return;
    await fetch(`/api/admin/products/${deletingProduct.id}`, { method: 'DELETE' });
    setDeleteOpen(false);
    setDeletingProduct(null);
    router.refresh();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  const filtered = initialProducts.filter((p) =>
    `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs h-10 rounded-xl"
        />
        <Button onClick={openCreate} variant="default" size="default" className="rounded-xl gap-2">
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      {/* Grid produits */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="text-sm text-text-muted col-span-3 text-center py-8">
            Aucun produit trouvé.
          </p>
        )}
        {filtered.map((p) => (
          <div
            key={p.id}
            className={cn(
              'rounded-2xl border border-border bg-surface shadow-card overflow-hidden transition-shadow hover:shadow-md',
              !p.active && 'opacity-50',
            )}
          >
            {/* Image */}
            {p.imageUrl && (
              <div className="aspect-square bg-background">
                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={cn('font-medium text-text', !p.active && 'line-through')}>
                    {p.name}
                  </h3>
                  <p className="text-xs text-text-muted">{p.brand}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">
                    {(p.price / 100).toFixed(0)} €
                  </span>
                  {p.badge && (
                    <Badge variant="secondary" className="text-[10px]">
                      {p.badge}
                    </Badge>
                  )}
                </div>
              </div>

              {p.description && (
                <p className="mt-2 text-xs text-text-muted line-clamp-2">{p.description}</p>
              )}

              <div className="mt-3 flex items-center justify-end gap-1">
                <button
                  onClick={() => openEdit(p)}
                  className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary transition-colors"
                  title="Modifier"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => toggleActive(p.id, p.active)}
                  className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-text transition-colors"
                  title={p.active ? 'Désactiver' : 'Activer'}
                >
                  {p.active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => {
                    setDeletingProduct(p);
                    setDeleteOpen(true);
                  }}
                  className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-error/10 hover:text-error transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              {editingProduct
                ? 'Modifiez les informations du produit.'
                : 'Ajoutez un produit à votre boutique.'}
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
                <label className="text-sm font-medium text-text">Nom *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Huile de Ricin"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Marque *</label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  placeholder="Kérastase"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Description du produit…"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Prix (€) *</label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="18"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Badge</label>
                <Input
                  value={form.badge}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  placeholder="Best-seller"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-text">Image URL</label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://…"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Lien externe</label>
                <Input
                  value={form.externalUrl}
                  onChange={(e) => setForm((f) => ({ ...f, externalUrl: e.target.value }))}
                  placeholder="https://shop.exemple.re/…"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving} className="rounded-xl">
                {saving ? 'Enregistrement…' : editingProduct ? 'Enregistrer' : 'Créer le produit'}
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
              Supprimer le produit
            </DialogTitle>
            <DialogDescription className="text-sm text-text-muted">
              Êtes-vous sûr de vouloir supprimer <strong>{deletingProduct?.name}</strong> ?
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
