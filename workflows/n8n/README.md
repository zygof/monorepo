# Workflows n8n — MARRYNOV

> Automatisations self-hosted pour l'activité MARRYNOV et les clients.
> Instance : `http://n8n.localhost` (local) / `https://n8n.marrynov.re` (prod)

---

## Structure

```
workflows/n8n/
├── internal/          Automatisations MARRYNOV internes
│   ├── W01_nouveau_lead.json
│   ├── W02_onboarding_client.json
│   ├── W03_relance_devis.json
│   └── W04_rapport_hebdo.json
└── clients/           Templates réutilisables par secteur
    ├── W05_rappel_rdv.json
    ├── W06_notification_commande.json
    ├── W07_panier_abandonne.json
    ├── W08_avis_post_prestation.json
    ├── W09_alerte_stock.json
    └── W10_sync_google_calendar.json
```

---

## Configuration initiale n8n

### 1. Credentials à créer (dans n8n > Settings > Credentials)

| Credential ID           | Type                   | Paramètres                                                           |
| ----------------------- | ---------------------- | -------------------------------------------------------------------- |
| `resend-smtp`           | SMTP                   | host: `smtp.resend.com`, port: `465`, user: `resend`, pass: `RE_xxx` |
| `linear-api`            | Linear API             | API Key depuis Linear > Settings > API                               |
| `github-token`          | GitHub PAT             | Scopes: `repo`, `admin:org`                                          |
| `discord-webhook`       | Discord Webhook        | URL depuis Discord > Intégrations de serveur                         |
| `freebe-api`            | HTTP Header Auth       | Header: `Authorization`, Value: `Bearer {API_KEY}`                   |
| `twilio-api`            | Twilio API             | Account SID + Auth Token                                             |
| `postgres-client`       | PostgreSQL             | Connexion BDD de l'app client (par workflow)                         |
| `google-calendar-oauth` | Google Calendar OAuth2 | OAuth2 via Google Cloud Console                                      |

### 2. Variables d'environnement n8n

Ajouter dans le docker-compose ou `.env` n8n :

```env
# Slack/Discord pour les alertes d'erreur
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/xxx

# Linear
LINEAR_TEAM_ID=TEAM_ID_ICI

# Twilio (pour les SMS)
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Importer un workflow

1. Ouvrir n8n (`http://n8n.localhost`)
2. Cliquer **+ New workflow** > **Import from file**
3. Sélectionner le fichier `.json`
4. Configurer les credentials manquants (icône de clé sur chaque nœud)
5. Activer le workflow avec le toggle

---

## Workflows internes MARRYNOV

### W01 — Alerte Nouveau Lead

**Trigger :** `POST /webhook/nouveau-lead`
**Usage :** Connecter le formulaire de contact marrynov.re à ce webhook

**Ce qu'il fait :**

1. Reçoit les données du formulaire
2. Calcule un score de lead (0-100) basé sur budget, secteur, téléphone, qualité du message
3. Envoie un email de notification à Nicolas avec le score et les détails
4. Crée un ticket Linear avec la priorité correspondante (Urgent/High/Medium)
5. Retourne une réponse 200 immédiate au site

**Score lead :**

- 🔥 HOT (≥70) → Priorité Urgent dans Linear
- ⚡ WARM (≥40) → Priorité High
- 🧊 COLD (<40) → Priorité Medium

**Intégration Next.js :**

```typescript
// Dans apps/marrynov/src/app/api/contact/route.ts
await fetch('http://n8n.localhost/webhook/nouveau-lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nom, email, telephone, secteur, message, budget }),
});
```

---

### W02 — Onboarding Nouveau Client

**Trigger :** `POST /webhook/freebe-webhook`
**Usage :** Configurer dans Freebe > Paramètres > Webhooks

**Ce qu'il fait :**

1. Détecte une facture payée dans Freebe
2. Génère le slug client (`prenom-secteur`) et sélectionne le bon template
3. En parallèle :
   - Email de bienvenue personnalisé au client
   - Création du repo GitHub privé (`marrynov/client-[slug]`)
   - Ticket Linear d'onboarding avec checklist complète
4. Notification Discord récapitulative avec prochaines étapes

**Payload Freebe attendu :**

```json
{
  "client": { "nom": "Marie Dupont", "email": "marie@example.re", "secteur": "coiffure" },
  "facture": { "numero": "2024-001", "montant": 1500 }
}
```

---

### W03 — Relance Devis en Attente

**Trigger :** Cron — lundi au vendredi à 8h00
**Usage :** Activer une fois, tourne en arrière-plan automatiquement

**Ce qu'il fait :**

1. Récupère tous les devis en statut `pending` via l'API Freebe
2. Catégorise : URGENTS (+10j), À RELANCER (+5j), OK (<5j)
3. Pour les URGENTS : email de relance finale + alerte Discord
4. Pour À RELANCER : email de suivi simple

