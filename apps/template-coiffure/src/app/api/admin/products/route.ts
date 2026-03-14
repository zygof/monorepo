import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const productSchema = z.object({
  name: z.string().trim().min(2),
  brand: z.string().trim().min(1),
  description: z.string().trim().min(10),
  price: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  badge: z.string().optional(),
  externalUrl: z.string().url().optional(),
  sortOrder: z.number().int().default(0),
});

/** GET /api/admin/products — Tous les produits */
export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const products = await db.product.findMany({ orderBy: [{ sortOrder: 'asc' }] });
    return NextResponse.json(products);
  } catch (error) {
    console.error('[GET /api/admin/products] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** POST /api/admin/products — Créer un produit */
export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const result = productSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const product = await db.product.create({ data: result.data });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/products] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
