/**
 * Template email HTML — Confirmation automatique envoyée au prospect
 * Best practice : rassure le client, donne une attente claire (réponse 24h)
 */

export function buildContactConfirmationEmail(name: string): string {
  const firstName = name.split(" ")[0];

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Votre demande a bien été reçue — MARRYNOV</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6b40a0 0%,#8b5cf6 100%);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600">MARRYNOV</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700">Demande bien reçue ✓</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0">
              <p style="margin:0 0 16px;font-size:16px;color:#2c3e50;font-weight:600">Bonjour ${firstName},</p>
              <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.8">
                Merci pour votre message ! J'ai bien reçu votre demande et je vous recontacte <strong>sous 24h</strong> (jours ouvrés).
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#475569;line-height:1.8">
                En attendant, n'hésitez pas à consulter mes réalisations ou à me contacter directement si votre besoin est urgent.
              </p>

              <!-- Info box -->
              <div style="background:#f8f5ff;border-radius:10px;padding:20px 24px;margin-bottom:28px">
                <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#6b40a0;text-transform:uppercase;letter-spacing:0.05em">Ce qui se passe ensuite</p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:10px;vertical-align:top;width:28px;font-size:16px">1️⃣</td>
                    <td style="padding-bottom:10px;font-size:13px;color:#475569;line-height:1.6"><strong>Je lis votre demande</strong> en détail et prépare une réponse personnalisée</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:10px;vertical-align:top;font-size:16px">2️⃣</td>
                    <td style="padding-bottom:10px;font-size:13px;color:#475569;line-height:1.6"><strong>Je reviens vers vous sous 24h</strong> avec une estimation et des questions si besoin</td>
                  </tr>
                  <tr>
                    <td style="vertical-align:top;font-size:16px">3️⃣</td>
                    <td style="font-size:13px;color:#475569;line-height:1.6"><strong>On fixe un appel</strong> pour affiner votre projet (30 min, gratuit)</td>
                  </tr>
                </table>
              </div>

              <div style="text-align:center">
                <a href="https://marrynov.re/projets" style="display:inline-block;background:#6b40a0;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px">Voir mes réalisations</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f5ff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center">
              <p style="margin:0 0 6px;font-size:12px;color:#94a3b8">Nicolas — Développeur Web & Mobile à La Réunion</p>
              <p style="margin:0;font-size:12px;color:#94a3b8">
                <a href="https://marrynov.re" style="color:#6b40a0;text-decoration:none">marrynov.re</a>
                &nbsp;·&nbsp;
                <a href="mailto:nicolas@marrynov.re" style="color:#6b40a0;text-decoration:none">nicolas@marrynov.re</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1">Vous recevez cet email car vous avez soumis le formulaire de contact sur marrynov.re.<br/>Vos données ne sont utilisées que pour traiter votre demande.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
