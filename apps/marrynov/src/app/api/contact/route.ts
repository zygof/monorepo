import { NextRequest, NextResponse } from "next/server";
// TODO: Réactiver quand domaine marrynov.re vérifié en prod
// import { Resend } from "resend";
// import { buildContactNotificationEmail } from "@/lib/email-templates/contact-notification";
// import { buildContactConfirmationEmail } from "@/lib/email-templates/contact-confirmation";

// Rate limiting simple — adapté à un déploiement Docker single-instance
// Map<ip, { count, windowStart }>
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 3; // 3 soumissions
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // par heure

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

// Nettoyage périodique pour éviter les fuites mémoire
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(ip);
      }
    }
  },
  30 * 60 * 1000, // toutes les 30 min
);

type ContactBody = {
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  projectTypes?: string[];
  description?: string;
  privacy: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de soumissions. Réessayez dans une heure." },
      { status: 429 },
    );
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { name, email, phone, budget, projectTypes, description, privacy } = body;

  // Validation
  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Nom et email sont obligatoires" },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  }

  if (!privacy) {
    return NextResponse.json(
      { error: "Vous devez accepter la politique de confidentialité" },
      { status: 400 },
    );
  }

  // TODO: Réactiver quand domaine marrynov.re vérifié en prod
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // const toEmail = process.env.CONTACT_TO_EMAIL ?? "nicolas@marrynov.re";
  // const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "contact@marrynov.re";

  // Notifier n8n en fire-and-forget (non bloquant, dégradation gracieuse si n8n est down)
  if (process.env.N8N_WEBHOOK_NOUVEAU_LEAD) {
    fetch(process.env.N8N_WEBHOOK_NOUVEAU_LEAD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: name.trim(),
        email: email.trim(),
        telephone: phone?.trim(),
        secteur: projectTypes?.join(", "),
        message: description?.trim(),
        budget: budget?.replace(/[^0-9]/g, ""),
      }),
    }).catch((err) =>
      console.warn("[contact/route] n8n webhook failed (non-critical):", err),
    );
  }

  try {
    // TODO: Réactiver Resend quand le domaine marrynov.re sera vérifié en prod
    // En attendant, n8n (webhook ci-dessus) gère la notification + ticket Linear
    /*
    const [notifResult, confirmResult] = await Promise.allSettled([
      resend.emails.send({
        from: `MARRYNOV <${fromEmail}>`,
        to: toEmail,
        replyTo: email.trim(),
        subject: `🔔 Nouveau lead — ${name.trim()} (${projectTypes?.join(", ") ?? "non précisé"})`,
        html: buildContactNotificationEmail({
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim(),
          budget,
          projectTypes,
          description: description?.trim(),
        }),
      }),
      resend.emails.send({
        from: `Nicolas · MARRYNOV <${fromEmail}>`,
        to: email.trim(),
        subject: "Votre demande a bien été reçue — MARRYNOV",
        html: buildContactConfirmationEmail(name.trim()),
      }),
    ]);

    if (notifResult.status === "rejected") {
      console.error("[contact/route] Échec notification interne:", notifResult.reason);
      return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
    }

    if (confirmResult.status === "rejected") {
      console.warn("[contact/route] Échec auto-reply prospect:", confirmResult.reason);
    }
    */

    return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("[contact/route] Erreur inattendue:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
