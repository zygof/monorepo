import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/gallery — Galerie photo du salon.
 *
 * Query params optionnels :
 *   ?category=BALAYAGE  — filtrer par catégorie
 *   ?limit=12           — nombre de résultats (défaut 50)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);

    const items = await db.galleryItem.findMany({
      where: {
        active: true,
        ...(category ? { category: category as never } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      select: {
        id: true,
        imageUrl: true,
        imageAlt: true,
        category: true,
        title: true,
        description: true,
        stylistId: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('[GET /api/gallery] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
