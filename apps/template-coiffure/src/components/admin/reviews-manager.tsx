'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Eye, EyeOff, Filter } from 'lucide-react';
import { Badge, cn } from '@marrynov/ui';

interface Review {
  id: string;
  rating: number;
  comment: string;
  visible: boolean;
  createdAt: string;
  author: { firstName: string; lastName: string; email: string };
  appointment: {
    date: string;
    services: Array<{ service: { name: string } }>;
    stylist?: { firstName: string } | null;
  };
}

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  async function toggleVisible(id: string, visible: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !visible }),
    });
    router.refresh();
  }

  const filtered = initialReviews.filter((r) => {
    if (filter === 'visible') return r.visible;
    if (filter === 'hidden') return !r.visible;
    return true;
  });

  const avgRating = initialReviews.length
    ? (initialReviews.reduce((sum, r) => sum + r.rating, 0) / initialReviews.length).toFixed(1)
    : '—';
  const visibleCount = initialReviews.filter((r) => r.visible).length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: initialReviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <>
      {/* Stats résumé */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-3xl font-bold text-warning">{avgRating}</p>
          <p className="text-xs text-text-muted">Note moyenne</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-3xl font-bold text-text">{initialReviews.length}</p>
          <p className="text-xs text-text-muted">Total avis</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-3xl font-bold text-success">{visibleCount}</p>
          <p className="text-xs text-text-muted">Visibles</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-col gap-1">
            {ratingDistribution.map((d) => (
              <div key={d.rating} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-right font-medium">{d.rating}</span>
                <Star size={10} className="fill-warning text-warning shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-border">
                  <div
                    className="h-1.5 rounded-full bg-warning"
                    style={{
                      width: initialReviews.length
                        ? `${(d.count / initialReviews.length) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
                <span className="w-4 text-right text-text-muted">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtre */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={14} className="text-text-muted" />
        {(['all', 'visible', 'hidden'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filter === f
                ? 'bg-primary text-white'
                : 'bg-background text-text-muted hover:bg-primary-light hover:text-primary',
            )}
          >
            {f === 'all' ? 'Tous' : f === 'visible' ? 'Visibles' : 'Masqués'}
          </button>
        ))}
      </div>

      {/* Liste avis */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-text-muted">
            Aucun avis dans cette catégorie.
          </p>
        )}
        {filtered.map((r) => (
          <div
            key={r.id}
            className={cn(
              'rounded-2xl border bg-surface p-5 shadow-card transition-all',
              r.visible ? 'border-border' : 'border-error/20 opacity-70',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-text">
                    {r.author.firstName} {r.author.lastName}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < r.rating ? 'fill-warning text-warning' : 'text-border'}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <Badge variant={r.visible ? 'secondary' : 'destructive'} className="text-[10px]">
                    {r.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  {r.author.email} · {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                  {r.appointment.stylist && ` · Styliste : ${r.appointment.stylist.firstName}`}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {r.appointment.services.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary"
                    >
                      {s.service.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toggleVisible(r.id, r.visible)}
                className={cn(
                  'cursor-pointer shrink-0 rounded-xl p-2.5 transition-colors',
                  r.visible ? 'text-success hover:bg-success/10' : 'text-error hover:bg-error/10',
                )}
                title={r.visible ? 'Masquer cet avis' : 'Rendre visible'}
              >
                {r.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <p className="mt-3 text-sm text-text leading-relaxed">{r.comment}</p>
          </div>
        ))}
      </div>
    </>
  );
}
