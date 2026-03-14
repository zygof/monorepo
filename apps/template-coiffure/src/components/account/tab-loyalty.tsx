'use client';

import { Trophy, Gift, Star, TrendingUp } from 'lucide-react';
import { cn } from '@marrynov/ui';
import type { LoyaltyInfo } from '@/types/salon';

interface TabLoyaltyProps {
  loyalty: LoyaltyInfo;
}

export function TabLoyalty({ loyalty }: TabLoyaltyProps) {
  const remaining = loyalty.targetVisits - loyalty.currentVisits;
  const progress = (loyalty.currentVisits / loyalty.targetVisits) * 100;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Progression ──────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
            <Trophy size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-text">Programme Fidélité</h2>
            <p className="text-sm text-text-subtle">
              Cumulez des visites et débloquez des récompenses
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-text">
              {loyalty.currentVisits}/{loyalty.targetVisits} visites
            </span>
            <span className="font-semibold text-primary">
              {loyalty.discount} à la {loyalty.targetVisits}e
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dots progress */}
        <div className="flex items-center justify-between gap-1">
          {Array.from({ length: loyalty.targetVisits }, (_, i) => {
            const isCompleted = i < loyalty.currentVisits;
            const isCurrent = i === loyalty.currentVisits;
            const isTarget = i === loyalty.targetVisits - 1;

            return (
              <div
                key={i}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all',
                  isCompleted && 'bg-primary text-white shadow-sm',
                  isCurrent &&
                    'border-2 border-dashed border-primary bg-primary-light text-primary',
                  !isCompleted &&
                    !isCurrent &&
                    'border border-border bg-background text-text-muted',
                  isTarget && !isCompleted && 'border-secondary bg-secondary/10 text-secondary',
                )}
                aria-label={
                  isCompleted
                    ? `Visite ${i + 1} complétée`
                    : isTarget
                      ? `Visite ${i + 1} — récompense`
                      : `Visite ${i + 1}`
                }
              >
                {isCompleted ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isTarget ? (
                  <Gift size={16} aria-hidden="true" />
                ) : (
                  i + 1
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-sm text-text-subtle">
          Plus que{' '}
          <strong className="text-primary">
            {remaining} visite{remaining > 1 ? 's' : ''}
          </strong>{' '}
          pour obtenir votre {loyalty.reward}.
        </p>
      </section>

      {/* ── Comment ça marche ────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-card">
        <h2 className="mb-6 font-serif text-xl font-bold text-text">Comment ça marche ?</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: <Star size={24} className="text-secondary" />,
              title: 'Cumulez',
              description: 'Chaque visite au salon vous rapproche de votre récompense.',
            },
            {
              icon: <Gift size={24} className="text-primary" />,
              title: 'Débloquez',
              description: `À la ${loyalty.targetVisits}e visite, profitez de ${loyalty.discount} sur la prestation de votre choix.`,
            },
            {
              icon: <TrendingUp size={24} className="text-success" />,
              title: 'Profitez',
              description: 'Votre compteur se réinitialise et un nouveau cycle commence.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-xl bg-background p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-sm">
                {step.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-text">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-subtle">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Historique récompenses ────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-card">
        <h2 className="mb-4 font-serif text-xl font-bold text-text">Mes récompenses</h2>
        <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center">
          <Gift size={32} className="mx-auto mb-3 text-text-muted" />
          <p className="text-sm text-text-muted">Vos récompenses débloquées apparaîtront ici.</p>
          <p className="mt-1 text-xs text-text-muted">
            Continuez à venir au salon pour débloquer votre première récompense !
          </p>
        </div>
      </section>
    </div>
  );
}
