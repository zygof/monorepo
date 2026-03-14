import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { db } from '@marrynov/database';
import { forgotSchema } from '@/lib/validation';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

const limiter = createRateLimiter('auth-forgot-password', { limit: 3, windowSeconds: 300 });

/**
 * POST /api/auth/forgot-password — Demande de réinitialisation du mot de passe.
 *
 * Génère un token de reset (VerificationToken, expire 1h) et envoie un email via Resend.
 * Renvoie toujours 200 — ne révèle jamais si l'email existe (anti-énumération).
 */
export async function POST(request: Request) {
  try {
    const { success } = limiter.check(getClientIp(request));
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const result = forgotSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const { email } = result.data;

    // Toujours répondre 200 (sécurité anti-énumération)
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      // Vérifier si c'est un user Google-only (pas de passwordHash)
      const isGoogleOnly = !user.passwordHash;
      const hasGoogleAccount = await db.account.findFirst({
        where: { userId: user.id, provider: 'google' },
      });

      // Supprimer les anciens tokens de reset pour cet email
      await db.verificationToken.deleteMany({
        where: { identifier: email },
      });

      // Générer un token sécurisé
      const token = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      await db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // Envoyer l'email via Resend
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

      // Adapter le message selon le type de compte
      const isCreation = isGoogleOnly && hasGoogleAccount;
      const subject = isCreation
        ? 'Créer un mot de passe pour votre compte'
        : 'Réinitialisation de votre mot de passe';
      const heading = isCreation
        ? 'Votre compte est actuellement lié à Google. Vous pouvez créer un mot de passe pour vous connecter aussi par email.'
        : 'Vous avez demandé la réinitialisation de votre mot de passe.';
      const ctaLabel = isCreation ? 'Créer mon mot de passe' : 'Réinitialiser mon mot de passe';

      if (process.env.RESEND_API_KEY) {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.EMAIL_FROM ?? 'Beauté Créole <noreply@beautecreole.re>',
          to: email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2>Bonjour ${user.firstName.replace(/[<>&"']/g, '')},</h2>
              <p>${heading}</p>
              <p>Cliquez sur le lien ci-dessous :</p>
              <p>
                <a href="${resetUrl}" style="display: inline-block; background: #8b2d5c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                  ${ctaLabel}
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">Ce lien est valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ message: 'Si un compte existe, un email a été envoyé.' });
  } catch (error) {
    console.error('[POST /api/auth/forgot-password] error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
