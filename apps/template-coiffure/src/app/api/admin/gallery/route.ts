import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const gallerySchema = z.object({
  imageUrl: z.string().url(),
  imageAlt: z.string().min(2),
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string(),
  stylistId: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

/** GET /api/admin/gallery — Toutes les photos (y compris inactives) */
export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const items = await db.galleryItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('[GET /api/admin/gallery] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** POST /api/admin/gallery — Ajouter une photo */
export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const result = gallerySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const item = await db.galleryItem.create({ data: result.data as never });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/gallery] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
