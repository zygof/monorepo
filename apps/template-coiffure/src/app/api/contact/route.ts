import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validation';
import { sendContactEmails } from '@/lib/emails';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

const contactLimiter = createRateLimiter('contact-form', { limit: 5, windowSeconds: 300 });

/**
 * POST /api/contact — Envoie un message via le formulaire de contact.
 *
 * Envoie deux emails :
 *   1. Notification au salon (avec reply-to du client)
 *   2. Accusé de réception au client
 */
export async function POST(request: Request) {
  try {
    const { success } = contactLimiter.check(getClientIp(request));
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Réessayez dans quelques minutes.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const data = result.data;

    await sendContactEmails({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json({ message: 'Message envoyé avec succès' });
  } catch (error) {
    console.error('[POST /api/contact] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
