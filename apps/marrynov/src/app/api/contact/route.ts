import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "nicolas@marrynov.re";
  const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "contact@marrynov.re";

  try {
    const body = await request.json();
    const { name, email, subject, message, privacy } = body as Record<string, string>;

    if (!email || !message || !privacy) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: subject
        ? `[MARRYNOV Contact] ${subject}`
        : `[MARRYNOV Contact] Nouveau message de ${name ?? email}`,
      text: `
Nom : ${name ?? "Non renseigné"}
Email : ${email}
Sujet : ${subject ?? "Non renseigné"}

Message :
${message}

---
Envoyé depuis marrynov.re
      `.trim(),
    });

    return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("[contact/route] Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
