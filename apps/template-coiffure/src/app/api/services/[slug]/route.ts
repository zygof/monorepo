import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/services/:slug — Détail d'un service par son slug.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const service = await db.service.findUnique({
      where: { slug, active: true },
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

    if (!service) {
      return NextResponse.json({ error: 'Service introuvable' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('[GET /api/services/:slug] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
