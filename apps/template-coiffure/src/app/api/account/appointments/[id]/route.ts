import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { staffEventBus } from '@/lib/event-bus';

const clientAppointmentSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('cancel'),
    reason: z.string().max(500).optional(),
  }),
  z.object({
    action: z.literal('reschedule'),
    message: z.string().max(1000).optional(),
  }),
]);

/** PATCH /api/account/appointments/:id — Client annule ou modifie son RDV */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;
    const raw = await request.json();
    const parsed = clientAppointmentSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const body = parsed.data;

    // Vérifier que le RDV appartient au client
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: {
        services: { include: { service: { select: { name: true } } } },
        stylist: { select: { firstName: true, lastName: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'RDV introuvable' }, { status: 404 });
    }

    if (appointment.clientId !== session.user.id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(appointment.status)) {
      return NextResponse.json(
        { error: 'Ce rendez-vous ne peut plus être modifié' },
        { status: 400 },
      );
    }

    // Annulation
    if (body.action === 'cancel') {
      const updated = await db.appointment.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelReason: body.reason?.trim() ?? 'Annulé par le client',
        },
      });

      // Notification pour le salon (styliste + admin)
      await db.notification.create({
        data: {
          type: 'BOOKING_CANCELLED',
          userId: appointment.stylistId,
          email: session.user.email!,
          payload: {
            appointmentId: id,
            date: appointment.date,
            startTime: appointment.startTime,
            clientName: `${session.user.firstName} ${session.user.lastName}`,
            services: appointment.services.map((s) => s.service.name),
            reason: body.reason?.trim() ?? 'Annulé par le client',
            cancelledBy: 'client',
          },
        },
      });

      staffEventBus.emit('appointment_cancelled', { appointmentId: id });
      return NextResponse.json(updated);
    }

    // Demande de report (crée une notification pour le salon)
    if (body.action === 'reschedule') {
      await db.notification.create({
        data: {
          type: 'BOOKING_MODIFIED',
          userId: appointment.stylistId,
          email: session.user.email!,
          payload: {
            appointmentId: id,
            date: appointment.date,
            startTime: appointment.startTime,
            clientName: `${session.user.firstName} ${session.user.lastName}`,
            services: appointment.services.map((s) => s.service.name),
            message: body.message?.trim() ?? 'Le client souhaite reporter ce rendez-vous',
            requestedBy: 'client',
          },
        },
      });

      staffEventBus.emit('appointment_updated', { appointmentId: id, action: 'reschedule' });
      return NextResponse.json({ message: 'Demande de report envoyée au salon' });
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  } catch (error) {
    console.error('[PATCH /api/account/appointments/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
