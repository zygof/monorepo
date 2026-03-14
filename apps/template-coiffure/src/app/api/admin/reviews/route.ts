import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

/**
 * GET /api/admin/reviews — Tous les avis (y compris masqués).
 */
export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const reviews = await db.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { firstName: true, lastName: true, email: true } },
        appointment: {
          select: {
            date: true,
            services: { include: { service: { select: { name: true } } } },
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[GET /api/admin/reviews] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
