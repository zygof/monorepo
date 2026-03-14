'use client';

import { Check } from 'lucide-react';
import { cn } from '@marrynov/ui';
import type { BookingStep } from '@/types/salon';

const BASE_STEPS = [
  { id: 1, label: 'Prestations' },
  { id: 2, label: 'Date & Styliste' },
  { id: 3, label: 'Coordonnées' },
] as const;

const PAYMENT_STEP = { id: 4, label: 'Paiement' } as const;

interface BookingStepperProps {
  step: BookingStep;
  showPaymentStep?: boolean;
}

export function BookingStepper({ step, showPaymentStep }: BookingStepperProps) {
  const steps = showPaymentStep ? [...BASE_STEPS, PAYMENT_STEP] : BASE_STEPS;
  const current = step === 'confirmed' ? steps.length + 1 : step;

  return (
    <nav aria-label="Étapes de réservation" className="py-8">
      <ol className="flex items-center">
        {steps.map((s, index) => {
          const isCompleted = current > s.id;
          const isActive = current === s.id;
          const isLast = index === steps.length - 1;

          return (
            <li key={s.id} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300',
                    isCompleted && 'bg-success text-white',
                    isActive &&
                      'bg-primary text-white shadow-[0_0_0_4px_rgba(var(--color-primary-rgb,107,33,30),0.15)]',
                    !isCompleted && !isActive && 'bg-primary-light text-text-muted',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? <Check size={16} aria-hidden="true" /> : s.id}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block transition-colors',
                    isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-text-muted',
                  )}
                >
                  {s.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    'mx-3 mb-4 h-0.5 flex-1 transition-colors duration-300',
                    isCompleted ? 'bg-success' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
