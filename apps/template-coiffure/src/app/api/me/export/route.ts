import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';

/**
 * GET /api/me/export — Export RGPD des données personnelles.
 *
 * Droit à la portabilité (art. 20 RGPD) :
 * Retourne un JSON structuré avec toutes les données du client.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        appointments: {
          orderBy: { date: 'desc' },
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            status: true,
            totalPrice: true,
            notes: true,
            createdAt: true,
            services: {
              select: {
                priceAtBooking: true,
                service: { select: { name: true } },
              },
            },
            stylist: { select: { firstName: true } },
            review: {
              select: {
                rating: true,
                comment: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      format: 'RGPD - Droit à la portabilité (art. 20)',
      profile: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
        memberSince: user.createdAt,
        lastUpdated: user.updatedAt,
      },
      appointments: user.appointments.map((apt) => ({
        date: apt.date,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
        totalPrice: apt.totalPrice,
        notes: apt.notes,
        createdAt: apt.createdAt,
        services: apt.services.map((s) => ({
          name: s.service.name,
          price: s.priceAtBooking,
        })),
        stylist: apt.stylist?.firstName ?? null,
        review: apt.review
          ? {
              rating: apt.review.rating,
              comment: apt.review.comment,
              createdAt: apt.review.createdAt,
            }
          : null,
      })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mes-donnees-${user.firstName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    console.error('[GET /api/me/export] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
