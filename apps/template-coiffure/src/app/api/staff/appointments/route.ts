import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { requireStaff } from '@/lib/auth-helpers';

/**
 * GET /api/staff/appointments — Planning des RDV pour l'employé connecté.
 *
 * Query params :
 *   ?date=2026-03-20   — filtrer par date (défaut : aujourd'hui)
 *   ?all=true          — voir tous les RDV du salon (admin uniquement)
 */
export async function GET(request: Request) {
  try {
    const { error, session } = await requireStaff();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const showAll = searchParams.get('all') === 'true' && session.user.role === 'ADMIN';

    // Date par défaut : aujourd'hui (heure Réunion)
    const today = dateStr ?? new Date().toISOString().split('T')[0];
    const queryDate = new Date(today + 'T00:00:00Z');

    const appointments = await db.appointment.findMany({
      where: {
        date: queryDate,
        ...(showAll ? {} : { stylistId: session.user.id }),
      },
      orderBy: { startTime: 'asc' },
      include: {
        client: { select: { firstName: true, lastName: true, phone: true, email: true } },
        services: { include: { service: { select: { name: true, durationMin: true } } } },
        stylist: { select: { firstName: true } },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('[GET /api/staff/appointments] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
