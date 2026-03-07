# Guide — Variables d'environnement MARRYNOV

## Où sont-elles définies ?

Les variables d'environnement existent à **deux endroits distincts** selon le contexte.

---

### En développement local (ton PC)

**Fichier :** `client-[slug]/.env.local`
**Ce fichier ne doit JAMAIS être commité** (il est dans .gitignore automatiquement).

Procédure :

1. Aller dans le dossier du projet client :
   `D:\dev\MARRYNOV\clients\client-[slug]\`
2. Copier `.env.example` → renommer en `.env.local`
3. Remplir les valeurs réelles

```bash
# Depuis WSL2
cd /mnt/d/dev/MARRYNOV/clients/client-[slug]
cp .env.example .env.local
# Puis éditer .env.local avec VS Code
code .env.local
```

---

### En production (Dokploy)

**Où :** Interface Dokploy → ton projet → Application → onglet **Environment Variables**

Procédure :

1. Ouvrir Dokploy : `https://dokploy.[ton-domaine]/`
2. Cliquer sur le projet client
3. Aller dans l'onglet **Environment Variables**
4. Ajouter chaque variable clé / valeur
5. Cliquer **Save** puis **Redeploy**

> Les variables Dokploy sont injectées dans le container Docker au démarrage.
> Elles écrasent les valeurs du fichier `.env.local` local.

---

## Variables obligatoires par template

### Communes à tous les templates

| Variable               | Exemple                               | Description                         |
| ---------------------- | ------------------------------------- | ----------------------------------- |
| `DATABASE_URL`         | `postgresql://user:pass@host:5432/db` | URL PostgreSQL complète             |
| `NEXTAUTH_SECRET`      | `openssl rand -base64 32`             | Clé secrète auth (générer une fois) |
| `NEXTAUTH_URL`         | `https://[slug].marrynov.re`          | URL de base du site en prod         |
| `NEXT_PUBLIC_BASE_URL` | `https://[slug].marrynov.re`          | URL publique côté client            |
| `RESEND_API_KEY`       | `re_xxxxxxxxxxxx`                     | Clé API Resend (emails)             |
| `SENTRY_DSN`           | `https://xxx@sentry.io/xxx`           | Monitoring erreurs                  |
| `NEXT_PUBLIC_GA_ID`    | `G-XXXXXXXXXX`                        | Google Analytics 4                  |

### Templates avec paiement (pizza, restaurant, boutique, location)

| Variable                 | Exemple                        | Description                |
| ------------------------ | ------------------------------ | -------------------------- |
| `STRIPE_SECRET_KEY`      | `sk_live_...` ou `sk_test_...` | Clé secrète Stripe         |
| `NEXT_PUBLIC_STRIPE_KEY` | `pk_live_...` ou `pk_test_...` | Clé publique Stripe        |
| `STRIPE_WEBHOOK_SECRET`  | `whsec_...`                    | Validation webhooks Stripe |

> **Développement :** utiliser les clés `sk_test_` et `pk_test_` de Stripe
> **Production :** utiliser les clés `sk_live_` et `pk_live_`

---

## Comment générer les valeurs sensibles

```bash
# NEXTAUTH_SECRET — générer une clé aléatoire sécurisée
openssl rand -base64 32

# DATABASE_URL — format PostgreSQL standard
# postgresql://[utilisateur]:[mot-de-passe]@[hôte]:[port]/[nom-base]
postgresql://marrynov_user:MonMotDePasse@localhost:5432/client_marie_coiffure

# Stripe — récupérer sur https://dashboard.stripe.com/apikeys
# Resend — récupérer sur https://resend.com/api-keys
# Sentry DSN — récupérer sur https://sentry.io -> Projet -> Settings -> Client Keys
# GA4 Measurement ID — récupérer sur https://analytics.google.com -> Admin -> Flux de données
```

---

## Checklist variables avant déploiement

Avant de déployer en production, vérifier dans Dokploy UI que ces variables sont définies :

- [ ] `DATABASE_URL` — avec l'URL de la base de prod (pas localhost)
- [ ] `NEXTAUTH_SECRET` — clé générée et sauvegardée quelque part de sûr
- [ ] `NEXTAUTH_URL` — URL finale du client (ex: https://mondomaine.re)
- [ ] `NEXT_PUBLIC_BASE_URL` — idem
- [ ] `RESEND_API_KEY` — configuré avec le domaine de prod dans Resend
- [ ] `STRIPE_SECRET_KEY` — clé LIVE (pas test) en production
- [ ] `NEXT_PUBLIC_STRIPE_KEY` — clé LIVE (pas test) en production
- [ ] `STRIPE_WEBHOOK_SECRET` — webhook pointant vers l'URL de prod dans Stripe Dashboard
- [ ] `SENTRY_DSN` — DSN du projet Sentry client
- [ ] `NEXT_PUBLIC_GA_ID` — ID GA4 du client

---

## Sécurité — Règles absolues

1. **Jamais `.env.local` dans Git** — vérifier que `.gitignore` contient `.env.local` et `.env`
2. **Toujours `.env.example` à jour** — chaque nouvelle variable ajoutée au code doit être documentée dans `.env.example` avec une valeur fictive
3. **Jamais de vraie clé dans `.env.example`** — mettre uniquement des placeholders (`sk_live_VOTRE_CLE`)
4. **Rotation si compromis** — si une clé est exposée (push accidentel), la révoquer immédiatement sur le dashboard de l'outil concerné
