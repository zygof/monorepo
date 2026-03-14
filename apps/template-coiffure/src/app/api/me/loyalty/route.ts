import { NextResponse } from 'next/server';
import { db } from '@marrynov/database';
import { auth } from '@/lib/auth';

/**
 * GET /api/me/loyalty — Programme de fidélité du client connecté.
 *
 * Retourne le nombre de visites, le seuil, la réduction,
 * et l'historique des récompenses.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Récupérer la config fidélité du salon
    const config = await db.loyaltyConfig.findFirst();
    if (!config) {
      return NextResponse.json({ enabled: false });
    }

    // Récupérer le record fidélité du client
    const loyalty = await db.loyaltyRecord.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      enabled: true,
      currentVisits: loyalty?.currentVisits ?? 0,
      totalVisits: loyalty?.totalVisits ?? 0,
      targetVisits: config.targetVisits,
      reward: config.reward,
      discount: config.discount,
      rewardsEarned: loyalty?.rewardsEarned ?? 0,
      lastVisitAt: loyalty?.lastVisitAt,
    });
  } catch (error) {
    console.error('[GET /api/me/loyalty] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
