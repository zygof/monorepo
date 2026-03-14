import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/**
 * GET /api/schedule — Horaires d'ouverture du salon.
 *
 * Retourne les créneaux par jour de la semaine (0=dimanche, 1=lundi…).
 */
export async function GET() {
  try {
    const slots = await db.scheduleSlot.findMany({
      orderBy: { dayOfWeek: 'asc' },
      select: {
        dayOfWeek: true,
        openTime: true,
        closeTime: true,
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error('[GET /api/schedule] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
