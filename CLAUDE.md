# MARRYNOV — Contexte projet pour Claude Code

## Identité

- Entreprise : MARRYNOV (micro-entreprise freelance, La Réunion)
- Propriétaire : Nicolas, développeur fullstack 12 ans d'expérience
- Slogan : "Ici pour vous développer."
- Domaines : marrynov.re / marrynov.fr

## Stack technique

- Framework : Next.js 15 App Router, TypeScript strict
- ORM : Prisma + PostgreSQL
- UI : Tailwind CSS + Shadcn/ui + design tokens CSS
- Auth : next-auth v5
- Paiement : Stripe
- Emails : Resend
- Uploads : Uploadthing
- Tests : Vitest + Testing Library
- Déploiement : Dokploy (self-hosted sur Contabo VPS)
- Automatisation : n8n (self-hosted)
- Ticketing : Linear
- Monitoring : Uptime Kuma + Sentry
- Analytics : GA4 + GTM

## Infrastructure (décisions techniques validées)

- **DNS** : Cloudflare (API Token pour Traefik ACME / Let's Encrypt wildcard)
- **Registry Docker** : ghcr.io (GitHub Container Registry — gratuit, intégré GitHub Actions)
- **Backup distant** : Backblaze B2 (S3-compatible, natif Dokploy, le moins cher)
- **Sécurité VPS** : UFW + Fail2ban + SSH par clé ED25519 uniquement (no password)
- **Orchestration** : Docker Swarm (via Dokploy) + Docker Compose pour stacks tierces
- **Reverse proxy** : Traefik v3 (intégré Dokploy, SSL auto via Cloudflare DNS challenge)
- **Hébergeur** : Contabo VPS S — 4vCPU / 8Go RAM / 200Go NVMe — lancement prévu juillet/août

## URLs de production (à configurer en juillet)

- `dokploy.marrynov.re` → Dashboard Dokploy
- `n8n.marrynov.re` → Automatisation n8n
- `uptime.marrynov.re` → Uptime Kuma
- `[secteur].marrynov.re`→ Démos clients

## Environnement local (WSL2 — simulation prod)

- Docker Engine 29.3.0 natif (systemd, pas Docker Desktop)
- Dokploy v0.28.4 local sur http://localhost:3000
- n8n local sur http://n8n.localhost
- Uptime Kuma sur http://uptime.localhost
- Registry local sur localhost:5001
- Scripts infra : ~/MARRYNOV/infra/
- Healthcheck : ~/MARRYNOV/infra/backup/scripts/healthcheck.sh
- Backup : ~/MARRYNOV/infra/backup/scripts/backup.sh (cron 2h00 quotidien)

## Structure monorepo (Turborepo)

```
monorepo/
├── apps/
│   ├── template-pizza/
│   ├── template-coiffure/
│   ├── template-restaurant/
│   ├── template-location-voiture/
│   ├── template-boutique/
│   └── site-marrynov/
├── packages/
│   ├── ui/            — composants Shadcn/ui partagés
│   ├── config-eslint/
│   ├── config-typescript/
│   ├── design-tokens/ — variables CSS globales
│   ├── database/      — Prisma schema + client partagé
│   └── monitoring/    — Sentry + Uptime Kuma helpers
├── tools/
│   └── create-client/ — script init nouveau client
├── .claude/
│   ├── commands/      — slash commands
│   ├── skills/        — skills MARRYNOV
│   └── agents/        — subagents spécialisés
└── workflows/n8n/
```

## Conventions de code

- Langue des commits : français, Conventional Commits
  - feat(scope): description
  - fix(scope): description
  - chore(scope): description
  - docs(scope): description
- Pas de mention IA/Claude dans les commits
- TypeScript strict: no any, pas d'assertions de type inutiles
- Composants : PascalCase, fichiers kebab-case
- Hooks custom : prefix use-, dans hooks/
- Fonctions utilitaires : camelCase, dans lib/
- Variables CSS : --color-primary, --font-heading, etc.
- Toujours co-localiser les tests avec le fichier testé

## Clients

- Format slug : [prenom]-[secteur] (ex: marie-coiffure, dupont-pizza)
- Repo client : github.com/marrynov/client-[slug]
- Sous-domaine démo : [secteur].marrynov.re
- Config client : config/client.config.ts (SEUL fichier à modifier par client)

## Chemins exacts (WSL2)

- Code clients : ~/MARRYNOV/clients/client-[slug]/
  (= /home/zygof/MARRYNOV/clients/client-[slug]/ — dans le WSL, pas sur D:)
- Documents : /mnt/d/zygof/Documents/MARRYNOV/01_CLIENTS/[NOM-SECTEUR]/
  (= D:\zygof\Documents\MARRYNOV\01_CLIENTS\[NOM-SECTEUR]\ sur Windows)
- Monorepo : /mnt/d/dev/MARRYNOV/monorepo/
  (= D:\dev\MARRYNOV\monorepo\ sur Windows)
- Ne JAMAIS créer de dossiers dans /home/zygof/ — c'est le home WSL2, pas Windows

## Règles absolues

- Ne jamais commiter de .env
- Ne jamais hardcoder de clés API
- Toujours créer un .env.example à jour
- Chaque nouvelle app doit avoir un Dockerfile multi-stage
- Chaque PR doit passer lint + typecheck + tests avant merge
- Les migrations Prisma sont toujours reviewées manuellement avant d'être appliquées

## MCP disponibles

- linear : gestion tickets/projets (https://mcp.linear.app/mcp)
- figma : lecture/push designs (https://mcp.figma.com/mcp)
- github : repos, PRs, issues
- notion : CRM, TMA, facturation

## Workflow Figma → Code (design custom client)

Skill activée : `figma-to-code`

1. Nicolas crée le Figma client avec variables nommées selon convention MARRYNOV
2. `get_variable_defs` → extraire tokens → `packages/design-tokens/tokens.css` + `client.config.ts`
3. `get_design_context` → **toujours le premier appel** avant d'implémenter une section
4. Code Connect mappe composants Figma → `packages/ui/` (fichiers `.figma.tsx`)
5. Zéro couleur hex hardcodée — toujours via CSS variables (`--color-primary`, etc.)

Convention nommage variables Figma = CSS variables = Tailwind config (primary, secondary, muted, etc.)
Code Connect : installer `@figma/code-connect` dans packages/ui quand les composants seront construits.

## Contacts utiles

- Coworking : Le Caré, Sainte-Clotilde (QPV/ZFU)
- Comptabilité : Freebe
- Hébergement clients : Contabo VPS S (4vCPU / 8Go / 200Go NVMe)
