import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const updateSchema = z.object({
  firstName: z.string().trim().min(2).optional(),
  lastName: z.string().trim().min(2).optional(),
  role: z.enum(['EMPLOYEE', 'ADMIN']).optional(),
  bio: z.string().nullable().optional(),
  specialities: z.array(z.string()).optional(),
  imageUrl: z.string().url().nullable().optional(),
  yearsExperience: z.number().int().min(0).nullable().optional(),
  quote: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
});

/** PATCH /api/admin/team/:id */
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

    const member = await db.user.update({ where: { id }, data: result.data as never });
    return NextResponse.json(member);
  } catch (error) {
    console.error('[PATCH /api/admin/team/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
