'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  cn,
  toast,
} from '@marrynov/ui';

/* ── Zod schemas (partagés depuis lib/validation) ────────────────────── */

import {
  loginSchema,
  signupSchema,
  forgotSchema,
  type LoginFields,
  type SignupFields,
  type ForgotFields,
} from '@/lib/validation';

/* ── Types ───────────────────────────────────────────────────────────── */

export type AuthView = 'login' | 'signup' | 'forgot' | 'forgot-sent';

export interface AuthSuccessUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: 'login' | 'signup';
  /** Called after successful login/signup — use to pre-fill form fields */
  onSuccess?: (user: AuthSuccessUser) => void;
}

/* ── Shared style constants ──────────────────────────────────────────── */

const INPUT_CLS = 'h-11 rounded-xl bg-white border-border';
const INPUT_ERROR_CLS = 'border-error focus-visible:ring-error/30';

/* ── Sub-components ──────────────────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function OAuthSeparator() {
  return (
    <div className="relative flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-text-muted">ou</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-text',
        'transition-colors hover:bg-surface hover:border-text-muted/40',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      )}
    >
      <GoogleIcon />
      Continuer avec Google
    </button>
  );
}

interface PasswordInputProps {
  id: string;
  registration: ReturnType<ReturnType<typeof useForm>['register']>;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

function PasswordInput({
  id,
  registration,
  error,
  placeholder,
  autoComplete,
  className,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder ?? 'Mot de passe'}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(INPUT_CLS, 'pr-10', className, error && INPUT_ERROR_CLS)}
        {...registration}
      />
      <button
        type="button"
        onMouseDown={(e) => {
          // Prevent input from losing focus on click
          e.preventDefault();
          setShow((v) => !v);
        }}
        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-text-muted transition-colors hover:text-text focus-visible:outline-none"
      >
        {show ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
      </button>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
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

/* ── View: Login ─────────────────────────────────────────────────────── */

function LoginView({
  onForgot,
  onSignup,
  onSuccess,
}: {
  onForgot: () => void;
  onSignup: () => void;
  onSuccess: (user: AuthSuccessUser) => void;
}) {
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  async function onSubmit(data: LoginFields) {
    setGlobalError('');
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setGlobalError('Email ou mot de passe incorrect');
      toast.error('Connexion échouée', { description: 'Email ou mot de passe incorrect.' });
      return;
    }

    toast.success('Connexion réussie !');
    onSuccess({ email: data.email, firstName: '', lastName: '' });
  }

  return (
    <>
      <DialogHeader className="mb-5">
        <DialogTitle className="text-xl font-bold font-serif text-text">Se connecter</DialogTitle>
        <DialogDescription className="text-sm text-text-subtle">
          Accédez à votre espace client pour pré-remplir vos informations.
        </DialogDescription>
      </DialogHeader>

      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true' && (
        <>
          <GoogleButton onClick={() => signIn('google', { callbackUrl: '/' })} />
          <OAuthSeparator />
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {globalError && (
          <p
            role="alert"
            className="rounded-xl bg-error/5 px-3 py-2.5 text-sm text-error border border-error/20"
          >
            {globalError}
          </p>
        )}

        <Field id="login-email" label="Email" error={errors.email?.message}>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <Input
              id="login-email"
              type="email"
              placeholder="marie@exemple.re"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={cn(INPUT_CLS, 'pl-9', errors.email && INPUT_ERROR_CLS)}
              {...register('email')}
            />
          </div>
        </Field>

        <Field id="login-password" label="Mot de passe" error={errors.password?.message}>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10"
              aria-hidden="true"
            />
            <PasswordInput
              id="login-password"
              registration={register('password')}
              error={errors.password?.message}
              autoComplete="current-password"
              className="pl-9"
            />
          </div>
        </Field>

        <button
          type="button"
          onClick={onForgot}
          className="self-end text-xs text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Mot de passe oublié ?
        </button>

        <Button
          type="submit"
          variant="default"
          size="default"
          disabled={isSubmitting}
          className="w-full rounded-full py-3 mt-1"
        >
          {isSubmitting ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <p className="text-center text-sm text-text-subtle">
        Pas encore de compte ?{' '}
        <button
          type="button"
          onClick={onSignup}
          className="cursor-pointer font-medium text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
        >
          Créer un compte
        </button>
      </p>
    </>
  );
}

/* ── View: Signup ────────────────────────────────────────────────────── */

