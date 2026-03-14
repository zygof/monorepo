import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const updateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().min(10).optional(),
  startingPrice: z.number().int().min(0).optional(),
  durationMin: z.number().int().min(5).max(480).optional(),
  category: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),
  imageAlt: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  badge: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

/** PATCH /api/admin/services/:id — Modifier un service */
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

    const service = await db.service.update({
      where: { id },
      data: result.data as never,
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error('[PATCH /api/admin/services/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** DELETE /api/admin/services/:id — Désactiver un service (soft delete) */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    await db.service.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ message: 'Service désactivé' });
  } catch (error) {
    console.error('[DELETE /api/admin/services/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
