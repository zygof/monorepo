import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@marrynov/database';
import { requireStaff } from '@/lib/auth-helpers';
import { staffEventBus } from '@/lib/event-bus';

/**
 * POST /api/staff/walk-in — Enregistrer un client sans rendez-vous (walk-in).
 *
 * Body :
 *   {
 *     firstName: "Marie",
 *     lastName: "Dupont",
 *     phone?: "0692...",
 *     email?: "...",
 *     serviceIds: ["xxx"],
 *     stylistId: "yyy",
 *     notes?: "..."
 *   }
 */
const walkInSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  serviceIds: z.array(z.string()).min(1),
  stylistId: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  try {
    const { error, session } = await requireStaff();
    if (error) return error;

    const body = await request.json();
    const result = walkInSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = result.data;

    // Chercher ou créer le client
    let client = data.email ? await db.user.findUnique({ where: { email: data.email } }) : null;

    if (!client) {
      client = await db.user.create({
        data: {
          email: data.email ?? `walkin-${Date.now()}@temp.local`,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
      });
    }

    // Récupérer les services
    const services = await db.service.findMany({
      where: { id: { in: data.serviceIds }, active: true },
      select: { id: true, startingPrice: true, durationMin: true },
    });

    const totalPrice = services.reduce((sum, s) => sum + s.startingPrice, 0);
    const totalDuration = services.reduce((sum, s) => sum + s.durationMin, 0);

    // Heure actuelle (Réunion UTC+4)
    const now = new Date();
    const reunionOffset = 4 * 60; // minutes
    const reunionNow = new Date(now.getTime() + reunionOffset * 60 * 1000);
    const startTime = `${String(reunionNow.getUTCHours()).padStart(2, '0')}:${String(reunionNow.getUTCMinutes()).padStart(2, '0')}`;
    const endMinutes = reunionNow.getUTCHours() * 60 + reunionNow.getUTCMinutes() + totalDuration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const appointment = await db.appointment.create({
      data: {
        date: new Date(now.toISOString().split('T')[0] + 'T00:00:00Z'),
        startTime,
        endTime,
        totalPrice,
        status: 'IN_PROGRESS',
        isWalkIn: true,
        notes: data.notes,
        clientId: client.id,
        stylistId: data.stylistId ?? session.user.id,
        services: {
          create: services.map((s) => ({
            serviceId: s.id,
            priceAtBooking: s.startingPrice,
          })),
        },
      },
      include: {
        services: { include: { service: { select: { name: true } } } },
        client: { select: { firstName: true, lastName: true } },
      },
    });

    staffEventBus.emit('appointment_created', { appointmentId: appointment.id });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('[POST /api/staff/walk-in] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
