import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { requireStripe } from '@/lib/stripe';
import { sendBookingConfirmation } from '@/lib/emails';
import { staffEventBus } from '@/lib/event-bus';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

/**
 * POST /api/bookings/:id/confirm-payment
 *
 * Confirme le paiement côté client (après succès Stripe Elements).
 * Vérifie le statut du PaymentIntent auprès de Stripe avant de confirmer.
 * Idempotent : si le RDV est déjà PAID, retourne 200 sans modifier.
 *
 * Body : { paymentIntentId: string }
 */

const confirmLimiter = createRateLimiter('confirm-payment', { limit: 20, windowSeconds: 300 });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { success } = confirmLimiter.check(getClientIp(request));
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
        { status: 429 },
      );
    }

    const { id: appointmentId } = await params;
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return NextResponse.json({ error: 'paymentIntentId requis' }, { status: 400 });
    }

    // Vérifier que le RDV existe et correspond au PaymentIntent
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        paymentStatus: true,
        stripePaymentIntentId: true,
        depositAmount: true,
        totalPrice: true,
        date: true,
        startTime: true,
        services: { include: { service: { select: { name: true } } } },
        stylist: { select: { firstName: true } },
        client: { select: { firstName: true, email: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Rendez-vous introuvable' }, { status: 404 });
    }

    // Idempotent : déjà confirmé
    if (appointment.paymentStatus === 'PAID') {
      return NextResponse.json({
        status: 'PAID',
        message: 'Paiement déjà confirmé',
      });
    }

    // Vérifier que le RDV a bien un acompte attendu
    if (!appointment.depositAmount) {
      return NextResponse.json(
        { error: 'Ce rendez-vous ne nécessite pas de paiement' },
        { status: 400 },
      );
    }

    // Vérifier que le PaymentIntent correspond
    if (appointment.stripePaymentIntentId !== paymentIntentId) {
      return NextResponse.json({ error: 'PaymentIntent ne correspond pas' }, { status: 400 });
    }

    // Vérifier le statut du PaymentIntent auprès de Stripe
    const stripe = requireStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        {
          error: "Le paiement n'a pas abouti",
          stripeStatus: paymentIntent.status,
        },
        { status: 402 },
      );
    }

    // Confirmer le RDV
    const pm = paymentIntent.payment_method_types?.[0] ?? 'card';

    const updated = await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        depositPaidAt: new Date(),
        paymentMethod: pm,
      },
    });

    // Notifier le staff
    staffEventBus.emit('appointment_created', { appointmentId });

    // Email de confirmation
    await sendBookingConfirmation({
      clientFirstName: appointment.client.firstName,
      clientEmail: appointment.client.email,
      date: appointment.date,
      startTime: appointment.startTime,
      services: appointment.services.map((s) => ({
        name: s.service.name,
        price: s.priceAtBooking,
      })),
      totalPrice: appointment.totalPrice,
      stylistName: appointment.stylist?.firstName,
      depositAmount: appointment.depositAmount ?? undefined,
    }).catch(() => {});

    return NextResponse.json({
      status: updated.paymentStatus,
      message: 'Paiement confirmé',
    });
  } catch (error) {
    console.error('[POST /api/bookings/:id/confirm-payment] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
