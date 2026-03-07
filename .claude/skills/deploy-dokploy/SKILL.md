---
name: deploy-dokploy
description: Activée automatiquement quand la tâche mentionne "déployer", "deployer", "mise en production", "push en prod", "Dokploy", "VPS". Contient la procédure complète de déploiement MARRYNOV.
---

# Skill — Déploiement Dokploy MARRYNOV

## Contexte infrastructure

- **Local (dev/répétition)** : Dokploy sur http://localhost:3000, registry sur localhost:5001
- **Prod (juillet+)** : Dokploy sur https://dokploy.marrynov.re, registry sur ghcr.io
- **Orchestration** : Docker Swarm (Dokploy) + Compose pour n8n/Uptime Kuma
- **CI/CD** : GitHub Actions → ghcr.io → Dokploy API

## Checklist avant déploiement

- [ ] Tests passent : `pnpm test --run`
- [ ] Lint OK : `pnpm lint`
- [ ] Typecheck OK : `pnpm typecheck`
- [ ] Build OK : `pnpm build`
- [ ] Pas de secrets dans le code (`git diff --staged`)
- [ ] `.env.example` à jour
- [ ] Migration Prisma reviewée manuellement si applicable
- [ ] Backup manuel lancé si déploiement majeur

## Flux CI/CD automatique (push sur main)

```
git push main
  → GitHub Actions : lint + typecheck + tests
  → docker build --push → ghcr.io/marrynov/<app>:<sha>
  → Dokploy API : update image + deploy
  → Health check HTTP 200
```

Fichier workflow : `.github/workflows/deploy.yml`
Template complet : `~/MARRYNOV/infra/ci-cd/deploy.yml`

## Déploiement manuel via API Dokploy

```bash
DOKPLOY_URL="https://dokploy.marrynov.re"  # ou http://localhost:3000 en local
DOKPLOY_TOKEN="<token-api>"
APP_ID="<applicationId>"

# Mettre à jour l'image
curl -s -X POST "$DOKPLOY_URL/api/trpc/application.update" \
  -H "x-api-key: $DOKPLOY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"json\":{\"applicationId\":\"$APP_ID\",\"dockerImage\":\"ghcr.io/marrynov/<app>:<tag>\"}}"

# Déclencher le déploiement
curl -s -X POST "$DOKPLOY_URL/api/trpc/application.deploy" \
  -H "x-api-key: $DOKPLOY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"json\":{\"applicationId\":\"$APP_ID\"}}"
```

## Rollback

```bash
# Via API — repasser sur un tag stable
curl -s -X POST "$DOKPLOY_URL/api/trpc/application.update" \
  -H "x-api-key: $DOKPLOY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"json\":{\"applicationId\":\"$APP_ID\",\"dockerImage\":\"ghcr.io/marrynov/<app>:<sha-stable>\"}}"
# puis redéployer

# Via UI — Projet → App → Deployments → clic sur déploiement stable → Redeploy
```

## Variables d'environnement obligatoires (toutes apps Next.js)

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_KEY
RESEND_API_KEY
SENTRY_DSN
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_GTM_ID
```

## Post-déploiement

1. Vérifier Uptime Kuma → statut vert sous 2 min
2. Vérifier Sentry → pas de nouvelles erreurs
3. Test smoke rapide sur l'URL de prod
4. Créer ticket Linear "Déploiement [app] - [date]" si déploiement majeur

## Healthcheck rapide

```bash
~/MARRYNOV/infra/backup/scripts/healthcheck.sh
```

## Runbook complet

`~/MARRYNOV/infra/RUNBOOK.md`
`~/MARRYNOV/infra/MIGRATION_VPS.md`
