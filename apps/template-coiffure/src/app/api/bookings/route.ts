import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';
import { sendBookingConfirmation } from '@/lib/emails';
import { emailField, nameField, phoneField } from '@/lib/validation';
import { staffEventBus } from '@/lib/event-bus';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';
import { hasPayment, calculateDeposit } from '@/lib/offers';
import { getStripe } from '@/lib/stripe';

/**
 * POST /api/bookings — Créer une réservation.
 *
 * Accepte les réservations de clients authentifiés ET visiteurs (guest booking).
 * Pour les visiteurs : crée un compte client sans mot de passe (passwordHash null).
 *
 * Body attendu :
 *   {
 *     date: "2026-03-20",
 *     startTime: "10:30",
 *     serviceIds: ["xxx", "yyy"],
 *     stylistId?: "zzz",
 *     firstName: "Marie",      // requis si non connecté
 *     lastName: "Dupont",      // requis si non connecté
 *     email: "marie@email.re", // requis si non connecté
 *     phone: "0692123456",     // requis si non connecté
 *     notes?: "...",
 *     smsNotif?: true
 *   }
 */

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format heure invalide'),
  serviceIds: z.array(z.string()).min(1, 'Au moins un service requis'),
  stylistId: z.string().optional(),
  firstName: nameField.optional(),
  lastName: nameField.optional(),
  email: emailField.optional(),
  phone: phoneField.optional(),
  notes: z.string().max(1000).optional(),
  smsNotif: z.boolean().default(true),
});

const bookingLimiter = createRateLimiter('bookings-create', { limit: 10, windowSeconds: 300 });

