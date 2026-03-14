'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, BellOff, LogIn } from 'lucide-react';
import { cn } from '@marrynov/ui';
import type { BookingState, BookingAction, BookingContact } from '@/types/salon';
import { bookingContactSchema, type BookingContactInput } from '@/lib/validation';
import { AuthModal } from '@/components/auth/auth-modal';

/* ── Shared styles ───────────────────────────────────────────────────── */

const INPUT_CLASS =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
  'disabled:opacity-50';

const ERROR_CLS = 'mt-1 text-xs text-error';

/* ── Field wrapper ───────────────────────────────────────────────────── */

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden="true">
            {' '}
            *
          </span>
        )}
        {hint && <span className="ml-1 text-xs font-normal text-text-muted">({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className={ERROR_CLS}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Props ────────────────────────────────────────────────────────────── */

interface StepContactProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

export function StepContact({ state, dispatch }: StepContactProps) {
  const { contact } = state;
  const [authOpen, setAuthOpen] = useState(false);

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<BookingContactInput>({
    resolver: zodResolver(bookingContactSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      notes: contact.notes,
      smsNotif: contact.smsNotif,
      acceptCgv: contact.acceptCgv as true,
    },
  });

  // Sync react-hook-form → reducer on every change
  useEffect(() => {
    const subscription = watch((values) => {
      const fields: (keyof BookingContact)[] = ['firstName', 'lastName', 'email', 'phone', 'notes'];
      for (const field of fields) {
        const val = values[field];
        if (typeof val === 'string' && val !== contact[field]) {
          dispatch({ type: 'SET_CONTACT_FIELD', field, value: val });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch, contact]);

  function set(field: keyof BookingContact, value: string | boolean) {
    dispatch({ type: 'SET_CONTACT_FIELD', field, value });
    if (field === 'smsNotif' || field === 'acceptCgv') {
      setValue(field as 'smsNotif' | 'acceptCgv', value as boolean);
    }
  }

  function handleAuthSuccess({
    email,
    firstName,
    lastName,
  }: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    if (email) {
      setValue('email', email);
      dispatch({ type: 'SET_CONTACT_FIELD', field: 'email', value: email });
    }
    if (firstName) {
      setValue('firstName', firstName);
      dispatch({ type: 'SET_CONTACT_FIELD', field: 'firstName', value: firstName });
    }
    if (lastName) {
      setValue('lastName', lastName);
      dispatch({ type: 'SET_CONTACT_FIELD', field: 'lastName', value: lastName });
    }
    // Trigger validation after pre-fill
    void trigger();
  }

  return (
    <section aria-labelledby="step-contact-heading">
      <h2 id="step-contact-heading" className="mb-1 text-2xl font-bold text-text font-serif">
        Vos coordonnées
      </h2>
      <p className="mb-6 text-sm text-text-subtle">
        Ces informations permettent au salon de confirmer votre rendez-vous et de vous contacter si
        besoin.
      </p>

      {/* TODO (auth) : masquer ce bloc et afficher le nom de l'utilisateur si session next-auth active */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <LogIn size={15} className="text-text-muted" aria-hidden="true" />
          <p className="text-sm text-text-subtle">Vous avez déjà un compte ?</p>
        </div>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="cursor-pointer text-sm font-medium text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Se connecter →
        </button>
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultView="login"
        onSuccess={handleAuthSuccess}
      />

      <form noValidate onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Prénom */}
          <Field id="firstName" label="Prénom" required error={errors.firstName?.message}>
            <input
              id="firstName"
              type="text"
              placeholder="Marie"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              className={cn(INPUT_CLASS, errors.firstName && 'border-error ring-error/20')}
              {...register('firstName')}
            />
          </Field>

          {/* Nom */}
          <Field id="lastName" label="Nom" required error={errors.lastName?.message}>
            <input
              id="lastName"
              type="text"
              placeholder="Dupont"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              className={cn(INPUT_CLASS, errors.lastName && 'border-error ring-error/20')}
              {...register('lastName')}
            />
          </Field>

          {/* Email */}
          <div className="sm:col-span-2">
            <Field id="email" label="Email" required error={errors.email?.message}>
              <input
                id="email"
                type="email"
                placeholder="marie@exemple.re"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={cn(INPUT_CLASS, errors.email && 'border-error ring-error/20')}
                {...register('email')}
              />
            </Field>
          </div>

          {/* Téléphone */}
          <div className="sm:col-span-2">
            <Field
              id="phone"
              label="Téléphone"
              required
              error={errors.phone?.message}
              hint="ex: 0692 12 34 56"
            >
              <input
                id="phone"
                type="tel"
                placeholder="0692 12 34 56"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={cn(INPUT_CLASS, errors.phone && 'border-error ring-error/20')}
                {...register('phone')}
              />
            </Field>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <Field id="notes" label="Message ou demande particulière" error={errors.notes?.message}>
            <textarea
              id="notes"
              placeholder="Allergies, longueur souhaitée, occasion spéciale…"
              rows={3}
              autoComplete="off"
              className={cn(INPUT_CLASS, 'resize-none')}
              {...register('notes')}
            />
          </Field>
        </div>

        {/* SMS notification toggle */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4">
          <div className="flex items-center gap-3">
            {contact.smsNotif ? (
              <Bell size={18} className="text-primary" aria-hidden="true" />
            ) : (
              <BellOff size={18} className="text-text-muted" aria-hidden="true" />
            )}
            <div>
              <p className="text-sm font-medium text-text">Rappel par SMS</p>
              <p className="text-xs text-text-muted">
                Recevez un rappel 24h avant votre rendez-vous
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={contact.smsNotif}
            onClick={() => set('smsNotif', !contact.smsNotif)}
            className={cn(
              'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              contact.smsNotif ? 'bg-primary' : 'bg-border',
            )}
            aria-label="Activer les rappels SMS"
          >
            <span
              className={cn(
                'pointer-events-none h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200',
                contact.smsNotif ? 'translate-x-5' : 'translate-x-0',
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* CGV checkbox */}
        <div className="mt-5">
          <label className="flex cursor-pointer items-start gap-3">
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                contact.acceptCgv ? 'border-primary bg-primary' : 'border-border bg-white',
                errors.acceptCgv && !contact.acceptCgv && 'border-error',
              )}
              aria-hidden="true"
            >
              {contact.acceptCgv && (
                <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3" aria-hidden="true">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={contact.acceptCgv}
              onChange={(e) => set('acceptCgv', e.target.checked)}
              className="sr-only"
              aria-required="true"
            />
            <span className="text-sm text-text-subtle">
              J&apos;accepte les{' '}
              <a
                href="/cgv"
                target="_blank"
                className="text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
              >
                conditions générales de vente
              </a>{' '}
              et la{' '}
              <a
                href="/confidentialite"
                target="_blank"
                className="text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
              >
                politique de confidentialité
              </a>
              .{' '}
              <span className="text-error" aria-hidden="true">
                *
              </span>
            </span>
          </label>
          {errors.acceptCgv && !contact.acceptCgv && (
            <p role="alert" className="mt-1 text-xs text-error">
              {errors.acceptCgv.message}
            </p>
          )}
        </div>

        <p className="mt-3 text-xs text-text-muted">
          <span className="text-error" aria-hidden="true">
            *
          </span>{' '}
          Champs obligatoires
        </p>
      </form>
    </section>
  );
}
