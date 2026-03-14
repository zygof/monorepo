import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const serviceSchema = z.object({
  slug: z.string().trim().min(2).max(100),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10),
  startingPrice: z.number().int().min(0),
  durationMin: z.number().int().min(5).max(480),
  category: z.string(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  featured: z.boolean().default(false),
  badge: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

/** GET /api/admin/services — Liste complète (y compris inactifs) */
export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const services = await db.service.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('[GET /api/admin/services] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** POST /api/admin/services — Créer un service */
export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const result = serviceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const service = await db.service.create({ data: result.data as never });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/services] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
