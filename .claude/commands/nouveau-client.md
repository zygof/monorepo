---
description: Initialise un nouveau projet client MARRYNOV complet — crée le projet Linear, le ticket d'onboarding, le dossier code et le récapitulatif visuel.
---

Tu es l'agent d'onboarding de MARRYNOV. Suis ces étapes dans l'ordre exact.

## ÉTAPE 1 — Collecte des informations

Demande ces informations si elles ne sont pas toutes fournies dans le message initial.
Pose TOUTES les questions en une seule fois, pas une par une.

Questions à poser :

- Nom complet du client ou de l'entreprise (ex: "Marie Dupont" ou "Salon Créolia")
- Sous-titre / accroche (ex: "Salon afro-créole à Saint-Denis" — 1 ligne max)
- Secteur : pizza | coiffure | restaurant | location-voiture | boutique
- Couleur principale souhaitée (ex: "#E63946" ou "rouge") — optionnel, tu peux suggérer
- Ville à La Réunion (ex: Saint-Denis, Saint-Pierre, Le Port…)

## ÉTAPE 2 — Génération du slug

Génère le slug automatiquement depuis le nom :

- Format : [premier-mot-du-nom]-[secteur]
- Minuscules, sans accents, sans espaces (tirets à la place)
- Exemples : marie-coiffure / salon-creolia-coiffure / dupont-pizza
- Affiche le slug proposé et valide avec l'utilisateur avant de continuer.

## ÉTAPE 3 — Création du projet Linear

Utilise le MCP Linear pour créer UN NOUVEAU PROJET (pas juste un ticket) :

- Nom du projet : "[Nom Client]"
- Description du projet : "[Sous-titre] • Secteur : [secteur] • Template : template-[secteur] • URL démo : https://[slug].marrynov.re"
- Si le MCP Linear ne permet pas de créer un projet, crée directement le ticket dans le workspace général avec le label "client" et documente la limitation.

## ÉTAPE 4 — Création du ticket d'onboarding dans Linear

Dans le projet nouvellement créé (ou dans le workspace si projet non créé), crée un ticket avec :

**Titre :** `Onboarding — [Nom Client]`

**Description (en markdown propre, sans \n littéraux) :**

```
## Client
**Nom :** [Nom Client]
**Sous-titre :** [Sous-titre]
**Secteur :** [secteur]
**Ville :** [Ville]

## Technique
**Slug :** `[slug]`
**Template :** `template-[secteur]`
**Dossier code :** `/mnt/d/dev/MARRYNOV/clients/client-[slug]/`
**URL démo :** https://[slug].marrynov.re
**Repo GitHub :** github.com/marrynov/client-[slug] *(à créer)*

## Checklist onboarding
- [ ] Personnaliser `config/client.config.ts`
- [ ] Ajouter les assets (logo, photos)
- [ ] Créer le repo GitHub et pousser
- [ ] Configurer les variables d'environnement (voir `.env.example`)
- [ ] Déployer la démo sur Dokploy
- [ ] Vérifier l'URL démo accessible
```

**Labels :** client, onboarding
**Priorité :** normale

## ÉTAPE 5 — Création du dossier code

Le dossier client doit être créé dans :
**`~/MARRYNOV/clients/client-[slug]/`** (= `/home/zygof/MARRYNOV/clients/client-[slug]/`)

Exécute :

```bash
# Créer le dossier si clients/ n'existe pas encore
mkdir -p ~/MARRYNOV/clients/client-[slug]

# Copier le template
cp -r ~/MARRYNOV/monorepo/apps/template-[secteur]/. ~/MARRYNOV/clients/client-[slug]/

# Mettre à jour le package.json
cd ~/MARRYNOV/clients/client-[slug]
```

Puis met à jour `config/client.config.ts` avec les infos collectées.

## ÉTAPE 6 — Création du dossier documents Windows

Crée le dossier documents du client :

```bash
mkdir -p "/mnt/d/zygof/Documents/MARRYNOV/01_CLIENTS/[NOM-SECTEUR en majuscules]"
mkdir -p "/mnt/d/zygof/Documents/MARRYNOV/01_CLIENTS/[NOM-SECTEUR]/contrats"
mkdir -p "/mnt/d/zygof/Documents/MARRYNOV/01_CLIENTS/[NOM-SECTEUR]/factures"
mkdir -p "/mnt/d/zygof/Documents/MARRYNOV/01_CLIENTS/[NOM-SECTEUR]/livraison"
```

## ÉTAPE 7 — Récapitulatif final

Affiche ce récapitulatif structuré (avec des vrais retours à la ligne, jamais de \n littéraux) :

```
╔══════════════════════════════════════════════╗
║         ONBOARDING — [NOM CLIENT]            ║
║         [SOUS-TITRE]                         ║
╚══════════════════════════════════════════════╝

PROJET
  Nom       : [Nom Client]
  Slug      : [slug]
  Secteur   : [secteur]
  Ville     : [Ville]

TECHNIQUE
  Template  : template-[secteur]
  Code      : ~/MARRYNOV/clients/client-[slug]/
  Docs      : D:\zygof\Documents\MARRYNOV\01_CLIENTS\[NOM-SECTEUR]\
  URL démo  : https://[slug].marrynov.re
  GitHub    : github.com/marrynov/client-[slug]  (à créer)

LINEAR
  Projet    : [Nom Client]
  Ticket    : [ID-TICKET] — Onboarding [Nom Client]

VARIABLES D'ENVIRONNEMENT
  Fichier   : client-[slug]/.env.example  <- copier en .env.local
  Où ?      : Dokploy UI -> Application -> Environment Variables
  Voir      : MARRYNOV_ENV_GUIDE.md pour le détail

PROCHAINES ÉTAPES
  1. Personnaliser config/client.config.ts (nom, couleurs, contact, réseaux)
  2. Ajouter les assets dans public/ (logo.png, og-image.jpg, favicon)
  3. git init + créer le repo github.com/marrynov/client-[slug]
  4. Configurer les variables dans Dokploy UI
  5. /deploy pour mettre en ligne la démo
```
