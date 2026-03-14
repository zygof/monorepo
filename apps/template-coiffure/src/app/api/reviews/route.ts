import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/reviews — Avis clients publics (approuvés).
 *
 * Query params optionnels :
 *   ?limit=10   — nombre de résultats (défaut 20, max 50)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

    const reviews = await db.review.findMany({
      where: { visible: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        appointment: {
          select: {
            services: {
              select: {
                service: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[GET /api/reviews] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
