'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Save, User, LogOut, Trash2, CheckCircle } from 'lucide-react';
import { Button, cn } from '@marrynov/ui';
import { profileSchema, type ProfileFields } from '@/lib/validation';
import type { UserProfile } from '@/types/salon';

/* ── Styles ──────────────────────────────────────────────────────────── */

const INPUT_CLS =
  'h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

const LABEL_CLS = 'mb-1.5 block text-sm font-medium text-text';

const ERROR_CLS = 'mt-1 text-xs text-error';

/* ── Props ────────────────────────────────────────────────────────────── */

interface TabProfileProps {
  user: UserProfile;
}

export function TabProfile({ user }: TabProfileProps) {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
  });

  async function onSubmit(_data: ProfileFields) {
    // TODO (backend) : PUT /api/account/profile
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const memberDate = new Date(user.memberSince).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col gap-8">
      {/* ── Photo de profil ──────────────────────────── */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-text">Photo de profil</h2>
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border bg-primary-light">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User size={32} className="text-primary" />
              </div>
            )}
          </div>
          <div>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
              <Camera size={14} aria-hidden="true" />
              Changer la photo
            </Button>
            <p className="mt-2 text-xs text-text-muted">JPG ou PNG, max 2 Mo</p>
          </div>
        </div>
      </section>

      {/* ── Informations personnelles ────────────────── */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-6 font-serif text-lg font-bold text-text">Informations personnelles</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Prénom */}
            <div>
              <label htmlFor="profile-firstName" className={LABEL_CLS}>
                Prénom
              </label>
              <input
                id="profile-firstName"
                type="text"
                autoComplete="given-name"
                className={cn(INPUT_CLS, errors.firstName && 'border-error focus:ring-error/20')}
                {...register('firstName')}
              />
              {errors.firstName && <p className={ERROR_CLS}>{errors.firstName.message}</p>}
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="profile-lastName" className={LABEL_CLS}>
                Nom
              </label>
              <input
                id="profile-lastName"
                type="text"
                autoComplete="family-name"
                className={cn(INPUT_CLS, errors.lastName && 'border-error focus:ring-error/20')}
                {...register('lastName')}
              />
              {errors.lastName && <p className={ERROR_CLS}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="profile-email" className={LABEL_CLS}>
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              className={cn(INPUT_CLS, errors.email && 'border-error focus:ring-error/20')}
              {...register('email')}
            />
            {errors.email && <p className={ERROR_CLS}>{errors.email.message}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="profile-phone" className={LABEL_CLS}>
              Téléphone
            </label>
            <input
              id="profile-phone"
              type="tel"
              autoComplete="tel"
              className={cn(INPUT_CLS, errors.phone && 'border-error focus:ring-error/20')}
              {...register('phone')}
            />
            {errors.phone && <p className={ERROR_CLS}>{errors.phone.message}</p>}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="gap-1.5 rounded-full"
            >
              {isSubmitting ? (
                'Enregistrement...'
              ) : saved ? (
                <>
                  <CheckCircle size={16} aria-hidden="true" />
                  Enregistré
                </>
              ) : (
                <>
                  <Save size={16} aria-hidden="true" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-xs text-text-muted">Membre depuis {memberDate}</p>
      </section>

      {/* ── Sécurité ─────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-text">Sécurité</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">Mot de passe</p>
              <p className="text-xs text-text-muted">Modifié il y a 3 mois</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg">
              Changer le mot de passe
            </Button>
          </div>
        </div>
      </section>

      {/* ── Zone danger ──────────────────────────────── */}
      <section className="rounded-xl border border-error/20 bg-error/5 p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-text">Zone sensible</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg text-text-muted hover:text-text"
            >
              <LogOut size={14} aria-hidden="true" />
              Se déconnecter
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-lg text-error hover:text-error hover:bg-error/10"
            >
              <Trash2 size={14} aria-hidden="true" />
              Supprimer mon compte
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          La suppression de votre compte est irréversible. Toutes vos données seront effacées
          conformément à notre politique de confidentialité.
        </p>
      </section>
    </div>
  );
}
