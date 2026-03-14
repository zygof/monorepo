import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';

/** Convertir "HH:MM" en minutes depuis minuit */
function toMinutes(time: string): number {
  const parts = time.split(':').map(Number);
  return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
}

/** Convertir minutes en "HH:MM" */
function toTime(minutes: number): string {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * GET /api/availability — Créneaux disponibles pour une date donnée.
 *
 * Query params requis :
 *   ?date=2026-03-20        — date au format YYYY-MM-DD
 *   ?duration=60            — durée totale en minutes
 *   ?stylistId=xxx          — (optionnel) ID du styliste préféré
 *
 * Logique :
 *   1. Récupérer les horaires du jour de la semaine
 *   2. Découper en créneaux de 30 min
 *   3. Exclure les créneaux déjà réservés (comparaison string HH:MM)
 *   4. Exclure les créneaux bloqués (congés, etc.)
 *   5. Retourner les créneaux disponibles
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const duration = Number(searchParams.get('duration')) || 60;
    const stylistId = searchParams.get('stylistId');

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: 'Paramètre date requis (format YYYY-MM-DD)' },
        { status: 400 },
      );
    }

    // dayOfWeek : 0=Lundi dans notre schema (cf seed)
    const jsDate = new Date(dateStr + 'T12:00:00Z');
    const jsDay = jsDate.getUTCDay(); // 0=dim, 1=lun...
    const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1; // Convertir en 0=lun, 6=dim

    // 1. Horaires du jour
    const schedule = await db.scheduleSlot.findFirst({
      where: { dayOfWeek },
    });

    if (!schedule || !schedule.openTime || !schedule.closeTime) {
      return NextResponse.json({ slots: [], closed: true });
    }

    // Date pour les requêtes Prisma (DateTime @db.Date)
    const queryDate = new Date(dateStr + 'T00:00:00Z');

    // 2. Récupérer les RDV existants pour cette date
    const existingAppointments = await db.appointment.findMany({
      where: {
        date: queryDate,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
        ...(stylistId ? { stylistId } : {}),
      },
      select: {
        startTime: true,
        endTime: true,
        stylistId: true,
      },
    });

    // 3. Récupérer les créneaux bloqués pour cette date
    const blockedSlots = await db.blockedSlot.findMany({
      where: {
        date: queryDate,
        ...(stylistId ? { stylistId } : {}),
      },
      select: {
        startTime: true,
        endTime: true,
        stylistId: true,
      },
    });

    // 4. Stylistes disponibles
    const stylists = await db.user.findMany({
      where: {
        role: { in: ['EMPLOYEE', 'ADMIN'] },
        ...(stylistId ? { id: stylistId } : {}),
      },
      select: { id: true, firstName: true },
    });

    // 5. Générer les créneaux
    const openMinutes = toMinutes(schedule.openTime);
    const closeMinutes = toMinutes(schedule.closeTime);
    const SLOT_INTERVAL = 30;

    const slots: Array<{ time: string; stylistId: string; stylistName: string }> = [];

    for (let m = openMinutes; m + duration <= closeMinutes; m += SLOT_INTERVAL) {
      const slotStartTime = toTime(m);
      const slotStartMin = m;
      const slotEndMin = m + duration;

      for (const stylist of stylists) {
        // Vérifier conflit avec RDV existants
        const hasConflict = existingAppointments.some((a) => {
          if (a.stylistId !== stylist.id) return false;
          const aStart = toMinutes(a.startTime);
          const aEnd = toMinutes(a.endTime);
          return slotStartMin < aEnd && slotEndMin > aStart;
        });

        // Vérifier conflit avec créneaux bloqués
        const isBlocked = blockedSlots.some((b) => {
          // stylistId null = tout le salon bloqué
          if (b.stylistId && b.stylistId !== stylist.id) return false;
          // Journée entière si pas de startTime/endTime
          if (!b.startTime || !b.endTime) return true;
          const bStart = toMinutes(b.startTime);
          const bEnd = toMinutes(b.endTime);
          return slotStartMin < bEnd && slotEndMin > bStart;
        });

        if (!hasConflict && !isBlocked) {
          slots.push({
            time: slotStartTime,
            stylistId: stylist.id,
            stylistName: stylist.firstName,
          });
        }
      }
    }

    return NextResponse.json({ slots, closed: false });
  } catch (error) {
    console.error('[GET /api/availability] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
