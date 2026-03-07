# Feuille de Route Déploiement — MARRYNOV

> Objectif : sortir en 1ère position sur "développeur web réunion", "création site web 974" et mots-clés associés.
> Dernière mise à jour : février 2026

---

## 🔴 BLOQUANTS — À corriger AVANT de mettre en ligne

Ces points empêchent le site de fonctionner correctement en production.

---

### 1. Service d'envoi d'email (formulaire de contact)

**Problème** : Le formulaire envoie bien les données à `/api/contact`, mais l'API ne fait que sauvegarder dans un fichier local (`data/contacts.json`). Sur Vercel, le système de fichiers est éphémère → **les leads seront perdus à chaque déploiement**.

**Solution recommandée** : Intégrer [Resend](https://resend.com) (gratuit jusqu'à 3 000 emails/mois).

Étapes :

1. Créer un compte sur resend.com
2. Ajouter ton domaine `marrynov.re` et vérifier les DNS
3. Récupérer ta clé API Resend
4. Ajouter `RESEND_API_KEY=re_xxxxx` dans les variables d'environnement Vercel
5. Modifier `src/app/api/contact/route.ts` pour appeler l'API Resend
6. Tester l'envoi sur l'environnement de preview Vercel avant mise en ligne

---

### 2. Images des projets — toutes manquantes

**Problème** : Le dossier `public/images/projects/` n'existe pas. La section Réalisations référence ces fichiers qui sont absents :

| Fichier attendu                 | Projet       |
| ------------------------------- | ------------ |
| `/images/projects/linestie.jpg` | Linestie     |
| `/images/projects/isis.jpg`     | ISIS Diabète |
| `/images/projects/outta.jpg`    | OUTTA        |
| `/images/projects/influx.jpg`   | Influx       |
| `/images/projects/myseance.jpg` | MySeance     |
| `/images/projects/statmag.jpg`  | StatMag      |

**Solution** :

- Format recommandé : JPEG ou WebP, ratio **16/9**, min 800px de large
- Utilise des captures d'écran des apps ou des maquettes visuelles (Figma, etc.)
- Nomme les fichiers exactement comme indiqué ci-dessus
- Place-les dans `public/images/projects/`

---

### 3. SIRET — valeur placeholder

**Problème** : Le footer affiche `SIRET : 123 456 789 00012` (faux numéro).

**Fichier** : `src/messages/fr.json` → clé `footer.siret`

**Solution** : Remplace par ton vrai numéro SIRET une fois ton auto-entreprise enregistrée.

---

### 4. Liens réseaux sociaux — placeholders

**Problème** : Le footer pointe vers `https://linkedin.com` et `https://github.com` au lieu de tes vrais profils.

**Fichier** : `src/components/layout/Footer.tsx` lignes 85 et 92

**Solution** :

```tsx
href = "https://linkedin.com/in/TON-PROFIL"; // ligne 85
href = "https://github.com/TON-PSEUDO"; // ligne 92
```

Ajoute aussi ces URLs dans le JSON-LD `sameAs` de la page d'accueil (`src/app/[locale]/page.tsx`) pour renforcer ton autorité SEO.

---

## 🟠 IMPORTANT — À faire dans les 48h après mise en ligne

---

### 5. Google Search Console

Google ne peut pas indexer ton site tant qu'il n'est pas déclaré.

1. Aller sur [search.google.com/search-console](https://search.google.com/search-console)
2. Ajouter la propriété `https://www.marrynov.re`
3. Vérifier via le fichier HTML ou le DNS (Vercel permet les DNS records)
4. Soumettre le sitemap : `https://www.marrynov.re/sitemap.xml`
5. Utiliser "Demander l'indexation" sur les 4 pages principales :
   - `https://www.marrynov.re`
   - `https://www.marrynov.re/a-propos`
   - `https://www.marrynov.re/contact`
   - `https://www.marrynov.re/projets`

Sans ça, Google peut mettre **4 à 8 semaines** à trouver le site tout seul.

---

### 6. Google My Business — levier SEO local n°1

C'est **le facteur le plus puissant** pour ressortir sur "développeur web réunion" dans les résultats locaux (Google Maps + bloc Local Pack au-dessus des résultats organiques).

1. Aller sur [business.google.com](https://business.google.com)
2. Créer la fiche avec :
   - **Nom** : MARRYNOV
   - **Catégorie principale** : Développeur Web
   - **Catégories secondaires** : Consultant informatique, Développeur de logiciels
   - **Adresse** : Saint-Denis, La Réunion 97400
   - **Site web** : <https://www.marrynov.re>
   - **Téléphone** : +262 692 40 00 66
   - **Horaires** : Lun-Ven 09h-18h
3. Rédiger la description avec les mots-clés : _"Développeur web et mobile freelance à La Réunion. Création de sites web vitrine, e-commerce, applications mobiles iOS et Android. Éligible Kap Numérik."_
4. Ajouter des **photos** (logo, toi en situation de travail, captures projets)
5. Dès tes premiers clients → demande-leur un **avis Google** (c'est le carburant du référencement local)

---

### 7. Image Open Graph (partage réseaux sociaux)

**Problème** : Quand quelqu'un partage ton URL sur LinkedIn, WhatsApp ou Twitter, aucune image n'apparaît → mauvaise impression professionnelle.

**Solution** :

1. Crée une image `1200 × 630 px` (type carte de visite) avec :
   - Ton logo MARRYNOV
   - Tagline : "Développeur Web & Mobile La Réunion"
   - Fond aux couleurs de la charte (violet #6b40a0)
2. Enregistre-la sous `public/og-image.jpg`
3. Ajoute dans chaque page `metadata` :

```tsx
openGraph: {
  ...
  images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MARRYNOV – Développeur Web La Réunion" }],
},
```

---

## 🟡 RECOMMANDÉ — Dans les 2 premières semaines

---

### 8. Photo professionnelle — page À propos + section "Pourquoi me faire confiance"

**Problème** :

- La section "Pourquoi me faire confiance" (`WhyMe`) affiche un **placeholder dégradé** au lieu d'une photo
- La page À propos a également besoin d'une photo de toi

**Solution** :

- Fais une séance photo simple (fond neutre, tenue professionnelle ou décontractée-pro)
- Format recommandé : portrait 4/5 (800×1000px minimum), JPG optimisé
- Intègre la photo dans `WhyMe.tsx` en remplaçant le placeholder `div` par un `<Image>`

---

### 9. Inscription annuaires locaux (backlinks)

Les backlinks (liens entrants) depuis des sites reconnus augmentent ton autorité de domaine. Priorité aux annuaires réunionnais :

| Annuaire                                 | Lien                        | Impact SEO |
| ---------------------------------------- | --------------------------- | ---------- |
| **Kap Numérik prestataires**             | Contacter la Région Réunion | ⭐⭐⭐⭐⭐ |
| **CCI Réunion** (annuaire membres)       | cci.re                      | ⭐⭐⭐⭐   |
| **Pages Jaunes**                         | pagesjaunes.fr              | ⭐⭐⭐     |
| **Kompass**                              | kompass.com                 | ⭐⭐⭐     |
| **LinkedIn** (profil complet + URL site) | linkedin.com                | ⭐⭐⭐⭐   |
| **GitHub** (profil + URL site)           | github.com                  | ⭐⭐       |

> L'inscription comme **prestataire Kap Numérik officiel** est la plus stratégique : c'est un lien depuis le site de la Région Réunion (domaine `.re` très fort) + les entreprises cherchent directement des prestataires sur cette liste.

---

### 10. Bing Webmaster Tools

40% des recherches en France passent par Bing, Edge ou DuckDuckGo.

1. Aller sur [bing.com/webmasters](https://www.bing.com/webmasters)
2. Importer depuis Google Search Console (1 clic si déjà configuré)
3. Soumettre le sitemap

---

## 🟢 LONG TERME — Articles de blog (3 à 6 mois après lancement)

Le blog est le levier SEO le plus puissant sur la durée. Ces sujets ont peu de concurrence locale mais beaucoup de trafic potentiel :

### Articles à écrire en priorité

**Article 1 (à écrire en premier)**

> **"Aide Kap Numérik 2026 : comment financer votre site web à La Réunion jusqu'à 3 200 €"**

- Mot-clé cible : `kap numérik développeur`, `aide site web réunion`
- Concurrence locale : quasi nulle → potentiel d'être **1er dès la publication**
- Longueur idéale : 800-1200 mots

**Article 2**

> **"Combien coûte un site web à La Réunion en 2026 ? (tarifs réels)"**

- Mot-clé cible : `prix site web réunion`, `tarif création site internet 974`
- Intention : forte (les gens qui cherchent ça veulent passer commande)

**Article 3**

> **"Facturation électronique 2026 : guide complet pour les PME réunionnaises"**

- Mot-clé cible : `facturation électronique réunion 2026`
- Actualité brûlante, obligation légale → fort trafic naturel

**Article 4**

> **"Pourquoi votre entreprise réunionnaise a besoin d'un site web en 2026 ?"**

- Mot-clé cible : `site web entreprise réunion`
- Article evergreen (toujours d'actualité)

---

## ✅ Ce qui est déjà fait

| Élément                                      | Statut                          |
| -------------------------------------------- | ------------------------------- |
| Score SEO Lighthouse                         | ✅ 100/100                      |
| Sitemap XML (`/sitemap.xml`)                 | ✅                              |
| Robots.txt                                   | ✅                              |
| Balises méta (title, description, canonical) | ✅ Toutes les pages             |
| Balise `keywords`                            | ✅ Pages principales            |
| JSON-LD LocalBusiness + ProfessionalService  | ✅ Page d'accueil               |
| JSON-LD Person (Nicolas MARRY)               | ✅ Page À propos                |
| Open Graph metadata                          | ✅ (sans image)                 |
| Font WOFF2 (Inter via next/font/google)      | ✅                              |
| Images WebP/AVIF                             | ✅                              |
| Lazy loading images below-fold               | ✅                              |
| Navbar en Server Component                   | ✅                              |
| FAQ sans JavaScript (CSS natif)              | ✅                              |
| HTTPS                                        | ✅ (Vercel automatique)         |
| Politique de confidentialité RGPD            | ✅                              |
| Mentions légales                             | ✅                              |
| Route API `/api/contact` ges principales     |
| JSON-LD LocalBusiness + ProfessionalService  | ✅ Page d'accueil               |
| JSON-LD Person (Nicolas MARRY)               | ✅ Page À propos                |
| Open Graph metadata                          | ✅ (sans image)                 |
| Font WOFF2 (Inter via next/font/google)      | ✅                              |
| Images WebP/AVIF                             | ✅                              |
| Lazy loading images below-fold               | ✅                              |
| Navbar en Server Component                   | ✅                              |
| FAQ sans JavaScript (CSS natif)              | ✅                              |
| HTTPS                                        | ✅ (Vercel automatique)         |
| Politique de confidentialité RGPD            | ✅                              |
| Mentions légales                             | ✅                              |
| Route API `/api/contact`                     | ⚠️ Partielle (pas d'email réel) |

---

## Récapitulatif par priorité

```
🔴 AVANT mise en ligne (bloquant)
  1. Configurer Resend pour l'envoi d'emails (contact form)
  2. Ajouter les images des projets (public/images/projects/)
  3. Remplacer le SIRET placeholder
  4. Mettre tes vraies URLs LinkedIn + GitHub dans le footer + JSON-LD

🟠 Dans les 48h après déploiement
  5. Google Search Console → soumettre le sitemap
  6. Google My Business → créer la fiche complète + photos
  7. Créer et ajouter l'image Open Graph (og-image.jpg)

🟡 Dans les 2 semaines
  8. Photo professionnelle → WhyMe + About
  9. S'inscrire sur les annuaires locaux (Kap Numérik en priorité)
  10. Bing Webmaster Tools

🟢 Long terme (3-6 mois)
  11. Blog : article Kap Numérik (priorité absolue)
  12. Blog : article "Combien coûte un site web à La Réunion"
  13. Blog : article Facturation électronique 2026
  14. Collecter des avis Google clients
```
