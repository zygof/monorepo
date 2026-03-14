import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';
import { staffEventBus } from '@/lib/event-bus';

const adminAppointmentSchema = z.object({
  stylistId: z.string().optional(),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .optional(),
  notes: z.string().max(2000).optional(),
  internalNotes: z.string().max(2000).optional(),
  cancelReason: z.string().max(500).optional(),
});

/** PATCH /api/admin/appointments/:id — Modifier un RDV (réassigner styliste, changer statut, etc.) */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error, session } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const result = adminAppointmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = { ...result.data };

    if (result.data.status === 'CANCELLED') {
      data.cancelledAt = new Date();
    }

    const oldAppointment = await db.appointment.findUnique({
      where: { id },
      select: { stylistId: true, clientId: true, status: true },
    });

    const appointment = await db.appointment.update({
      where: { id },
      data,
      include: {
        client: { select: { firstName: true, lastName: true, email: true } },
        stylist: { select: { firstName: true, lastName: true } },
        services: { include: { service: { select: { name: true } } } },
      },
    });

    // Si le styliste a changé, créer une notification pour le client
    if (
      result.data.stylistId &&
      oldAppointment &&
      result.data.stylistId !== oldAppointment.stylistId
    ) {
      const newStylist = await db.user.findUnique({
        where: { id: result.data.stylistId! },
        select: { firstName: true, lastName: true },
      });

      await db.notification.create({
        data: {
          type: 'BOOKING_STYLIST_CHANGED',
          userId: appointment.clientId,
          email: appointment.client.email,
          payload: {
            appointmentId: id,
            date: appointment.date,
            startTime: appointment.startTime,
            oldStylist: oldAppointment.stylistId,
            newStylistName: newStylist ? `${newStylist.firstName} ${newStylist.lastName}` : null,
            services: appointment.services.map((s) => s.service.name),
            changedBy: session!.user?.id,
          },
        },
      });
    }

    staffEventBus.emit('appointment_updated', { appointmentId: id, changes: Object.keys(data) });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('[PATCH /api/admin/appointments/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
