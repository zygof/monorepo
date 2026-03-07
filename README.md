# MARRYNOV — Monorepo

Monorepo de développement MARRYNOV. Contient les templates de sites clients et le site vitrine, organisés avec Turborepo et pnpm workspaces.

---

## Prérequis

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)

---

## Installation

```bash
pnpm install
```

Les hooks Git (Husky) sont installés automatiquement via le script `prepare`.

---

## Structure

```
marrynov/
├── apps/
│   ├── template-pizza/           # Template secteur pizzeria / restauration rapide
│   ├── template-coiffure/        # Template secteur coiffure / beauté
│   ├── template-restaurant/      # Template secteur restaurant traditionnel
│   ├── template-location-voiture/ # Template secteur location de véhicules
│   └── site-marrynov/            # Site vitrine MARRYNOV
├── packages/
│   ├── ui/                       # Composants React partagés (Shadcn/ui)
│   ├── config-eslint/            # Configuration ESLint partagée
│   ├── config-typescript/        # tsconfig de base (strict)
│   ├── design-tokens/            # Tokens CSS (variables CSS partagées)
│   └── database/                 # Client Prisma + schéma de base
├── .github/
│   ├── workflows/ci.yml          # CI : lint + typecheck + tests sur chaque PR
│   ├── ISSUE_TEMPLATE/           # Templates GitHub Issues
│   └── PULL_REQUEST_TEMPLATE.md
├── .vscode/                      # Config VSCode partagée (format on save, ESLint)
├── .husky/                       # Hooks Git (pre-commit, commit-msg)
├── turbo.json                    # Pipeline Turborepo
└── package.json                  # Racine du monorepo
```

---

## Commandes

| Commande         | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | Lance tous les apps en mode développement    |
| `pnpm build`     | Build de production de tous les apps         |
| `pnpm lint`      | Lint de tous les packages                    |
| `pnpm lint:fix`  | Lint + correction automatique                |
| `pnpm typecheck` | Vérification TypeScript de tous les packages |
| `pnpm test`      | Tests de tous les packages                   |
| `pnpm format`    | Formate tous les fichiers avec Prettier      |

Pour un app spécifique :

```bash
pnpm --filter @marrynov/template-pizza dev
pnpm --filter @marrynov/template-pizza build
```

---

## Conventions de commits

Ce projet suit la spécification [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description en français>

[corps optionnel]

[footer optionnel — ex: Linear: MAR-42]
```

### Types autorisés

| Type       | Usage                                        |
| ---------- | -------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité                      |
| `fix`      | Correction de bug                            |
| `chore`    | Maintenance, mise à jour de dépendances      |
| `docs`     | Documentation uniquement                     |
| `refactor` | Refactoring sans changement de comportement  |
| `test`     | Ajout ou modification de tests               |
| `style`    | Formatage, espaces (sans impact fonctionnel) |
| `perf`     | Amélioration de performance                  |
| `revert`   | Annulation d'un commit précédent             |
| `ci`       | Modifications de la configuration CI         |
| `build`    | Système de build, scripts                    |

### Exemples

```
feat(ui): ajouter le composant HeroSection
fix(template-pizza): corriger l'affichage du menu sur mobile
chore(deps): mettre à jour Next.js vers 15.1.0
docs(readme): documenter la procédure de déploiement
refactor(database): extraire la logique de connexion Prisma
```

Le scope est **obligatoire**. Utilise le nom du package ou de l'app concernée.

---

## Stratégie de branches

```
main       ← Production stable. Déploiement automatique.
develop    ← Intégration. Toutes les features mergent ici.
feat/xxx   ← Développement d'une fonctionnalité
fix/xxx    ← Correction de bug
chore/xxx  ← Maintenance, mises à jour
release/x.x ← Préparation d'une release (depuis develop)
hotfix/xxx  ← Correction urgente en production (depuis main)
```

### Workflow standard

```bash
# Créer une branche feature depuis develop
git checkout develop
git pull
git checkout -b feat/nom-de-la-feature

# ... développement ...

# Ouvrir une PR vers develop
# La PR doit passer le CI (lint + typecheck + tests) avant merge
```

### Règles

- Toute PR cible `develop` (sauf hotfix → `main`)
- Merge squash recommandé pour garder un historique lisible sur `develop`
- `main` ne reçoit que des merges depuis `develop` (release) ou `hotfix/*`

---

## Qualité de code

### ESLint

Configuration partagée dans `packages/config-eslint/` :

- `@typescript-eslint/recommended` — règles TypeScript strictes
- `import/order` — ordre des imports imposé
- `jsx-a11y/recommended` — accessibilité
- `react-hooks/recommended` — règles des hooks React
- `next/core-web-vitals` — optimisations Next.js

### TypeScript

Configuration stricte dans `packages/config-typescript/` :

- `strict: true` — mode strict complet
- `noImplicitAny: true` — interdit any implicite
- `noUncheckedIndexedAccess: true` — accès aux tableaux sécurisé
- `noImplicitReturns: true` — retours de fonction explicites

### Hooks Git (Husky)

- **pre-commit** : lint-staged (ESLint + Prettier sur les fichiers modifiés)
- **commit-msg** : commitlint (validation du message de commit)

---

## Ticketing (Linear + GitHub)

### Workflow

1. Créer le ticket dans **Linear** (projet correspondant au client ou au template)
2. Référencer l'ID Linear dans le commit footer : `Linear: MAR-42`
3. Référencer l'ID dans la PR description
4. Clore le ticket Linear lors du merge en production

### Statuts Linear

| Statut    | Description                             |
| --------- | --------------------------------------- |
| Backlog   | Identifié, non planifié                 |
| Todo      | Planifié pour le sprint en cours        |
| En cours  | Développement actif                     |
| En review | PR ouverte, en attente de validation CI |
| Done      | Mergé et déployé                        |

### GitHub Issues

Utilisé pour les tickets publics ou les rapports de bugs clients. Templates disponibles :

- `bug_report` — rapport de bug
- `feature_request` — demande de fonctionnalité
- `tma-client` — ticket de maintenance client (lié à Linear + Notion)

---

## Déploiement

Chaque app est déployable indépendamment sur Vercel ou tout hébergeur compatible Next.js.

```bash
# Build d'un app spécifique
pnpm --filter @marrynov/template-pizza build
```

---

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript strict
- **Style** : Tailwind CSS + design tokens CSS variables
- **Composants** : Shadcn/ui
- **ORM** : Prisma + PostgreSQL
- **Validation** : Zod
- **Tests** : Vitest + Testing Library
- **Monorepo** : Turborepo + pnpm workspaces
