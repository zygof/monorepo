import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@marrynov/database';
import { signupSchema } from '@/lib/validation';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';
import { sendWelcomeEmail } from '@/lib/emails';

const limiter = createRateLimiter('auth-register', { limit: 5, windowSeconds: 60 });

/**
 * POST /api/auth/register — Inscription par email/mot de passe.
 *
 * Crée un User avec passwordHash (bcrypt 12 rounds).
 * Renvoie 201 avec les infos publiques, ou 409 si email déjà pris.
 */
export async function POST(request: Request) {
  try {
    const { success } = limiter.check(getClientIp(request));
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques instants.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, password } = result.data;

    // Vérifier si l'email est déjà utilisé
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email' },
        { status: 409 },
      );
    }

    // Créer le user
    const passwordHash = await hash(password, 12);
    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    // Email de bienvenue (non-bloquant)
    sendWelcomeEmail({
      firstName,
      email,
      salonName: process.env.NEXT_PUBLIC_SALON_NAME,
      salonUrl: process.env.NEXT_PUBLIC_APP_URL,
    }).catch(() => {});

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('[POST /api/auth/register] error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
