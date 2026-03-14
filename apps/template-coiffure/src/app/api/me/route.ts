import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { profileSchema } from '@/lib/validation';

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

/**
 * PATCH /api/me — Modifier le profil du client connecté.
 *
 * Body : { firstName, lastName, email, phone }
 */
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
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

    return NextResponse.json({ message: 'Compte supprimé' });
  } catch (error) {
    console.error('[DELETE /api/me] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
