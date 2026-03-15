'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut } from 'next-auth/react';
import { Save, LogOut, Trash2, CheckCircle, Download } from 'lucide-react';
import { Button, cn, toast } from '@marrynov/ui';
import { profileSchema, type ProfileFields } from '@/lib/validation';
import type { UserProfile } from '@/types/salon';
import { ImageUpload } from '@/components/ui/image-upload';

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl ?? null);

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

  async function onSubmit(data: ProfileFields) {
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: user.email }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Erreur lors de la mise à jour');
      }

      setSaved(true);
      toast.success('Profil mis à jour !');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error('Impossible de mettre à jour le profil', {
        description: err instanceof Error ? err.message : 'Veuillez réessayer.',
      });
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/me', { method: 'DELETE' });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Erreur lors de la suppression');
      }

      toast.success('Compte supprimé', {
        description: 'Vos données ont été anonymisées. À bientôt !',
      });
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      toast.error('Impossible de supprimer le compte', {
        description: err instanceof Error ? err.message : 'Veuillez réessayer.',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleExportData() {
    try {
      const res = await fetch('/api/me/export');
      if (!res.ok) throw new Error("Erreur lors de l'export");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Données exportées !', {
        description: 'Le fichier a été téléchargé.',
      });
    } catch {
      toast.error("Impossible d'exporter vos données");
    }
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
        <ImageUpload
          value={avatarUrl}
          endpoint="avatarUpload"
          shape="circle"
          size={120}
          hint="JPG ou PNG, max 2 Mo"
          onChange={async (url) => {
            setAvatarUrl(url);
            // Sauvegarder l'avatar immédiatement
            await fetch('/api/me', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ avatarUrl: url }),
            });
          }}
          onRemove={async () => {
            setAvatarUrl(null);
            await fetch('/api/me', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ avatarUrl: null }),
            });
            toast.success('Photo supprimée');
          }}
        />
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

          {/* Email (lecture seule) */}
          <div>
            <label htmlFor="profile-email" className={LABEL_CLS}>
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              className={cn(INPUT_CLS, 'bg-background text-text-muted cursor-not-allowed')}
            />
            <p className="mt-1 text-xs text-text-muted">
              L&apos;adresse email ne peut pas être modifiée.
            </p>
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

      {/* ── Données personnelles (RGPD) ─────────────── */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-text">Mes données</h2>
        <p className="mb-4 text-sm text-text-subtle">
          Conformément au RGPD, vous pouvez exporter l&apos;ensemble de vos données personnelles.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg cursor-pointer"
          onClick={handleExportData}
        >
          <Download size={14} aria-hidden="true" />
          Exporter mes données
        </Button>
      </section>

      {/* ── Zone danger ──────────────────────────────── */}
      <section className="rounded-xl border border-error/20 bg-error/5 p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-text">Zone sensible</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg text-text-muted hover:text-text cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut size={14} aria-hidden="true" />
              Se déconnecter
            </Button>
          </div>
          <div>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 rounded-lg text-error hover:text-error hover:bg-error/10 cursor-pointer"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  <Trash2 size={14} aria-hidden="true" />
                  {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg cursor-pointer"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Annuler
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-lg text-error hover:text-error hover:bg-error/10 cursor-pointer"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={14} aria-hidden="true" />
                Supprimer mon compte
              </Button>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          La suppression est irréversible. Vos données seront anonymisées conformément au RGPD. Vos
          rendez-vous passés sont conservés de manière anonyme.
        </p>
      </section>
    </div>
  );
}
