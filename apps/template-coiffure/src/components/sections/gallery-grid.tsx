'use client';

import { useState, useId, useCallback } from 'react';
import Image from 'next/image';
import { cn, Dialog, DialogContent, DialogTitle } from '@marrynov/ui';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem, GalleryCategory } from '@/types/salon';
import { teamMembers } from '@/config/salon.config';

/* ── Onglets catégories ──────────────────────────────────────────────── */

interface Tab {
  id: GalleryCategory | 'all';
  label: string;
}

const TABS: Tab[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'balayage', label: 'Balayage' },
  { id: 'couleur', label: 'Couleur' },
  { id: 'coupe', label: 'Coupes' },
  { id: 'lissage', label: 'Lissage' },
  { id: 'extensions', label: 'Extensions' },
  { id: 'mariage', label: 'Mariage' },
  { id: 'soin', label: 'Soins' },
];

/* ── Props ────────────────────────────────────────────────────────────── */

interface GalleryGridProps {
  items: GalleryItem[];
}

/**
 * Grille galerie avec filtrage par catégorie et lightbox.
 * Client Component isolé — extrait de la page Server Component.
 */
export function GalleryGrid({ items }: GalleryGridProps) {
  const [activeTab, setActiveTab] = useState<GalleryCategory | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const tabListId = useId();

  const filtered =
    activeTab === 'all' ? items : items.filter((item) => item.category === activeTab);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filtered.length : null));
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null,
    );
  }, [filtered.length]);

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;
  const currentStylist = currentItem?.stylistId
    ? teamMembers.find((m) => m.id === currentItem.stylistId)
    : null;

  return (
    <>
      {/* ── Filtres ──────────────────────────────── */}
      <div className="mb-10 overflow-x-auto pb-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
        <div
          role="tablist"
          id={tabListId}
          aria-label="Filtrer par catégorie"
          className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count =
              tab.id === 'all' ? items.length : items.filter((i) => i.category === tab.id).length;
            if (count === 0 && tab.id !== 'all') return null;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-gal-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`tabpanel-gal-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'bg-primary text-white shadow-sm cursor-default'
                    : 'bg-surface border border-border text-text-subtle hover:border-primary hover:text-primary',
                )}
              >
                {tab.label}
                <span className="ml-1.5 text-xs opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grille Masonry-like ──────────────────── */}
      <div
        role="tabpanel"
        id={`tabpanel-gal-${activeTab}`}
        aria-labelledby={`tab-gal-${activeTab}`}
      >
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-text-muted">
            Aucune réalisation dans cette catégorie.
          </p>
        ) : (
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3" aria-label="Réalisations">
            {filtered.map((item, index) => (
              <li key={item.id} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  aria-label={`Voir ${item.title} en grand`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt}
                    width={800}
                    height={800}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/0 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="font-serif text-lg font-bold text-white">{item.title}</p>
                    {item.description && (
                      <p className="mt-1 text-sm text-white/80">{item.description}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Lightbox (Dialog) ────────────────────── */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent
          className="max-w-4xl gap-0 overflow-hidden rounded-2xl border border-border bg-surface p-0"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
          }}
        >
          <DialogTitle className="sr-only">{currentItem?.title ?? 'Image galerie'}</DialogTitle>

          {currentItem && (
            <div className="relative">
              {/* Image */}
              <div className="relative flex items-center justify-center bg-primary-light">
                <Image
                  src={currentItem.imageUrl}
                  alt={currentItem.imageAlt}
                  width={1200}
                  height={900}
                  className="max-h-[80vh] w-full object-contain"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              </div>

              {/* Nav précédent/suivant */}
              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Photo précédente"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface/80 text-text shadow-card backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Photo suivante"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface/80 text-text shadow-card backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Fermer (override du DialogClose par défaut) */}
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Fermer"
                className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface/80 text-text shadow-card backdrop-blur-sm transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <X size={20} />
              </button>

              {/* Info bar */}
              <div className="border-t border-border bg-surface px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-lg font-bold text-text">{currentItem.title}</p>
                    {currentItem.description && (
                      <p className="mt-1 text-sm text-text-subtle">{currentItem.description}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-right">
                    {currentStylist && (
                      <p className="text-sm text-text-subtle">
                        par{' '}
                        <span className="font-medium text-primary">
                          {currentStylist.name.split(' ')[0]}
                        </span>
                      </p>
                    )}
                    <span className="rounded-full border border-border bg-primary-light px-3 py-1 text-xs font-medium capitalize text-text-subtle">
                      {currentItem.category}
                    </span>
                  </div>
                </div>
                {/* Compteur */}
                <p className="mt-2 text-xs text-text-muted">
                  {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {filtered.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
