'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import { Button, Input, cn } from '@marrynov/ui';
import { z } from 'zod';

const schema = z.object({
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
});

type Fields = z.infer<typeof schema>;

const INPUT_CLS = 'h-11 rounded-xl bg-white border-border';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <p className="text-text-muted">Chargement…</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: Fields) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, password: data.password }),
    });

    if (res.ok) {
      setStatus('success');
    } else {
      const body = await res.json().catch(() => null);
      setErrorMessage(body?.error ?? 'Une erreur est survenue');
      setStatus('error');
    }
  }

  if (!token || !email) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-text-muted">
            Lien invalide. Veuillez refaire une demande de réinitialisation.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </main>
    );
  }

  if (status === 'success') {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 size={32} className="text-success" />
          </div>
          <p className="text-lg font-bold font-serif text-text">Mot de passe mis à jour !</p>
          <p className="text-sm text-text-subtle">
            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </p>
          <a
            href="/?auth=login"
            className="mt-2 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Se connecter
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-xl font-bold font-serif text-text">Nouveau mot de passe</h1>
        <p className="mt-2 text-sm text-text-subtle">
          Choisissez un nouveau mot de passe sécurisé.
        </p>

        {status === 'error' && (
          <p className="mt-4 rounded-xl bg-error/5 px-3 py-2.5 text-sm text-error border border-error/20">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-password" className="text-sm font-medium text-text">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10"
              />
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className={cn(
                  INPUT_CLS,
                  'pl-9 pr-10',
                  errors.password && 'border-error focus-visible:ring-error/30',
                )}
                {...register('password')}
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowPassword((v) => !v);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-text-muted hover:text-text"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
            <p className="text-xs text-text-muted">8 caractères min · 1 majuscule · 1 chiffre</p>
          </div>

          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={isSubmitting}
            className="w-full rounded-full py-3 mt-2"
          >
            {isSubmitting ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
          </Button>
        </form>
      </div>
    </main>
  );
}
