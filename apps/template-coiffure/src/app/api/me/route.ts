import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { profileSchema } from '@/lib/validation';
import { sendAccountDeletionConfirmation } from '@/lib/emails';

/**
 * GET /api/me — Profil du client connecté.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[GET /api/me] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** Schema pour la mise à jour d'avatar uniquement */
const avatarSchema = z.object({
  avatarUrl: z.string().url().nullable(),
});

/**
 * PATCH /api/me — Modifier le profil du client connecté.
 *
 * Accepte deux types de body :
 *   - Profil complet : { firstName, lastName, email, phone }
 *   - Avatar seul : { avatarUrl: "https://..." | null }
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();

    // Déterminer le type de mise à jour
    if ('avatarUrl' in body && Object.keys(body).length === 1) {
      // Mise à jour avatar uniquement
      const result = avatarSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: 'URL invalide' }, { status: 400 });
      }

      const updated = await db.user.update({
        where: { id: session.user.id },
        data: { avatarUrl: result.data.avatarUrl },
        select: { id: true, avatarUrl: true },
      });
      return NextResponse.json(updated);
    }

    // Mise à jour profil complet
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, phone } = result.data;

    // Vérifier unicité email si changé
    if (email !== session.user.email) {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée' },
          { status: 409 },
        );
      }
    }

    const updated = await db.user.update({
      where: { id: session.user.id },
      data: { firstName, lastName, email, phone },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/me] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * DELETE /api/me — Supprimer le compte client.
 *
 * Seuls les clients peuvent supprimer leur propre compte.
 * Les employés et admins doivent être supprimés via l'admin.
 */
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Empêcher la suppression des comptes staff/admin
    if (session.user.role === 'EMPLOYEE' || session.user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Les comptes employés/admin ne peuvent pas être supprimés via cette route' },
        { status: 403 },
      );
    }

    // Récupérer les infos avant anonymisation (pour l'email de confirmation)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, email: true },
    });

    // Anonymiser les données liées plutôt que supprimer (RGPD + intégrité FK)
    await db.$transaction([
      db.user.update({
        where: { id: session.user.id },
        data: {
          email: `deleted-${session.user.id}@anonymized.local`,
          firstName: 'Compte',
          lastName: 'Supprimé',
          phone: null,
          avatarUrl: null,
          passwordHash: null,
        },
      }),
      db.account.deleteMany({ where: { userId: session.user.id } }),
    ]);

    // Email de confirmation de suppression (non-bloquant)
    if (user) {
      sendAccountDeletionConfirmation({
        firstName: user.firstName,
        email: user.email,
        salonName: process.env.NEXT_PUBLIC_SALON_NAME,
      }).catch(() => {});
    }

    return NextResponse.json({ message: 'Compte supprimé' });
  } catch (error) {
    console.error('[DELETE /api/me] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
