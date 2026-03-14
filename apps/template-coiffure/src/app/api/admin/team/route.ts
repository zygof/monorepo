import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const teamMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  role: z.enum(['EMPLOYEE', 'ADMIN']),
  bio: z.string().optional(),
  specialities: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  quote: z.string().optional(),
  instagram: z.string().optional(),
});

/** GET /api/admin/team — Tous les membres de l'équipe */
export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const members = await db.user.findMany({
      where: { role: { in: ['EMPLOYEE', 'ADMIN'] } },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        bio: true,
        specialities: true,
        imageUrl: true,
        yearsExperience: true,
        quote: true,
        instagram: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('[GET /api/admin/team] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** POST /api/admin/team — Ajouter un membre (sans mot de passe, à définir plus tard) */
export async function POST(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const result = teamMemberSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const existing = await db.user.findUnique({ where: { email: result.data.email } });
    if (existing) {
      return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 409 });
    }

    const member = await db.user.create({
      data: result.data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        bio: true,
        specialities: true,
        imageUrl: true,
        yearsExperience: true,
        quote: true,
        instagram: true,
        createdAt: true,
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('[POST /api/admin/team] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
