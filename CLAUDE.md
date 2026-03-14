# MARRYNOV — Contexte projet pour Claude Code

## Identité

- Entreprise : MARRYNOV (micro-entreprise freelance, La Réunion)
- Propriétaire : Nicolas MARRY, développeur fullstack 8 ans d'expérience salariée
- Slogan : "Ici pour vous développer."
- Lancement officiel : 1er août 2026
- Domaines : marrynov.re / marrynov.fr

## Stack technique

- Framework : Next.js 15 App Router, TypeScript strict
- ORM : Prisma + PostgreSQL 16
- UI : Tailwind CSS + Shadcn/ui + design tokens CSS
- Auth : next-auth v5
- Paiement : Stripe
- Emails : Resend
- Uploads : Uploadthing
- Validation : Zod
- Tests : Vitest + Testing Library
- Monorepo : Turborepo + pnpm workspaces
- Déploiement : Dokploy v0.28.6 (self-hosted sur Contabo VPS)
- Automatisation : n8n (self-hosted, SQLite)
- Ticketing : Linear
- Monitoring : Uptime Kuma + Sentry
- Analytics : GA4 + GTM

## Infrastructure (production — opérationnelle)

- **Hébergeur** : Contabo Cloud VPS 6C — 6vCPU / 12Go RAM / 200Go SSD
- **IP** : 37.60.227.66
- **OS** : Ubuntu 24.04 LTS
- **DNS** : Cloudflare (marrynov.re + marrynov.fr)
- **Reverse proxy** : Traefik v3 (SSL auto via Cloudflare DNS challenge)
- **Orchestration** : Docker Compose via Dokploy
- **Registry Docker** : ghcr.io (GitHub Container Registry)
- **Backup** : Backblaze B2 EU — eu-central-003
- **Sécurité** : UFW + Fail2ban + SSH par clé ED25519 uniquement

## URLs de production (actives)

- `dokploy.marrynov.re` → Dashboard Dokploy v0.28.6
- `n8n.marrynov.re` → Automatisation n8n (SQLite)
- `uptime.marrynov.re` → Monitoring Uptime Kuma 2.2.1
- `marrynov.re` → Site vitrine (déploiement à venir)
- `[template]-[tier].marrynov.re` → Démos commerciales (ex: coiffure-expert.marrynov.re)

## Services Dokploy (projet : infrastructure)

- `postgres-shared` → PostgreSQL 16-alpine (user: marrynov, db: marrynov)
- `redis-shared` → Redis 7-alpine
- `n8n` → n8n latest (port 5678, SQLite)
- `uptime-kuma` → Uptime Kuma 2.2.1 (port 3001)

## Structure monorepo (Turborepo)

```
monorepo/
├── apps/
│   ├── marrynov/                    → Site vitrine marrynov.re
│   ├── template-coiffure/           → Démo commerciale coiffure (MARRYHAIR)
│   ├── template-pizza/              → Démo commerciale pizza (MARRYPIZZA)
│   ├── template-restaurant/         → Démo commerciale restaurant (MARRYFOOD)
│   ├── template-location-voiture/   → Démo commerciale voiture (MARRYCAR)
│   └── [nouveau-projet]/            → Projets indépendants (influx, linestie, etc.)
├── packages/
│   ├── ui/                          → Composants Shadcn/ui partagés
│   ├── config-eslint/               → Config ESLint partagée
│   ├── config-typescript/           → tsconfig strict partagé
│   ├── design-tokens/               → Variables CSS par brand
│   ├── database/                    → Prisma schema + client partagé
│   └── monitoring/                  → Sentry + GTM helpers
├── tools/
│   └── create-client/               → Script init nouveau client
├── docs/
│   └── uxpilot-prompts/             → Prompts UX Pilot par template
├── workflows/
│   └── n8n/                         → Workflows n8n (internal + clients)
└── .claude/
    ├── commands/                    → Slash commands Claude Code
    ├── skills/                      → Skills MARRYNOV
    ├── agents/                      → Subagents spécialisés
    └── hooks/                       → Hooks pre-commit
```

