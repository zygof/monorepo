# MARRYSHOP — UX Pilot Session 1: Design System & Components

## Expert Persona

You are a UX designer specializing in artisan e-commerce and local craft brands. You've designed Etsy-killer storefronts for French artisans and know that for handmade goods, emotion and story sell more than features. Reunion Island artisans have incredible products — vanilla, rum, piments, textiles — and need a digital presence that communicates authenticity, local pride, and quality. Your designs feel like a warm local market, not Amazon.

---

## Design System

### Brand

- **Name**: MARRYSHOP
- **Product**: Artisan e-commerce — local products from Reunion Island
- **Tagline**: "Fait à La Réunion, avec amour."
- **Market**: Reunion Island locals + mainland France (cadeau) + tourists

### Color Palette

```
primary:          #A0522D  (deep terracotta — earth, craft, warmth)
primary-light:    #f8f0e8  (warm sand — hover backgrounds)
primary-dark:     #7a3d20  (rich mahogany — CTA hover)
secondary:        #5F7A61  (forest sage — nature, freshness, La Réunion)
secondary-light:  #eef3ee  (mint green — subtle backgrounds)
secondary-dark:   #3d5440  (deep forest — text on light)
background:       #FAF7F2  (warm linen — main background)
surface:          #ffffff  (cards, modals)
text:             #2a1a0e  (warm near-black)
text-muted:       #6b7280
border:           #e0d5c8  (warm linen border)
success:          #16a34a
```

### Typography

```
font-heading:  Lora, Georgia, serif     (warm, artisan, literary)
font-body:     Inter, system-ui, sans-serif
```

### Border Radius

```
sm: 6px   | md: 12px   | lg: 16px   | full: 9999px
```

---

## Components to Generate (Session 1)

### 1. MARRYSHOP Button System

```
Primary: bg #A0522D, white — "Ajouter au panier" — warm, handmade feel
Secondary: bg #5F7A61, white — "Voir la collection"
Outline: border #A0522D, text #A0522D
Ghost: text #A0522D
Wishlist: heart icon only, ghost variant
```

### 2. Product Card

The core catalog item:

```
Structure:
- Photo (full-width, 240px, object-cover)
- Top badges overlay:
  - "ARTISANAL" — terracotta bg, white text
  - "FAIT À LA RÉUNION 🌺" — sage green bg
  - "STOCK LIMITÉ" — warning orange
- Body (padding 16px):
  - Artisan name: "Par Marie-Josée · Sainte-Marie" (small, muted, italic)
  - Product name: Lora 18px bold #2a1a0e
  - Short description: 2 lines Inter 13px #6b7280
  - Tag chips: "Vanille" | "Bio" | "Zéro déchet" (small outlined, sage green)
  - Rating: ⭐ 4.9 (12 avis)
  - Price row:
    - Original (if promo): ~~18,00€~~ crossed out, muted
    - Current: "15,50 €" — terracotta, Lora bold 20px
    - Weight/quantity: "/ 100g" or "/ unité" (small, muted)
  - Action row:
    - Heart (wishlist) — ghost left
    - "Ajouter au panier" — primary full-width (or small variant)

Card: white, border #e0d5c8, radius 16px, shadow-sm
Hover: shadow-md, slight border #A0522D tint
```

### 3. Cart Drawer

```
Slides from right (max-width 420px):

Header: "Mon panier (3 articles)" + X close

Items list:
  Each item (horizontal):
  - Photo 64×64 rounded
  - Name + variant (e.g., "Rhum Arrange · Vanille-Coco · 500ml")
  - Qty stepper: [–][1][+] (small, terracotta)
  - Price
  - Remove link (small red)

Empty state:
  - Basket illustration
  - "Votre panier est vide"
  - "Découvrir nos produits" CTA

Promo code collapsible:
  - Input + "Appliquer"

Summary:
  - Sous-total: 46,50€
  - Livraison: "Calculée à l'étape suivante" or "GRATUITE dès 50€"
  - "Passer à la caisse" — full-width primary (52px)
  - "Continuer mes achats" — ghost below

Free shipping progress bar:
  - "Plus que 3,50€ pour la livraison offerte !"
  - Progress: terracotta fill #A0522D on beige track
```

### 4. Artisan Profile Card

Connecting product to its maker:

```
Structure:
- Large photo (round, 80px) or workshop photo (full-width header 100px)
- Name: Lora 20px "Marie-Josée K."
- Location badge: "🌺 Sainte-Marie · La Réunion" — sage green
- Specialty: "Confiture & Conserves maison depuis 2012"
- 3 product photos (thumbnails strip)
- "Voir tous ses produits" — outline terracotta button
- Quick stats: "47 produits · ⭐ 4.9 · 🛒 320 ventes"

Card: white, border #e0d5c8, radius 16px
Warm artisan feel — not corporate
```

### 5. Product Image Gallery

```
Main photo (full-width, 400px height, zoom on hover)
Thumbnail strip (5 small images, 64×64)
Zoom overlay on desktop (loupe cursor)
Swipe gallery on mobile
Labels overlay: "Cliquez pour agrandir"
```

### 6. Review Component

```
Rating header:
  - "4.9/5" large #2a1a0e Lora
  - 5 stars #A0522D filled
  - "(47 avis vérifiés)" muted
  - Rating distribution bars (5★: 90%, 4★: 8%...)

Individual review card:
  - Avatar initials (#f8f0e8 bg, terracotta text)
  - Name + date + location (e.g., "Métropole · Vérifié")
  - Stars
  - "Produit: Confiture Mangue-Vanille" — small badge
  - Quote text
  - Helpful: "✓ 3 personnes ont trouvé cet avis utile"
```

### 7. Shipping / Delivery Info Widget

```
Small card on product page:
- 🚚 Livraison La Réunion: 3,90€ · 2–4 jours
- ✈️ Livraison Métropole: 7,90€ · 5–8 jours
- 🎁 Livraison offerte dès 50€ (Réunion) / 80€ (Métropole)
- 🔄 Retours faciles 14 jours
- "📦 En stock · Expédié sous 24h"
```

### 8. Gift Pack Builder

```
Interactive component:
- "Créer votre coffret cadeau" header
- Step 1: Choose box size (S·M·L illustrated)
- Step 2: Add products (drag or "+") up to limit
- Step 3: Message card (textarea)
- Step 4: Gift wrap toggle (+2€)
- Preview: rendered coffret with selected items shown
- Price total updates live
CTA: "Ajouter le coffret au panier"
Great for Christmas, Mother's Day, tourist gifts
```
