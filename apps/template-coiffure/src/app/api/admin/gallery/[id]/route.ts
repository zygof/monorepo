import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const galleryUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  category: z
    .enum(['BALAYAGE', 'COULEUR', 'COUPE', 'LISSAGE', 'EXTENSIONS', 'MARIAGE', 'SOIN'])
    .optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

/** PATCH /api/admin/gallery/:id — Modifier une photo */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const result = galleryUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const item = await db.galleryItem.update({
      where: { id },
      data: result.data as never,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('[PATCH /api/admin/gallery/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** DELETE /api/admin/gallery/:id — Supprimer une photo */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    await db.galleryItem.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ message: 'Photo désactivée' });
  } catch (error) {
    console.error('[DELETE /api/admin/gallery/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