## Types de projets — règle claire

```
DANS LE MONOREPO (zygof/monorepo)
├── apps/marrynov/          → site vitrine
├── apps/template-*/        → démos commerciales pour prospecter
└── apps/[nom-projet]/      → tes projets personnels (influx, linestie, etc.)

REPOS SÉPARÉS (marrynov/client-xxx)
└── Un repo GitHub dédié par client → isolé, archivable
```

- **C'est TON projet** → dans le monorepo
- **C'est le projet d'un CLIENT** → repo séparé `marrynov/client-[slug]`

## Règle base de données — 1 projet = 1 DB

```
postgres-shared (conteneur)
├── marrynov              → site vitrine
├── client_marie_coiffure → client Marie (isolée)
├── client_dupont_pizza   → client Dupont (isolée)
└── influx                → projet influx (isolée)
```

Créer une DB pour un nouveau projet :

```bash
docker exec -it [postgres-ID] psql -U marrynov -d marrynov -c "
  CREATE DATABASE [db_name];
  CREATE USER [user] WITH PASSWORD '[pwd]';
  GRANT ALL PRIVILEGES ON DATABASE [db_name] TO [user];
"
```

## Offres MARRYNOV — 3 tiers par template

Chaque template (coiffure, pizza, restaurant, location-voiture, boutique) propose **3 niveaux d'offre**.
Le tier est déterminé par une **unique variable d'env** : `NEXT_PUBLIC_OFFER_TIER`.

```
NEXT_PUBLIC_OFFER_TIER=standard|expert|premium
```

### Standard — Présence digitale

- Site vitrine : accueil, services, galerie, équipe, contact, pages légales
- Pas de réservation en ligne, pas d'auth, pas d'admin/staff
- CTAs redirigent vers `/contact` ou le téléphone
- Middleware bloque `/reserver`, `/compte`, `/admin`, `/staff` et APIs associées

### Expert — Réservation & Gestion

- Tout Standard +
- Réservation en ligne (booking wizard, calendrier, créneaux)
- Authentification (comptes clients, login/signup, Google OAuth)
- Admin back-office (services, RDV, galerie, équipe, horaires, avis, produits)
- Espace staff/styliste (agenda, clients, notes, walk-in)
- Programme de fidélité

### Premium — Paiement en ligne

- Tout Expert +
- Acompte Stripe à la réservation (configurable via `NEXT_PUBLIC_DEPOSIT_PERCENTAGE`, défaut 30%)
- Minimum d'acompte configurable via `NEXT_PUBLIC_DEPOSIT_MIN_EUROS` (défaut 5€)
- Step 4 dans le booking wizard avec Stripe PaymentElement
- PaymentIntent créé à `POST /api/bookings` quand `hasPayment()` est true
- Webhook Stripe (`/api/webhooks/stripe`) pour confirmation idempotente
- Confirmation client-side via `POST /api/bookings/:id/confirm-payment`
- Page retour 3D Secure : `/reserver/paiement-retour`
- Statut paiement sur le modèle Appointment (PaymentStatus enum)
- Email de confirmation inclut montant acompte + solde restant

### Sous-domaines démos

```
coiffure-standard.marrynov.re
coiffure-expert.marrynov.re
coiffure-premium.marrynov.re
```

### Fichier clé : `src/lib/offers.ts`

- `getOfferTier()` → lit `NEXT_PUBLIC_OFFER_TIER`, fallback 'expert'
- `hasBooking()`, `hasAuth()`, `hasAdmin()`, `hasStaff()`, `hasLoyalty()`, `hasPayment()`
- `getPrimaryCta()` → `/reserver` (Expert+) ou `/contact` (Standard)
- `calculateDeposit(totalCents)` → montant acompte (Premium)
- `getDepositPercentage()` → % acompte depuis env (défaut 30)
- `getDepositMinCents()` → minimum acompte en centimes depuis env (défaut 500)
- `formatCentsToEuros(cents)` → "12,50 €"

### Upgrade client

