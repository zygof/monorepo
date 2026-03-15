import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@marrynov/database';
import { resetPasswordSchema } from '@/lib/validation';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

/**
 * POST /api/auth/reset-password — Réinitialisation du mot de passe.
 *
 * Valide le token + email, met à jour le passwordHash, supprime le token.
 * Rate limité : 5 tentatives / 5 minutes (protection brute-force token).
 */

const resetLimiter = createRateLimiter('auth-reset-password', { limit: 5, windowSeconds: 300 });

export async function POST(request: Request) {
  try {
    const { success } = resetLimiter.check(getClientIp(request));
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, token, password } = result.data;

    // Vérifier le token
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
        expires: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Lien invalide ou expiré. Veuillez refaire une demande.' },
        { status: 400 },
      );
    }

    // Transaction atomique : mise à jour du mot de passe + suppression du token
    const passwordHash = await hash(password, 12);
    await db.$transaction([
      db.user.update({
        where: { email },
        data: { passwordHash },
      }),
      db.verificationToken.deleteMany({
        where: { identifier: email },
      }),
    ]);

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('[POST /api/auth/reset-password] error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
