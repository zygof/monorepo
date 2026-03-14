import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const updateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  brand: z.string().trim().min(1).optional(),
  description: z.string().trim().min(10).optional(),
  price: z.number().int().min(0).optional(),
  imageUrl: z.string().url().nullable().optional(),
  badge: z.string().nullable().optional(),
  externalUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

/** PATCH /api/admin/products/:id */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const product = await db.product.update({ where: { id }, data: result.data as never });
    return NextResponse.json(product);
  } catch (error) {
    console.error('[PATCH /api/admin/products/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** DELETE /api/admin/products/:id — Soft delete */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    await db.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ message: 'Produit désactivé' });
  } catch (error) {
    console.error('[DELETE /api/admin/products/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
