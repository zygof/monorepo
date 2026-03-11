# @marrynov/monitoring

Package partagé de monitoring, analytics et tracking pour tous les templates MARRYNOV.

---

## Contenu

| Module            | Export                                           | Description                   |
| ----------------- | ------------------------------------------------ | ----------------------------- |
| `sentry.ts`       | `sentryBeforeSend`, `getBaseSentryConfig`        | Filtres Sentry partagés       |
| `analytics.ts`    | `useAnalytics()`                                 | Hook typé pour les events GA4 |
| `gtm.tsx`         | `GtmProvider`, `GtmNoScript`, `updateGtmConsent` | GTM + Consent Mode v2         |
| `consent-banner/` | `ConsentBanner`, `useConsentStore`               | Bannière RGPD CNIL            |

---

## Partie 1 — Uptime Kuma

**Fichier :** `~/MARRYNOV/infra/uptime-kuma/docker-compose.yml`

### Démarrer

```bash
cd ~/MARRYNOV/infra/uptime-kuma
docker compose up -d
```

Accès local : http://uptime.localhost
Accès prod : https://uptime.marrynov.re

### Configuration des monitors (UI Uptime Kuma)

Après le premier démarrage, créer un compte admin puis ajouter les monitors :

| Monitor             | Type     | URL / Host                     | Intervalle |
| ------------------- | -------- | ------------------------------ | ---------- |
| Site MARRYNOV       | HTTP(s)  | https://marrynov.re            | 60s        |
| n8n                 | HTTP(s)  | https://n8n.marrynov.re        | 60s        |
| Dokploy             | HTTP(s)  | https://dokploy.marrynov.re    | 60s        |
| PostgreSQL          | TCP Port | `db:5432`                      | 60s        |
| Next.js healthcheck | HTTP(s)  | https://marrynov.re/api/health | 60s        |

### Alertes

Dans Uptime Kuma → Settings → Notifications :

- **Discord** : webhook URL de ton serveur
- **Email** : nicolas@marrynov.re via SMTP Resend

### Page de statut publique

Dans Uptime Kuma → Status Pages → New :

- Slug : `status`
- Domaine custom : `status.marrynov.re`
- Ajouter tous les monitors publics

---

## Partie 2 — Sentry

### Projet Sentry à créer

1. Aller sur sentry.io → New Project → Next.js
2. Nom : `marrynov-site` (un par template, pas par client)
3. Récupérer le DSN

### Variables d'environnement

```env
SENTRY_DSN=https://xxx@oXXX.ingest.sentry.io/XXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@oXXX.ingest.sentry.io/XXX
SENTRY_ORG=marrynov
SENTRY_PROJECT=marrynov-site
SENTRY_AUTH_TOKEN=sntrys_xxx  # upload sourcemaps en CI
```

### Filtres actifs (sentryBeforeSend)

