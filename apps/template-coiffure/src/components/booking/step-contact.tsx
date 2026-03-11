'use client';

import { useState } from 'react';
import { Bell, BellOff, LogIn } from 'lucide-react';
import { cn } from '@marrynov/ui';
import type { BookingState, BookingAction, BookingContact } from '@/types/salon';
import { AuthModal } from '@/components/auth/auth-modal';

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
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
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

const INPUT_CLASS =
  'w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
  'disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-error/20';

interface StepContactProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

type ContactTextField = Extract<
  keyof BookingContact,
  'firstName' | 'lastName' | 'email' | 'phone' | 'notes'
>;

export function StepContact({ state, dispatch }: StepContactProps) {
  const { contact } = state;
  const [authOpen, setAuthOpen] = useState(false);

  function set(field: keyof BookingContact, value: string | boolean) {
    dispatch({ type: 'SET_CONTACT_FIELD', field, value });
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
    // TODO (auth) : récupérer le profil complet depuis la session next-auth
    if (email) set('email', email);
    if (firstName) set('firstName', firstName);
    if (lastName) set('lastName', lastName);
  }

  const emailInvalid = contact.email !== '' && !contact.email.includes('@');
  const phoneInvalid = contact.phone !== '' && contact.phone.replace(/\D/g, '').length < 8;

  const fields: Array<{
    id: ContactTextField;
    label: string;
    type: string;
    placeholder: string;
    autoComplete: string;
    required: boolean;
    error?: string;
    className?: string;
  }> = [
    {
      id: 'firstName',
      label: 'Prénom',
      type: 'text',
      placeholder: 'Marie',
      autoComplete: 'given-name',
      required: true,
    },
    {
      id: 'lastName',
      label: 'Nom',
      type: 'text',
      placeholder: 'Dupont',
      autoComplete: 'family-name',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'marie@exemple.re',
      autoComplete: 'email',
      required: true,
      error: emailInvalid ? 'Adresse email invalide' : undefined,
      className: 'sm:col-span-2',
    },
    {
      id: 'phone',
      label: 'Téléphone',
      type: 'tel',
      placeholder: '0692 XX XX XX',
      autoComplete: 'tel',
      required: true,
      error: phoneInvalid ? 'Numéro de téléphone invalide' : undefined,
      className: 'sm:col-span-2',
    },
  ];

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
          className="text-sm font-medium text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          {fields.map((f) => (
            <div key={f.id} className={f.className}>
              <Field id={f.id} label={f.label} required={f.required} error={f.error}>
                <input
                  id={f.id}
                  type={f.type}
                  value={contact[f.id]}
                  onChange={(e) => set(f.id, e.target.value)}
                  placeholder={f.placeholder}
                  autoComplete={f.autoComplete}
                  required={f.required}
                  aria-invalid={!!f.error}
                  aria-describedby={f.error ? `${f.id}-error` : undefined}
                  className={cn(INPUT_CLASS, f.error && 'border-error')}
                />
              </Field>
            </div>
          ))}

          {/* Notes */}
          <div className="sm:col-span-2">
            <Field id="notes" label="Message ou demande particulière" required={false}>
              <textarea
                id="notes"
                value={contact.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Allergies, longueur souhaitée, occasion spéciale…"
                rows={3}
                autoComplete="off"
                className={cn(INPUT_CLASS, 'resize-none')}
              />
            </Field>
          </div>
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
              'relative h-6 w-11 rounded-full transition-colors duration-200',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              contact.smsNotif ? 'bg-primary' : 'bg-border',
            )}
            aria-label="Activer les rappels SMS"
          >
            <span
              className={cn(
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                contact.smsNotif ? 'translate-x-5.5' : 'translate-x-0.5',
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
