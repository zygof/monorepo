import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/products — Liste des produits disponibles.
 */
export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        brand: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('[GET /api/products] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
