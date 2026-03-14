import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/team — Liste des membres de l'équipe (employés + admin).
 *
 * Retourne les profils publics des stylistes pour la page équipe.
 */
export async function GET() {
  try {
    const members = await db.user.findMany({
      where: {
        role: { in: ['EMPLOYEE', 'ADMIN'] },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        specialities: true,
        imageUrl: true,
        yearsExperience: true,
        quote: true,
        instagram: true,
        role: true,
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('[GET /api/team] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