function SignupView({
  onLogin,
  onSuccess,
}: {
  onLogin: () => void;
  onSuccess: (user: AuthSuccessUser) => void;
}) {
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFields>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  async function onSubmit(data: SignupFields) {
    setGlobalError('');

    // 1. Créer le compte via l'API
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const errorMsg = body?.error ?? 'Une erreur est survenue';
      setGlobalError(errorMsg);
      toast.error('Inscription échouée', { description: errorMsg });
      return;
    }

    // 2. Connecter automatiquement après inscription
    const signInRes = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInRes?.error) {
      setGlobalError('Compte créé mais connexion échouée. Essayez de vous connecter.');
      toast.error('Connexion automatique échouée', {
        description: 'Votre compte a été créé. Connectez-vous manuellement.',
      });
      return;
    }

    toast.success('Bienvenue !', { description: 'Votre compte a été créé avec succès.' });
    onSuccess({ email: data.email, firstName: data.firstName, lastName: data.lastName });
  }

  return (
    <>
      <DialogHeader className="mb-5">
        <DialogTitle className="text-xl font-bold font-serif text-text">
          Créer un compte
        </DialogTitle>
        <DialogDescription className="text-sm text-text-subtle">
          Gérez vos rendez-vous et retrouvez votre historique en un clic.
        </DialogDescription>
      </DialogHeader>

      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true' && (
        <>
          <GoogleButton onClick={() => signIn('google', { callbackUrl: '/' })} />
          <OAuthSeparator />
        </>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {globalError && (
          <p
            role="alert"
            className="rounded-xl bg-error/5 px-3 py-2.5 text-sm text-error border border-error/20"
          >
            {globalError}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field id="signup-firstname" label="Prénom" error={errors.firstName?.message}>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <Input
                id="signup-firstname"
                type="text"
                placeholder="Marie"
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
                className={cn(INPUT_CLS, 'pl-9', errors.firstName && INPUT_ERROR_CLS)}
                {...register('firstName')}
              />
            </div>
          </Field>

          <Field id="signup-lastname" label="Nom" error={errors.lastName?.message}>
            <Input
              id="signup-lastname"
              type="text"
              placeholder="Dupont"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              className={cn(INPUT_CLS, errors.lastName && INPUT_ERROR_CLS)}
              {...register('lastName')}
            />
          </Field>
        </div>

        <Field id="signup-email" label="Email" error={errors.email?.message}>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <Input
              id="signup-email"
              type="email"
              placeholder="marie@exemple.re"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={cn(INPUT_CLS, 'pl-9', errors.email && INPUT_ERROR_CLS)}
              {...register('email')}
            />
          </div>
        </Field>

        <Field id="signup-password" label="Mot de passe" error={errors.password?.message}>
          <PasswordInput
            id="signup-password"
            registration={register('password')}
            error={errors.password?.message}
            autoComplete="new-password"
          />
          <p className="text-xs text-text-muted">8 caractères min · 1 majuscule · 1 chiffre</p>
        </Field>

        <Button
          type="submit"
          variant="default"
          size="default"
          disabled={isSubmitting}
          className="w-full rounded-full py-3 mt-1"
        >
          {isSubmitting ? 'Création du compte…' : 'Créer mon compte'}
        </Button>

        <p className="text-center text-xs text-text-muted">
          En créant un compte, vous acceptez nos{' '}
          <a
            href="/cgv"
            target="_blank"
            className="text-primary hover:underline underline-offset-2"
          >
            CGV
          </a>{' '}
          et notre{' '}
          <a
            href="/confidentialite"
            target="_blank"
            className="text-primary hover:underline underline-offset-2"
          >
            politique de confidentialité
          </a>
          .
        </p>
      </form>

      <p className="text-center text-sm text-text-subtle">
        Déjà un compte ?{' '}
        <button
          type="button"
          onClick={onLogin}
          className="cursor-pointer font-medium text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
        >
          Se connecter
        </button>
      </p>
    </>
  );
}

/* ── View: Forgot password ───────────────────────────────────────────── */

function ForgotView({ onBack, onSent }: { onBack: () => void; onSent: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFields>({
    resolver: zodResolver(forgotSchema),
    mode: 'onBlur',
  });

  async function onSubmit(data: ForgotFields) {
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email }),
    });
    // Toujours afficher "envoyé" (sécurité anti-énumération)
    onSent();
  }

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex cursor-pointer items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors focus-visible:outline-2 focus-visible:outline-primary"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Retour à la connexion
      </button>

      <DialogHeader className="mb-5">
        <DialogTitle className="text-xl font-bold font-serif text-text">
          Mot de passe oublié
        </DialogTitle>
        <DialogDescription className="text-sm text-text-subtle">
          Saisissez votre adresse email et nous vous enverrons un lien de réinitialisation.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Field id="forgot-email" label="Email" error={errors.email?.message}>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <Input
              id="forgot-email"
              type="email"
              placeholder="marie@exemple.re"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={cn(INPUT_CLS, 'pl-9', errors.email && INPUT_ERROR_CLS)}
              {...register('email')}
            />
          </div>
        </Field>

        <Button
          type="submit"
          variant="default"
          size="default"
          disabled={isSubmitting}
          className="w-full rounded-full py-3"
        >
          {isSubmitting ? 'Envoi…' : 'Envoyer le lien de réinitialisation'}
        </Button>
      </form>
    </>
  );
}

/* ── View: Forgot sent ───────────────────────────────────────────────── */

function ForgotSentView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 size={32} className="text-success" aria-hidden="true" />
      </div>
      <div>
        <p className="text-lg font-bold font-serif text-text">Email envoyé !</p>
        <p className="mt-2 text-sm text-text-subtle">
          Si un compte existe pour cette adresse, vous recevrez un lien de réinitialisation dans
          quelques minutes. Pensez à vérifier vos spams.
        </p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm font-medium text-primary hover:underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
      >
        ← Retour à la connexion
      </button>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */

export function AuthModal({
  open,
  onOpenChange,
  defaultView = 'login',
  onSuccess,
}: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView);

  function handleOpenChange(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(() => setView(defaultView), 200);
  }

  function handleSuccess(user: AuthSuccessUser) {
    onSuccess?.(user);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md gap-5 rounded-2xl p-6 sm:p-8">
        {view === 'login' && (
          <LoginView
            onForgot={() => setView('forgot')}
            onSignup={() => setView('signup')}
            onSuccess={handleSuccess}
          />
        )}
        {view === 'signup' && (
          <SignupView onLogin={() => setView('login')} onSuccess={handleSuccess} />
        )}
        {view === 'forgot' && (
          <ForgotView onBack={() => setView('login')} onSent={() => setView('forgot-sent')} />
        )}
        {view === 'forgot-sent' && <ForgotSentView onBack={() => setView('login')} />}
      </DialogContent>
    </Dialog>
  );
}