Changer `NEXT_PUBLIC_OFFER_TIER` dans le `.env` → redeploy. C'est tout.

## Clients — process complet

- Format slug : `[prenom]-[secteur]` (ex: marie-coiffure, dupont-pizza)
- Repo client : `github.com/marrynov/client-[slug]`
- Staging : `[prenom].marrynov.re`
- Prod : `[domaine-client.re]`
- Config client : `config/client.config.ts` (SEUL fichier à modifier)
- Offre client : `NEXT_PUBLIC_OFFER_TIER` dans `.env` (standard, expert, premium)
- DB : `client_[prenom]_[secteur]` (isolée dans postgres-shared)

## Design tokens — workflow Figma → Code

Skill activée : `figma-to-code`

1. Nicolas crée le Figma client avec variables nommées selon convention MARRYNOV
2. `get_variable_defs` → extraire tokens → `packages/design-tokens/` + `client.config.ts`
3. `get_design_context` → **toujours le premier appel** avant d'implémenter une section
4. Code Connect mappe composants Figma → `packages/ui/` (fichiers `.figma.tsx`)
5. Zéro couleur hex hardcodée — toujours via CSS variables

Convention : nommage Figma = CSS variables = Tailwind config (primary, secondary, muted…)

## CI/CD — GitHub Actions

```
push main     → build Docker → push ghcr.io → Dokploy webhook → prod
push develop  → build Docker → push ghcr.io → Dokploy webhook → staging
feature/*     → CI lint + typecheck + tests uniquement
```

- GitHub App : **MARRYNOV-Dokploy** (connectée à Dokploy)
- Registry : `ghcr.io/zygof/[app-name]:[branch]`
- Chaque app a son propre `Dockerfile` multi-stage

## Stratégie de branches

```
main        → Production stable. Deploy automatique.
develop     → Intégration. Toutes les features mergent ici.
feat/xxx    → Développement fonctionnalité
fix/xxx     → Correction bug
hotfix/xxx  → Correctif urgent (depuis main)
```

## Conventions de code

- Langue des commits : **français**, Conventional Commits
- Scopes : nom du package ou de l'app (ex: `feat(template-coiffure): ...`)
- Pas de mention IA/Claude dans les commits
- TypeScript strict : no any, pas d'assertions inutiles
- Composants : PascalCase, fichiers kebab-case
- Hooks custom : préfixe `use-`, dans `hooks/`
- Fonctions utilitaires : camelCase, dans `lib/`
- Variables CSS : `--color-primary`, `--font-heading`, etc.
- Tests co-localisés avec le fichier testé
- Chaque nouvelle app : Dockerfile multi-stage obligatoire
- Jamais de `.env` commité — `.env.example` toujours à jour
- Migrations Prisma : review manuelle avant application

## MCP disponibles

- `linear` → gestion tickets/projets (`https://mcp.linear.app/mcp`)
- `figma` → lecture/push designs (`https://mcp.figma.com/mcp`)
- `github` → repos, PRs, issues
- `notion` → CRM, TMA, facturation

## Environnement local (WSL2)

- Docker Engine 29.3.0 natif (systemd, pas Docker Desktop)
- Monorepo : `/mnt/d/dev/MARRYNOV/monorepo/`
- Clients : `~/MARRYNOV/clients/client-[slug]/`
- Documents : `/mnt/d/zygof/Documents/MARRYNOV/01_CLIENTS/[NOM-SECTEUR]/`
- **Ne JAMAIS créer de dossiers dans `/home/zygof/`** — c'est le home WSL2

## Règles absolues

- Jamais commiter de `.env`
- Jamais hardcoder de clés API
- Toujours créer un `.env.example` à jour
- Chaque app doit avoir un `Dockerfile` multi-stage
- Chaque PR doit passer lint + typecheck + tests avant merge
- Migrations Prisma toujours reviewées manuellement

## Contacts utiles

- Coworking : Le Caré, Sainte-Clotilde (QPV/ZFU) — contact : Gaultier
- Facturation : Freebe
- Client initial : ITAF (La Réunion)