**Important :** Adapter l'endpoint API Freebe selon la version utilisée.

---

### W04 — Rapport Hebdomadaire

**Trigger :** Cron — chaque lundi à 7h00
**Usage :** Activer une fois, tourne automatiquement

**Ce qu'il fait :**

1. Calcule les dates de la semaine précédente
2. Récupère en parallèle :
   - CA encaissé (factures payées) via Freebe
   - Activité Linear (tickets créés, terminés, en cours)
3. Génère et envoie un email récapitulatif formaté

---

## Workflows clients (templates)

### W05 — Rappel RDV _(Coiffure / Restaurant)_

**Trigger :** `POST /webhook/rappel-rdv`
**Délais configurables :** email J-1 (défaut), SMS H-2 (défaut)

**Payload minimal :**

```json
{
  "rdv": { "id": "rdv-001", "date": "2026-03-15", "heure": "14:30", "service": "Coupe" },
  "client": { "nom": "Sophie", "email": "sophie@example.re", "telephone": "+262692123456" },
  "config": {
    "nomEtablissement": "Salon Marie",
    "telephone": "0262 12 34 56",
    "delaiEmail": 24,
    "delaiSMS": 2
  }
}
```

**Technologie :** Wait nodes n8n (persistants aux redémarrages) + Twilio SMS + Resend Email

---

### W06 — Notification Nouvelle Commande _(E-commerce / Pizzeria)_

**Trigger :** `POST /webhook/stripe-webhook` (event: `payment_intent.succeeded`)
**Configurer dans Stripe Dashboard :** Webhooks > Ajouter endpoint

**Ce qu'il fait :**

1. Parse l'événement Stripe (les données client doivent être dans les `metadata`)
2. ACK 200 immédiat à Stripe
3. En parallèle : email client + email gérant + mise à jour BDD

**Metadata PaymentIntent à passer depuis l'app :**

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency: 'eur',
  metadata: {
    order_id: commande.id,
    client_nom: client.nom,
    client_email: client.email,
    etablissement: 'Pizza Chez Paolo',
    email_gerant: 'paolo@pizza.re',
  },
});
```

---

### W07 — Récupération Panier Abandonné _(E-commerce)_

**Trigger :** `POST /webhook/panier-abandonne` (déclenché par l'app après 1h sans conversion)

**Séquence :**

- **J+0** : Réception du webhook, planification des rappels
- **J+1** : Vérif BDD → si pas commandé → email de rappel simple
- **J+3** : Vérif BDD → si toujours pas commandé → email avec code promo

**Important :** Chaque email vérifie en BDD si une commande a été passée entre-temps.

---

### W08 — Avis Client Post-Prestation _(Tous secteurs)_

**Trigger :** `POST /webhook/prestation-terminee`
**Délai :** 24h après la prestation

**Ce qu'il fait :** Email de demande d'avis avec bouton Google My Business et/ou page d'avis interne.

---

### W09 — Alerte Stock Faible _(E-commerce)_

**Trigger :** Cron toutes les heures
**Prérequis BDD :** Table `produits` avec colonnes `stock_actuel`, `seuil_alerte`, `email_gerant`

**Ce qu'il fait :**

1. Requête les produits sous seuil d'alerte
2. Groupe par email gérant
3. Envoie un email récapitulatif avec tableau des produits (rupture mise en rouge)

---

### W10 — Sync Google Calendar _(Coiffure / Restaurant)_

**Trigger :** `POST /webhook/nouvelle-reservation`
**Prérequis :** Credential Google Calendar OAuth2

**Ce qu'il fait :**

1. Crée un événement dans le Google Calendar du gérant
2. Envoie automatiquement une invitation email au client
3. Envoie un email de confirmation via Resend

---

## Gestion des erreurs

Chaque workflow interne inclut un **Error Trigger** connecté à Discord.
Pour ajouter la gestion d'erreur à un workflow client :

1. Ajouter un nœud **Error Trigger** (connecté à rien)
2. Ajouter un nœud **Discord** ou **Email** en sortie
3. Dans les settings du workflow : activer "Error workflow" → sélectionner ce même workflow

---

## Convention de nommage

```
[SECTEUR/TYPE] - WXX Description
```

Exemples :

- `[MARRYNOV] - W01 Alerte Nouveau Lead`
- `[COIFFURE/RESTAURANT] - W05 Rappel RDV`
- `[ECOMMERCE] - W06 Notification Nouvelle Commande`

---

## Déploiement en production

1. Exporter les workflows depuis n8n local (Menu > Download)
2. Versionner le JSON dans ce repo
3. Importer sur n8n prod (`https://n8n.marrynov.re`)
4. Reconfigurer les credentials (prod vs local)
5. Mettre à jour les URLs de webhook dans les apps (passer de `n8n.localhost` à `n8n.marrynov.re`)

---

_Maintenu par Nicolas — MARRYNOV | Timezone : Indian/Reunion_
