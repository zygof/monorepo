import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const scheduleUpdateSchema = z.array(
  z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .nullable(),
    closeTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .nullable(),
  }),
);

/** GET /api/admin/schedule — Horaires complets */
export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const slots = await db.scheduleSlot.findMany({ orderBy: { dayOfWeek: 'asc' } });
    return NextResponse.json(slots);
  } catch (error) {
    console.error('[GET /api/admin/schedule] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** PUT /api/admin/schedule — Remplacer tous les horaires */
export async function PUT(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const result = scheduleUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    // Transaction : upsert chaque jour
    const updates = result.data.map((slot) =>
      db.scheduleSlot.upsert({
        where: { dayOfWeek: slot.dayOfWeek },
        update: { openTime: slot.openTime, closeTime: slot.closeTime },
        create: { dayOfWeek: slot.dayOfWeek, openTime: slot.openTime, closeTime: slot.closeTime },
      }),
    );

    await db.$transaction(updates);

    const slots = await db.scheduleSlot.findMany({ orderBy: { dayOfWeek: 'asc' } });
    return NextResponse.json(slots);
  } catch (error) {
    console.error('[PUT /api/admin/schedule] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
