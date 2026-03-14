import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';

const settingsSchema = z.record(z.string(), z.string());

/** GET /api/admin/settings — Tous les paramètres */
export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const settings = await db.salonSetting.findMany();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/admin/settings] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** PUT /api/admin/settings — Mettre à jour les paramètres (key-value) */
export async function PUT(request: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const updates = Object.entries(result.data).map(([key, value]) =>
      db.salonSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );

    await db.$transaction(updates);

    return NextResponse.json({ message: 'Paramètres mis à jour' });
  } catch (error) {
    console.error('[PUT /api/admin/settings] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
