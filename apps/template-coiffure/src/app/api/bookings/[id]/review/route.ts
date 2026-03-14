import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { reviewSchema } from '@/lib/validation';

/**
 * POST /api/bookings/:id/review — Laisser un avis sur un RDV terminé.
 *
 * Body : { rating: 1-5, comment: "..." }
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Vérifier que le RDV existe, est terminé, et appartient au client
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: { review: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'RDV introuvable' }, { status: 404 });
    }

    if (appointment.clientId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    if (appointment.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: "Vous ne pouvez noter qu'un rendez-vous terminé" },
        { status: 400 },
      );
    }

    if (appointment.review) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour ce rendez-vous' },
        { status: 409 },
      );
    }

    const review = await db.review.create({
      data: {
        rating: result.data.rating,
        comment: result.data.comment,
        appointmentId: id,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('[POST /api/bookings/:id/review] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
