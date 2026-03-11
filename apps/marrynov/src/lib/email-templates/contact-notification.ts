/**
 * Template email HTML — Notification de lead entrant pour Nicolas
 * Reçu côté MARRYNOV quand un prospect soumet le formulaire de contact
 */

const BUDGET_LABELS: Record<string, string> = {
  "0-2500": "0 € – 2 500 €",
  "2500-5000": "2 500 € – 5 000 €",
  "5000-12000": "5 000 € – 12 000 €",
  "12000+": "12 000 € et plus",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  showcase: "Site vitrine",
  ecommerce: "E-commerce",
  webapp: "Application web",
  mobile: "Application mobile",
  automation: "Automatisation métier",
  dashboard: "Dashboard / Backoffice",
  redesign: "Refonte de site",
  maintenance: "Maintenance / TMA",
  other: "Autre",
};

export type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  projectTypes?: string[];
  description?: string;
};

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 16px;background:#f8f5ff;border-radius:6px;font-weight:600;color:#2c3e50;font-size:13px;width:160px;vertical-align:top">${label}</td>
      <td style="padding:10px 16px;color:#334155;font-size:14px;vertical-align:top">${value}</td>
    </tr>
    <tr><td colspan="2" style="height:6px"></td></tr>
  `;
}

export function buildContactNotificationEmail(data: ContactFormData): string {
  const { name, email, phone, budget, projectTypes, description } = data;

  const projectLabels = (projectTypes ?? [])
    .map((t) => PROJECT_TYPE_LABELS[t] ?? t)
    .join(", ");

  const budgetLabel = budget ? (BUDGET_LABELS[budget] ?? budget) : null;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nouveau lead — MARRYNOV</title>
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
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:700">Nouveau lead entrant</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px">${new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("Nom", name)}
                ${row("Email", `<a href="mailto:${email}" style="color:#6b40a0;text-decoration:none;font-weight:600">${email}</a>`)}
                ${phone ? row("Téléphone", `<a href="tel:${phone}" style="color:#6b40a0;text-decoration:none">${phone}</a>`) : ""}
                ${budgetLabel ? row("Budget", budgetLabel) : ""}
                ${projectLabels ? row("Type(s) de projet", projectLabels) : ""}
              </table>

              ${
                description
                  ? `
              <div style="margin-top:20px;padding:16px 20px;background:#fafafa;border-left:3px solid #6b40a0;border-radius:0 8px 8px 0">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Description du projet</p>
                <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap">${description.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
              </div>`
                  : ""
              }

              <!-- CTA -->
              <div style="margin-top:28px;text-align:center">
                <a href="mailto:${email}?subject=Re: Votre demande MARRYNOV" style="display:inline-block;background:#6b40a0;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px">Répondre à ${name.split(" ")[0]}</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f5ff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center">
              <p style="margin:0;font-size:12px;color:#94a3b8">Reçu via le formulaire de contact sur <strong>marrynov.re</strong></p>
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
