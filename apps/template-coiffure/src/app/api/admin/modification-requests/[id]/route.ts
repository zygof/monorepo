import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireAdmin } from '@/lib/auth-helpers';
import { staffEventBus } from '@/lib/event-bus';

const modRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNote: z.string().max(1000).optional(),
  newStylistId: z.string().optional(),
});

/** PATCH /api/admin/modification-requests/:id — Approuver ou rejeter une demande */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error, session } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const raw = await request.json();
    const parsed = modRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const body = parsed.data;

    // Transaction atomique pour toutes les opérations liées
    const modRequest = await db.$transaction(async (tx) => {
      const req = await tx.modificationRequest.update({
        where: { id },
        data: {
          status: body.status,
          adminNote: body.adminNote ?? null,
          processedAt: new Date(),
          processedBy: session!.user?.id,
        },
        include: {
          appointment: {
            select: {
              id: true,
              date: true,
              startTime: true,
              clientId: true,
              client: { select: { email: true, firstName: true } },
              services: { include: { service: { select: { name: true } } } },
            },
          },
          requester: { select: { firstName: true, lastName: true } },
        },
      });

      // Si approuvé et type REFUSE → annuler le RDV + notifier le client
      if (body.status === 'APPROVED' && req.type === 'REFUSE') {
        await tx.appointment.update({
          where: { id: req.appointmentId },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: `Annulé suite à la demande de ${req.requester.firstName} ${req.requester.lastName} : ${req.reason}`,
          },
        });

        await tx.notification.create({
          data: {
            type: 'BOOKING_CANCELLED',
            userId: req.appointment.clientId,
            email: req.appointment.client.email,
            payload: {
              appointmentId: req.appointmentId,
              date: req.appointment.date,
              startTime: req.appointment.startTime,
              reason: `Votre styliste a dû annuler ce rendez-vous. ${body.adminNote ? `Note : ${body.adminNote}` : 'Nous vous invitons à reprendre rendez-vous.'}`,
              services: req.appointment.services.map((s) => s.service.name),
            },
          },
        });
      }

      // Si approuvé et type REASSIGN + newStylistId fourni → réassigner
      if (body.status === 'APPROVED' && req.type === 'REASSIGN' && body.newStylistId) {
        // Vérifier que le nouveau styliste est bien un employé
        const newStylist = await tx.user.findUnique({
          where: { id: body.newStylistId },
          select: { firstName: true, lastName: true, role: true },
        });

        if (!newStylist || (newStylist.role !== 'EMPLOYEE' && newStylist.role !== 'ADMIN')) {
          throw new Error('INVALID_STYLIST');
        }

        await tx.appointment.update({
          where: { id: req.appointmentId },
          data: { stylistId: body.newStylistId },
        });

        await tx.notification.create({
          data: {
            type: 'BOOKING_STYLIST_CHANGED',
            userId: req.appointment.clientId,
            email: req.appointment.client.email,
            payload: {
              appointmentId: req.appointmentId,
              date: req.appointment.date,
              startTime: req.appointment.startTime,
              newStylistName: `${newStylist.firstName} ${newStylist.lastName}`,
              services: req.appointment.services.map((s) => s.service.name),
            },
          },
        });
      }

      return req;
    });

    // Émettre les événements SSE (après la transaction réussie)
    if (body.status === 'APPROVED' && modRequest.type === 'REFUSE') {
      staffEventBus.emit('appointment_cancelled', { appointmentId: modRequest.appointmentId });
    } else if (body.status === 'APPROVED' && modRequest.type === 'REASSIGN') {
      staffEventBus.emit('appointment_updated', {
        appointmentId: modRequest.appointmentId,
        changes: ['stylistId'],
      });
    }
    staffEventBus.emit('mod_request', { requestId: id, status: body.status });

    return NextResponse.json(modRequest);
  } catch (e) {
    if (e instanceof Error && e.message === 'INVALID_STYLIST') {
      return NextResponse.json({ error: 'Styliste invalide' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
