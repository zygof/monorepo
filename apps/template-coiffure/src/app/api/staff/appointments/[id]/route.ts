import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireStaff } from '@/lib/auth-helpers';
import { staffEventBus } from '@/lib/event-bus';

/**
 * PATCH /api/staff/appointments/:id — Actions employé sur un RDV.
 *
 * Body possibles :
 *   { status: "IN_PROGRESS" }                — démarrer le RDV
 *   { status: "COMPLETED" }                  — terminer le RDV (incrémente fidélité)
 *   { status: "NO_SHOW" }                    — client absent
 *   { status: "CANCELLED" }                  — annuler
 *   { delayMinutes: 15 }                     — signaler un retard
 *   { internalNotes: "..." }                 — notes internes
 */

const updateSchema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'CANCELLED']).optional(),
  delayMinutes: z.number().min(0).max(180).optional(),
  internalNotes: z.string().max(2000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await requireStaff();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = result.data;

    const appointment = await db.appointment.findUnique({
      where: { id },
      select: { id: true, clientId: true, status: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'RDV introuvable' }, { status: 404 });
    }

    // Construire les données de mise à jour
    const updateData: Record<string, unknown> = {};

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.delayMinutes !== undefined) {
      updateData.delayMinutes = data.delayMinutes;
      updateData.delayNotifiedAt = new Date();
    }

    if (data.internalNotes !== undefined) {
      updateData.internalNotes = data.internalNotes;
    }

    // Transaction atomique : mise à jour du RDV + fidélité
    const updated = await db.$transaction(async (tx) => {
      const result = await tx.appointment.update({
        where: { id },
        data: updateData,
      });

      // Si terminé → incrémenter le compteur fidélité
      if (data.status === 'COMPLETED') {
        const loyaltyConfig = await tx.loyaltyConfig.findFirst();
        if (loyaltyConfig) {
          await tx.loyaltyRecord.upsert({
            where: { userId: appointment.clientId },
            update: {
              currentVisits: { increment: 1 },
              totalVisits: { increment: 1 },
              lastVisitAt: new Date(),
            },
            create: {
              userId: appointment.clientId,
              currentVisits: 1,
              totalVisits: 1,
              lastVisitAt: new Date(),
            },
          });
        }
      }

      return result;
    });

    // Émettre l'événement SSE
    if (data.status === 'CANCELLED') {
      staffEventBus.emit('appointment_cancelled', { appointmentId: id });
    } else {
      staffEventBus.emit('appointment_updated', { appointmentId: id, changes: Object.keys(data) });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/staff/appointments/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
