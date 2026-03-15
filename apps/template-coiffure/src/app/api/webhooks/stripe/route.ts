import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { db } from '@marrynov/database';
import { verifyWebhookSignature } from '@/lib/stripe';
import { sendBookingConfirmation } from '@/lib/emails';
import { staffEventBus } from '@/lib/event-bus';

/**
 * POST /api/webhooks/stripe — Webhook Stripe.
 *
 * Gère les événements de paiement de manière idempotente.
 * Utilise le body brut (text) pour la vérification de signature.
 *
 * Événements gérés :
 *   - payment_intent.succeeded  → confirme le RDV, envoie l'email
 *   - payment_intent.payment_failed → marque le RDV en échec
 *   - payment_intent.canceled → marque le RDV en expiré
 *   - charge.refunded → marque le remboursement
 *   - charge.dispute.created → log pour suivi admin
 */
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    console.error('[Webhook Stripe] Signature invalide:', err);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'charge.dispute.created':
        await handleDisputeCreated(event.data.object as Stripe.Dispute);
        break;

      default:
        // Événement non géré — répondre 200 pour que Stripe ne renvoie pas
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // Toujours retourner 200 pour éviter que Stripe renvoie en boucle.
    // L'erreur est loggée pour investigation manuelle.
    console.error(`[Webhook Stripe] Erreur traitement ${event.type}:`, err);
    return NextResponse.json({ received: true, error: 'internal' });
  }
}

/* ── Handlers ─────────────────────────────────────────────────────────── */

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const appointmentId = paymentIntent.metadata.appointmentId;
  if (!appointmentId) {
    console.warn('[Webhook] PaymentIntent sans appointmentId dans les metadata:', paymentIntent.id);
    return;
  }

  // Idempotent : ne pas re-confirmer un RDV déjà PAID
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: { paymentStatus: true },
  });

  if (!appointment) {
    console.warn('[Webhook] Appointment introuvable:', appointmentId);
    return;
  }

  if (appointment.paymentStatus === 'PAID') {
    // Déjà traité (par le client ou un webhook précédent)
    return;
  }

  // Déterminer la méthode de paiement
  const pm = paymentIntent.payment_method_types?.[0] ?? 'card';

  // Mettre à jour le RDV
  const updated = await db.appointment.update({
    where: { id: appointmentId },
    data: {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      depositPaidAt: new Date(),
      paymentMethod: pm,
      stripePaymentIntentId: paymentIntent.id,
    },
    include: {
      services: { include: { service: { select: { name: true } } } },
      stylist: { select: { firstName: true } },
      client: { select: { firstName: true, email: true } },
    },
  });

  // Notifier le staff
  staffEventBus.emit('appointment_created', { appointmentId });

  // Envoyer l'email de confirmation avec info acompte
  await sendBookingConfirmation({
    clientFirstName: updated.client.firstName,
    clientEmail: updated.client.email,
    date: updated.date,
    startTime: updated.startTime,
    services: updated.services.map((s) => ({
      name: s.service.name,
      price: s.priceAtBooking,
    })),
    totalPrice: updated.totalPrice,
    stylistName: updated.stylist?.firstName,
    depositAmount: updated.depositAmount ?? undefined,
  }).catch(() => {
    // Ne pas faire échouer le webhook si l'email échoue
  });

  console.log(`[Webhook] Paiement confirmé pour RDV ${appointmentId} (${paymentIntent.id})`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const appointmentId = paymentIntent.metadata.appointmentId;
  if (!appointmentId) return;

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: { paymentStatus: true },
  });

  if (!appointment || appointment.paymentStatus === 'PAID') return;

  await db.appointment.update({
    where: { id: appointmentId },
    data: { paymentStatus: 'FAILED' },
  });

  console.log(`[Webhook] Paiement échoué pour RDV ${appointmentId} (${paymentIntent.id})`);
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const appointmentId = paymentIntent.metadata.appointmentId;
  if (!appointmentId) return;

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: { paymentStatus: true },
  });

  if (!appointment || appointment.paymentStatus === 'PAID') return;

  await db.appointment.update({
    where: { id: appointmentId },
    data: {
      paymentStatus: 'EXPIRED',
      status: 'CANCELLED',
      cancelledAt: new Date(),
      cancelReason: 'Paiement annulé ou expiré',
    },
  });

  console.log(`[Webhook] Paiement annulé pour RDV ${appointmentId} (${paymentIntent.id})`);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  const appointment = await db.appointment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    select: { id: true, depositAmount: true },
  });

  if (!appointment || !appointment.depositAmount) return;

  const isFullRefund = charge.amount_refunded >= appointment.depositAmount;

  await db.appointment.update({
    where: { id: appointment.id },
    data: {
      paymentStatus: isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
      stripeRefundId: charge.refunds?.data[0]?.id ?? null,
    },
  });

  console.log(
    `[Webhook] Remboursement ${isFullRefund ? 'total' : 'partiel'} pour RDV ${appointment.id}`,
  );
}

async function handleDisputeCreated(dispute: Stripe.Dispute) {
  const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id;
  console.error(`[Webhook] ⚠️ LITIGE ouvert — charge: ${chargeId}, raison: ${dispute.reason}`);
  // TODO : envoyer une notification admin (email, Slack, Linear)
}
