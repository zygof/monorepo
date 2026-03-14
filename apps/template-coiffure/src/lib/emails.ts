/**
 * Templates email et envoi via Resend.
 *
 * Toutes les fonctions instancient Resend dans le handler (pas au module level)
 * pour éviter les erreurs au build-time quand RESEND_API_KEY n'est pas défini.
 */

const EMAIL_FROM = process.env.EMAIL_FROM ?? 'Beauté Créole <noreply@beautecreole.re>';

/** Échappe les caractères HTML pour prévenir l'injection dans les emails */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  const { Resend } = await import('resend');
  return new Resend(process.env.RESEND_API_KEY);
}

/** Formater un prix en centimes → "45,00 €" */
function formatPrice(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €';
}

/** Formater une date → "Vendredi 20 mars 2026" */
function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Indian/Reunion',
  });
}

interface BookingConfirmationData {
  clientFirstName: string;
  clientEmail: string;
  date: Date;
  startTime: string;
  services: Array<{ name: string; price: number }>;
  totalPrice: number;
  stylistName?: string;
  salonName?: string;
  salonPhone?: string;
  salonAddress?: string;
  /** Montant de l'acompte payé en centimes (Premium uniquement) */
  depositAmount?: number;
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const resend = await getResend();
  if (!resend) return;

  const salonName = data.salonName ?? 'Beauté Créole';
  const servicesList = data.services
    .map((s) => `<li>${escapeHtml(s.name)} — ${formatPrice(s.price)}</li>`)
    .join('');

  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.clientEmail,
    subject: `Confirmation de votre rendez-vous — ${salonName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #333;">
        <h2 style="color: #b8860b;">Rendez-vous confirmé !</h2>
        <p>Bonjour ${escapeHtml(data.clientFirstName)},</p>
        <p>Votre rendez-vous est bien enregistré :</p>

        <div style="background: #f8f6f0; border-radius: 12px; padding: 16px 20px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Date :</strong> ${formatDate(data.date)}</p>
          <p style="margin: 4px 0;"><strong>Heure :</strong> ${escapeHtml(data.startTime)}</p>
          ${data.stylistName ? `<p style="margin: 4px 0;"><strong>Styliste :</strong> ${escapeHtml(data.stylistName)}</p>` : ''}
          <p style="margin: 8px 0 4px 0;"><strong>Prestations :</strong></p>
          <ul style="margin: 0; padding-left: 20px;">${servicesList}</ul>
          <p style="margin: 8px 0 0; font-weight: bold;">Total estimé : ${formatPrice(data.totalPrice)}</p>
          ${
            data.depositAmount
              ? `
          <div style="margin: 12px 0 0; padding: 10px 16px; background: #e8f5e9; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #2e7d32;">✓ Acompte payé : ${formatPrice(data.depositAmount)}</p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #666;">Solde à régler au salon : ${formatPrice(data.totalPrice - data.depositAmount)}</p>
          </div>
          `
              : ''
          }
        </div>

        <p style="font-size: 14px; color: #666;">
          Vous pouvez annuler ou modifier votre rendez-vous jusqu'à 24h avant la date prévue
          depuis votre espace client ou en nous contactant.
        </p>

        ${data.salonPhone ? `<p style="font-size: 14px;">📞 ${data.salonPhone}</p>` : ''}
        ${data.salonAddress ? `<p style="font-size: 14px;">📍 ${data.salonAddress}</p>` : ''}

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 12px; color: #999;">
          ${salonName} — Ce message est automatique, merci de ne pas y répondre.
        </p>
      </div>
    `,
  });
}

interface BookingCancellationData {
  clientFirstName: string;
  clientEmail: string;
  date: Date;
  startTime: string;
  salonName?: string;
}

export async function sendBookingCancellation(data: BookingCancellationData) {
  const resend = await getResend();
  if (!resend) return;

  const salonName = data.salonName ?? 'Beauté Créole';

  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.clientEmail,
    subject: `Annulation de votre rendez-vous — ${salonName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #333;">
        <h2>Rendez-vous annulé</h2>
        <p>Bonjour ${escapeHtml(data.clientFirstName)},</p>
        <p>Votre rendez-vous du <strong>${formatDate(data.date)}</strong> à <strong>${escapeHtml(data.startTime)}</strong> a bien été annulé.</p>
        <p>N'hésitez pas à reprendre rendez-vous quand vous le souhaitez !</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 12px; color: #999;">${salonName}</p>
      </div>
    `,
  });
}
