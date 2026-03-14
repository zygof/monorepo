import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { sendBookingCancellation } from '@/lib/emails';

const bookingPatchSchema = z.object({
  status: z.enum(['CANCELLED']),
});

/**
 * GET /api/bookings/:id — Détail d'un RDV.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;

    const appointment = await db.appointment.findUnique({
      where: { id },
      include: {
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                startingPrice: true,
                durationMin: true,
                imageUrl: true,
              },
            },
          },
        },
        stylist: { select: { firstName: true, lastName: true, imageUrl: true } },
        review: { select: { id: true, rating: true, comment: true, createdAt: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'RDV introuvable' }, { status: 404 });
    }

    // Seul le client ou un employé/admin peut voir le RDV
    const isOwner = appointment.clientId === session.user.id;
    const isStaff = session.user.role === 'EMPLOYEE' || session.user.role === 'ADMIN';
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('[GET /api/bookings/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PATCH /api/bookings/:id — Modifier un RDV (annuler, changer date/heure).
 *
 * Body :
 *   { status: "CANCELLED" }   — annuler le RDV
 *   { date, startTime }       — reprogrammer (à venir)
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;
    const raw = await request.json();
    const parsed = bookingPatchSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Action non supportée' }, { status: 400 });
    }

    const body = parsed.data;

    const appointment = await db.appointment.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, email: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'RDV introuvable' }, { status: 404 });
    }

    // Vérifier autorisation
    const isOwner = appointment.clientId === session.user.id;
    const isStaff = session.user.role === 'EMPLOYEE' || session.user.role === 'ADMIN';
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // Annulation
    if (body.status === 'CANCELLED') {
      // Vérifier que le RDV est annulable (pas déjà terminé/annulé)
      if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(appointment.status)) {
        return NextResponse.json(
          { error: 'Ce rendez-vous ne peut plus être annulé' },
          { status: 400 },
        );
      }

      // Politique 24h : vérifier que c'est au moins 24h avant
      const appointmentDate = new Date(appointment.date);
      const [h, m] = appointment.startTime.split(':').map(Number);
      appointmentDate.setHours(h ?? 0, m ?? 0, 0, 0);
      const hoursUntil = (appointmentDate.getTime() - Date.now()) / (1000 * 60 * 60);

      if (hoursUntil < 24 && !isStaff) {
        return NextResponse.json(
          { error: 'Annulation impossible moins de 24h avant le rendez-vous. Contactez le salon.' },
          { status: 400 },
        );
      }

      const updated = await db.appointment.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      // Email d'annulation
      await sendBookingCancellation({
        clientFirstName: appointment.client.firstName,
        clientEmail: appointment.client.email,
        date: appointment.date,
        startTime: appointment.startTime,
      }).catch(() => {});

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Action non supportée' }, { status: 400 });
  } catch (error) {
    console.error('[PATCH /api/bookings/:id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