export async function POST(request: Request) {
  try {
    const { success } = bookingLimiter.check(getClientIp(request));
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de réservations. Réessayez dans quelques minutes.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = result.data;
    const session = await auth();

    // Déterminer le client
    let clientId: string;

    if (session?.user?.id) {
      clientId = session.user.id;
    } else {
      // Guest booking — email requis
      if (!data.email || !data.firstName || !data.lastName) {
        return NextResponse.json(
          { error: 'Informations de contact requises pour les réservations sans compte' },
          { status: 400 },
        );
      }

      // Chercher ou créer le client
      let client = await db.user.findUnique({ where: { email: data.email } });
      if (!client) {
        client = await db.user.create({
          data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
        });
      }
      clientId = client.id;
    }

    // Récupérer les services et calculer le prix total + durée
    const services = await db.service.findMany({
      where: { id: { in: data.serviceIds }, active: true },
      select: { id: true, name: true, startingPrice: true, durationMin: true },
    });

    if (services.length !== data.serviceIds.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs services sont invalides' },
        { status: 400 },
      );
    }

    const totalPrice = services.reduce((sum, s) => sum + s.startingPrice, 0);
    const totalDuration = services.reduce((sum, s) => sum + s.durationMin, 0);

    // Vérifier que la date n'est pas dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(data.date + 'T00:00:00');
    if (appointmentDate < today) {
      return NextResponse.json({ error: 'Impossible de réserver dans le passé' }, { status: 400 });
    }

    // Calculer endTime
    const [startH, startM] = data.startTime.split(':').map(Number);
    const endMinutes = (startH ?? 0) * 60 + (startM ?? 0) + totalDuration;

    // Vérifier que le RDV ne dépasse pas minuit
    if (endMinutes > 23 * 60 + 59) {
      return NextResponse.json(
        { error: "Le rendez-vous dépasse les horaires d'ouverture" },
        { status: 400 },
      );
    }

    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    // Vérifier que le stylistId est bien un employé/admin
    if (data.stylistId) {
      const stylist = await db.user.findUnique({
        where: { id: data.stylistId },
        select: { role: true },
      });
      if (!stylist || (stylist.role !== 'EMPLOYEE' && stylist.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Styliste invalide' }, { status: 400 });
      }
    }

    // Transaction atomique : vérifier dispo + créer le RDV
    const toMin = (t: string) => {
      const parts = t.split(':').map(Number);
      return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
    };

    const appointment = await db
      .$transaction(async (tx) => {
        // Vérifier la disponibilité du styliste (dans la transaction)
        if (data.stylistId) {
          const queryDate = new Date(data.date + 'T00:00:00Z');
          const existingAppointments = await tx.appointment.findMany({
            where: {
              date: queryDate,
              stylistId: data.stylistId,
              status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
            },
            select: { startTime: true, endTime: true },
          });

          const newStart = toMin(data.startTime);
          const newEnd = toMin(endTime);

          const hasConflict = existingAppointments.some((existing) => {
            const existStart = toMin(existing.startTime);
            const existEnd = toMin(existing.endTime);
            return newStart < existEnd && newEnd > existStart;
          });

          if (hasConflict) {
            throw new Error('SLOT_UNAVAILABLE');
          }
        }

        const requiresPayment = hasPayment();
        const depositAmount = requiresPayment ? calculateDeposit(totalPrice) : null;

        // Créer le RDV
        return tx.appointment.create({
          data: {
            date: new Date(data.date + 'T00:00:00Z'),
            startTime: data.startTime,
            endTime,
            totalPrice,
            status: requiresPayment ? 'PENDING' : 'CONFIRMED',
            notes: data.notes,
            smsNotif: data.smsNotif,
            clientId,
            stylistId: data.stylistId,
            // Paiement Premium
            paymentStatus: requiresPayment ? 'PENDING' : 'NOT_REQUIRED',
            depositAmount,
            services: {
              create: services.map((s) => ({
                serviceId: s.id,
                priceAtBooking: s.startingPrice,
              })),
            },
          },
          include: {
            services: { include: { service: { select: { name: true } } } },
            stylist: { select: { firstName: true } },
            client: { select: { firstName: true, email: true } },
          },
        });
      })
      .catch((e: Error) => {
        if (e.message === 'SLOT_UNAVAILABLE') return null;
        throw e;
      });

    if (!appointment) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 });
    }

    // ── Premium : créer le PaymentIntent Stripe ─────────────────────
    if (hasPayment() && appointment.depositAmount) {
      const stripe = getStripe();
      if (!stripe) {
        // Stripe non configuré : annuler le RDV en PENDING
        await db.appointment.update({
          where: { id: appointment.id },
          data: {
            paymentStatus: 'FAILED',
            status: 'CANCELLED',
            cancelReason: 'Stripe non configuré',
          },
        });
        return NextResponse.json(
          { error: 'Le paiement en ligne est temporairement indisponible' },
          { status: 503 },
        );
      }

      try {
        // Créer ou réutiliser le Stripe Customer
        let stripeCustomerId: string | undefined;
        const client = await db.user.findUnique({
          where: { email: appointment.client.email },
          select: { stripeCustomerId: true },
        });

        if (client?.stripeCustomerId) {
          stripeCustomerId = client.stripeCustomerId;
        } else {
          const customer = await stripe.customers.create({
            email: appointment.client.email,
            name: `${appointment.client.firstName}`,
            metadata: { source: 'marrynov', appointmentId: appointment.id },
          });
          stripeCustomerId = customer.id;
          await db.user.update({
            where: { email: appointment.client.email },
            data: { stripeCustomerId: customer.id },
          });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: appointment.depositAmount,
          currency: 'eur',
          customer: stripeCustomerId,
          automatic_payment_methods: { enabled: true },
          receipt_email: appointment.client.email,
          metadata: {
            appointmentId: appointment.id,
            salonName: process.env.NEXT_PUBLIC_SALON_NAME ?? 'Salon',
            services: appointment.services.map((s) => s.service.name).join(', '),
            date: data.date,
            startTime: data.startTime,
          },
          description: `Acompte RDV — ${appointment.services.map((s) => s.service.name).join(' + ')}`,
        });

        // Stocker le PaymentIntent ID sur le RDV
        await db.appointment.update({
          where: { id: appointment.id },
          data: { stripePaymentIntentId: paymentIntent.id },
        });

        return NextResponse.json(
          {
            id: appointment.id,
            date: data.date,
            startTime: data.startTime,
            endTime,
            status: 'PENDING',
            totalPrice,
            paymentStatus: 'PENDING',
            depositAmount: appointment.depositAmount,
            clientSecret: paymentIntent.client_secret,
          },
          { status: 201 },
        );
      } catch (stripeError) {
        console.error('[POST /api/bookings] Stripe error:', stripeError);
        // Marquer le RDV comme échoué si le PaymentIntent ne peut pas être créé
        await db.appointment.update({
          where: { id: appointment.id },
          data: { paymentStatus: 'FAILED' },
        });
        return NextResponse.json(
          { error: 'Impossible de créer le paiement. Veuillez réessayer.' },
          { status: 500 },
        );
      }
    }

    // ── Standard : confirmation directe (pas de paiement) ────────────
    staffEventBus.emit('appointment_created', { appointmentId: appointment.id });

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
    }).catch(() => {
      // Ne pas bloquer la réservation si l'email échoue
    });

    return NextResponse.json(
      {
        id: appointment.id,
        date: data.date,
        startTime: data.startTime,
        endTime,
        status: 'CONFIRMED',
        totalPrice,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/bookings] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * GET /api/bookings — Liste des RDV du client connecté.
 * (Raccourci pour Phase 5, mais logique ici aussi)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const appointments = await db.appointment.findMany({
      where: { clientId: session.user.id },
      orderBy: { date: 'desc' },
      take: 50,
      include: {
        services: { include: { service: { select: { name: true, imageUrl: true } } } },
        stylist: { select: { firstName: true, lastName: true, imageUrl: true } },
        review: { select: { id: true, rating: true } },
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('[GET /api/bookings] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
