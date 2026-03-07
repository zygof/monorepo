---
name: nouveau-client-template
description: Utilise cette skill quand il faut créer un nouveau projet client MARRYNOV à partir d'un template existant (pizza, coiffure, restaurant, location-voiture, boutique). Activée automatiquement quand la tâche mentionne "nouveau client", "créer client", "initialiser client", "onboarding client".
---

# Skill — Création d'un nouveau projet client MARRYNOV

## Processus obligatoire (dans cet ordre)

### 1. Identifier le template source

Demander ou déduire quel template utiliser parmi :

- template-pizza → client commande en ligne
- template-coiffure → client salon de coiffure/beauté
- template-restaurant → client restaurant avec réservation
- template-location-voiture → client location de véhicules
- template-boutique → client e-commerce / artisan

### 2. Valider les informations client

S'assurer d'avoir :

- slug : [prenom]-[secteur] (ex: jean-pizza)
- Nom de l'entreprise
- Secteur d'activité
- Couleur principale (ou utiliser la couleur du template)
- Domaine final prévu (ou utiliser [slug].marrynov.re pour la démo)

### 3. Exécuter le script d'initialisation

```bash
cd /mnt/d/dev/MARRYNOV/monorepo
npx ts-node tools/create-client/index.ts --slug [slug] --template [template] --name "[Nom Client]"
```

### 4. Vérifications post-création

- [ ] Repo GitHub créé : github.com/marrynov/client-[slug]
- [ ] .env.example complet et à jour
- [ ] config/client.config.ts personnalisé
- [ ] Ticket Linear créé dans le projet client
- [ ] Entrée Notion CRM créée (pipeline "Onboarding")
- [ ] Sous-domaine démo configuré sur Dokploy

### 5. Premier commit

```bash
git commit -m "feat(init): initialisation projet [Nom Client]"
```

## Structure config/client.config.ts

Seul ce fichier est modifié pour chaque client :

```typescript
export const clientConfig = {
  name: 'Nom Client',
  slug: 'jean-pizza',
  primaryColor: '#E63946',
  secondaryColor: '#1D3557',
  fontHeading: 'Playfair Display',
  logo: '/logo.png',
  address: '12 rue des Flamboyants, Saint-Denis 97400',
  phone: '0262 XX XX XX',
  email: 'contact@client.re',
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_KEY,
  },
  // ... autres configs spécifiques au template
};
```
