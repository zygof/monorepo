import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/services — Liste des services actifs du salon.
 *
 * Query params optionnels :
 *   ?category=COUPE    — filtrer par catégorie
 *   ?featured=true     — uniquement les services mis en avant
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const services = await db.service.findMany({
      where: {
        active: true,
        ...(category ? { category: category as never } : {}),
        ...(featured === 'true' ? { featured: true } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        startingPrice: true,
        imageUrl: true,
        imageAlt: true,
        featured: true,
        badge: true,
        durationMin: true,
        category: true,
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('[GET /api/services] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
