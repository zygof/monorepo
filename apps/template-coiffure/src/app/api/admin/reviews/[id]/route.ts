import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

/**
 * PATCH /api/admin/reviews/:id — Modérer un avis (masquer/afficher).
 *
 * Body : { visible: true/false }
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    if (typeof body.visible !== 'boolean') {
      return NextResponse.json({ error: 'Champ visible (boolean) requis' }, { status: 400 });
    }

    const review = await db.review.update({
      where: { id },
      data: { visible: body.visible },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('[PATCH /api/admin/reviews/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
