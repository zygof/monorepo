import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireStaff } from '@/lib/auth-helpers';
import { staffEventBus } from '@/lib/event-bus';

const modRequestCreateSchema = z.object({
  appointmentId: z.string().min(1),
  type: z.enum(['REASSIGN', 'REFUSE', 'RESCHEDULE', 'OTHER']),
  reason: z.string().trim().min(1, 'La raison est requise').max(2000),
});

/** POST /api/staff/modification-requests — Créer une demande de modification */
export async function POST(request: Request) {
  try {
    const { error, session } = await requireStaff();
    if (error) return error;

    const raw = await request.json();
    const result = modRequestCreateSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const body = result.data;

    // Vérifier que le RDV existe et est assigné à ce styliste
    const appointment = await db.appointment.findUnique({
      where: { id: body.appointmentId },
      select: { stylistId: true, status: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'RDV introuvable' }, { status: 404 });
    }

    if (appointment.stylistId !== session!.user?.id && session!.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Vous n'êtes pas assigné(e) à ce rendez-vous" },
        { status: 403 },
      );
    }

    if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(appointment.status)) {
      return NextResponse.json(
        { error: 'Ce rendez-vous ne peut plus être modifié' },
        { status: 400 },
      );
    }

    // Vérifier qu'il n'y a pas déjà une demande en cours
    const existing = await db.modificationRequest.findFirst({
      where: {
        appointmentId: body.appointmentId,
        requesterId: session!.user!.id,
        status: 'PENDING',
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Une demande est déjà en cours pour ce rendez-vous' },
        { status: 409 },
      );
    }

    const modRequest = await db.modificationRequest.create({
      data: {
        appointmentId: body.appointmentId,
        requesterId: session!.user!.id,
        type: body.type,
        reason: body.reason,
      },
    });

    staffEventBus.emit('mod_request', {
      requestId: modRequest.id,
      appointmentId: body.appointmentId,
    });

    return NextResponse.json(modRequest, { status: 201 });
  } catch (error) {
    console.error('[POST /api/staff/modification-requests] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/** GET /api/staff/modification-requests — Lister ses propres demandes */
export async function GET() {
  try {
    const { error, session } = await requireStaff();
    if (error) return error;

    const requests = await db.modificationRequest.findMany({
      where: { requesterId: session!.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          select: {
            date: true,
            startTime: true,
            client: { select: { firstName: true, lastName: true } },
            services: { include: { service: { select: { name: true } } } },
          },
        },
      },
      take: 20,
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('[GET /api/staff/modification-requests] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