- Erreurs réseau client (`Failed to fetch`, `NetworkError`)
- Script error (crawlers/iframes)
- ResizeObserver loop
- Extensions navigateur (chrome-extension://, moz-extension://)

### Usage

```ts
// sentry.server.config.ts / sentry.client.config.ts
import { sentryBeforeSend } from '@marrynov/monitoring/sentry';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend: sentryBeforeSend,
  // ...
});
```

### Alertes Sentry

Dans Sentry → Alerts → Create Alert Rule :

- Condition : `Number of errors > 10 in 1h`
- Action : envoyer un email à nicolas@marrynov.re

---

## Partie 3 — GTM + GA4

### Architecture

```
Consent Defaults (beforeInteractive)
        ↓
GTM charge (afterInteractive)
        ↓
ConsentBanner → user accepte/refuse
        ↓
gtag('consent', 'update', ...) → GTM fire les tags analytics
```

### Intégration dans un template

Dans `app/[locale]/layout.tsx` :

```tsx
import { GtmProvider, GtmNoScript } from '@marrynov/monitoring/gtm';
import { ConsentBanner } from '@marrynov/monitoring/consent-banner';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? '';

export default function Layout({ children }) {
  return (
    <html>
      {GTM_ID && <GtmProvider gtmId={GTM_ID} />}
      <body>
        {GTM_ID && <GtmNoScript gtmId={GTM_ID} />}
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
```

### Variables d'environnement

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

### Configuration GTM (UI)

1. Créer un Container GTM par client
2. Ajouter un tag **Google Analytics : Événement GA4** (configuration)
   - Tag de configuration : `G-XXXXXXXXXX`
   - Déclencheur : All Pages
3. Activer le **Consent Mode** dans GTM → Admin → Container Settings

### useAnalytics — events disponibles

```ts
import { useAnalytics } from '@marrynov/monitoring/analytics';

function MonComposant() {
  const { track } = useAnalytics();

  // E-commerce
  track('view_item', {
    item_id: 'pizza-01',
    item_name: 'Margherita',
    item_category: 'pizza',
    price: 12.5,
  });
  track('add_to_cart', { item_id: 'pizza-01', item_name: 'Margherita', quantity: 1, price: 12.5 });
  track('purchase', {
    transaction_id: 'TXN-001',
    value: 25.0,
    currency: 'EUR',
    items: [
      {
        item_id: 'pizza-01',
        item_name: 'Margherita',
        item_category: 'pizza',
        quantity: 2,
        price: 12.5,
      },
    ],
  });

  // Réservation
  track('reservation_confirmed', {
    reservation_id: 'RES-001',
    service_id: 'coupe-femme',
    value: 30,
    date: '2026-04-15',
  });

  // Location voiture
  track('booking_confirmed', {
    booking_id: 'BK-001',
    vehicle_id: 'clio-01',
    vehicle_category: 'citadine',
    value: 150,
    days: 3,
  });
}
```

---

## Partie 4 — Bannière RGPD (Consent Mode v2)

### Comportement

| État                 | Action                                |
| -------------------- | ------------------------------------- |
| Premier visit        | Bannière affichée, analytics bloquées |
| Accepter tout        | Analytics + Ads activés, cookie 365j  |
| Refuser              | Analytics + Ads refusés, cookie 365j  |
| Analytics uniquement | GA4 activé, Ads refusés               |

### Personnalisation

La bannière utilise les CSS variables du projet (`--color-primary`, `--color-accent`, `--color-dark`, `--color-border`). Elle s'adapte automatiquement au design tokens de chaque template.

Pour modifier le texte, fork le composant dans l'app cliente.

### Données de test

```bash
# Tester en local : vider le localStorage dans la console navigateur
localStorage.removeItem("marrynov_consent_v1")
# → La bannière réapparaît au rechargement
```

---

## Partie 5 — Google Ads (via GTM)

> Pas de code à modifier — tout se fait dans l'UI GTM.

### Configuration dans GTM

1. Ajouter un tag **Google Ads : Conversion Tracking**
   - Conversion ID : `AW-XXXXXXXXX`
   - Conversion Label : depuis Google Ads → Outils → Suivi des conversions
   - Déclencheur : Event personnalisé → nom de l'event correspondant

| Template            | Event GTM à tracker     |
| ------------------- | ----------------------- |
| Pizzeria            | `purchase`              |
| Coiffure/Restaurant | `reservation_confirmed` |
| Location voiture    | `booking_confirmed`     |

2. Ajouter un tag **Google Ads : Remarketing**
   - Déclencheur : All Pages
   - Pour les audiences de retargeting

3. Activer le **Conversion Linker** (tag natif GTM) — déclencheur : All Pages

### Livrable client

- Export GTM container (JSON) → à importer dans le GTM du client
- URL de test GTM : Mode Aperçu dans GTM
- Vérification dans GA4 : Temps réel → Événements

---

## Partie 6 — Dashboard Admin GA4 Data API

**Route :** `/admin/stats`
**API :** `GET /api/admin/analytics` (revalidation 24h)

### Setup compte de service Google Cloud

```bash
# 1. Créer un projet Google Cloud (ou utiliser l'existant)
# 2. Activer l'API : Google Analytics Data API
gcloud services enable analyticsdata.googleapis.com

# 3. Créer un compte de service
gcloud iam service-accounts create ga4-readonly \
  --display-name="GA4 Read-only MARRYNOV"

# 4. Télécharger la clé JSON
gcloud iam service-accounts keys create ga4-key.json \
  --iam-account=ga4-readonly@[PROJECT_ID].iam.gserviceaccount.com

# 5. Dans GA4 → Admin → Gestion des accès → Ajouter
# Email : ga4-readonly@[PROJECT_ID].iam.gserviceaccount.com
# Rôle : Lecteur
```

### Variables d'environnement

```env
GA4_PROPERTY_ID=properties/XXXXXXXXX
GA4_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"..."}
```

Pour `GA4_SERVICE_ACCOUNT_KEY`, inliner le JSON sur une ligne :

```bash
cat ga4-key.json | jq -c . | tr -d '\n'
```

### Métriques affichées

- Visiteurs uniques, sessions, pages vues, taux de rebond, durée moy. session
- Graphique visiteurs/sessions par jour (28j)
- Sources de trafic (Organic Search, Direct, Social, etc.)
- Top 5 pages les plus vues

---

## Données de test — valider l'intégration

### 1. Tester Sentry

```ts
// Dans n'importe quel composant ou route API :
throw new Error('[TEST SENTRY] Vérification intégration');
// → Doit apparaître dans Sentry sous 30s
```

### 2. Tester GTM + GA4

```js
// Console navigateur
window.dataLayer.push({ event: 'test_event', debug: true });
// → Visible dans GTM Preview mode + GA4 Temps réel
```

### 3. Tester useAnalytics

```ts
const { track } = useAnalytics();
track('cta_click', { location: 'hero', label: 'Demander un devis' });
// → Vérifier dans GA4 → Temps réel → Événements : "cta_click"
```

### 4. Tester le dashboard GA4

```bash
# Vérifier que l'API répond
curl http://localhost:3000/api/admin/analytics | jq .
```

---

## Checklist mise en production

- [ ] GTM Container ID configuré dans Dokploy (env var `NEXT_PUBLIC_GTM_ID`)
- [ ] GA4 Measurement ID dans GTM
- [ ] Sentry DSN configuré et alertes activées
- [ ] Uptime Kuma : monitor ajouté pour le nouveau site
- [ ] Google Search Console : site vérifié + sitemap soumis
- [ ] GA4 Data API : compte de service créé + clé configurée
- [ ] Bannière cookies testée (refus = pas de tracking, acceptation = tracking actif)
