# MARRYPIZZA — UX Pilot Session 1: Design System & Components

## Expert Persona

You are a senior UX designer specializing in food delivery and restaurant ordering platforms. You've worked on Uber Eats, Deliveroo, and local food apps for French overseas territories. You know exactly what makes appetizing UIs that convert: food-forward photography, clear pricing, minimal friction from hunger to order. You understand the Reunion Island market: families, mix of local and Italian cuisine, WhatsApp-culture for orders.

---

## Design System

### Brand

- **Name**: MARRYPIZZA
- **Product**: Pizzeria online ordering platform
- **Tagline**: "La vraie pizza, livrée chez vous."
- **Market**: Reunion Island, French-speaking, mobile-first, family orders

### Color Palette

```
primary:          #E8401C  (deep red-orange — appetite, energy, action)
primary-light:    #fdf1ee  (blush red — hover backgrounds)
primary-dark:     #b52e10  (burnt red — hover on CTAs)
secondary:        #F5A623  (golden yellow — cheese, warmth, highlights)
secondary-light:  #fef6e4  (cream — subtle backgrounds)
secondary-dark:   #c7841a  (amber — secondary hover)
background:       #FDF6ED  (warm cream — main background)
surface:          #ffffff  (cards, modals)
text:             #1a1008  (warm near-black)
text-muted:       #6b7280
border:           #ead9c4  (warm beige)
success:          #16a34a
error:            #dc2626
```

### Typography

```
font-heading:  Oswald, Impact, sans-serif   (bold, food menu feel)
font-body:     Inter, system-ui, sans-serif
```

### Border Radius

```
sm: 6px   | md: 10px   | lg: 16px   | full: 9999px
```

---

## Components to Generate (Session 1)

### 1. MARRYPIZZA Button System

```
Primary: bg #E8401C, white text, "Commander maintenant" — bold, pill shape
Secondary: bg #F5A623, white text
Outline: border #E8401C, text #E8401C
Ghost: text #E8401C, no border
Add-to-cart: "+ Ajouter" — small, primary, fixed 36px height

Show hover states: primary darkens to #b52e10
Show all 3 sizes
```

### 2. Pizza Product Card

The core menu item card:

```
Structure:
- Photo (full-width, 180px height, object-cover, radius top 16px)
- Labels overlay (top-left on photo):
  - "NOUVEAU" badge — red (#E8401C) pill
  - "POPULAIRE" badge — gold (#F5A623) pill
- Card body (white, padding 16px):
  - Pizza name: Oswald, 20px, #1a1008, uppercase
  - Description: Inter 13px, #6b7280, 2 lines, italic
  - Ingredients chips: horizontal scroll, small outlined pills (#ead9c4 border)
  - Size selector row: S | M | L — pill toggle buttons
    - Active: bg #E8401C, white
    - Inactive: border #ead9c4
  - Bottom row: Price (Oswald, 22px, #E8401C) + "Ajouter" button (primary small)

Card: white, border #ead9c4, radius 16px, shadow-sm
Hover: shadow-md, slight scale 1.02
```

### 3. Order Cart Summary (Sidebar/Drawer)

```
Header:
  - "Mon panier" + item count badge (#E8401C)
  - Clear all link

Items list:
  - Each item row: name + size + qty controls (- 1 +) + price
  - Qty buttons: #E8401C, 28px circle
  - Remove: small red X

Subtotal section:
  - Sous-total: "28,50 €"
  - Livraison: "3,00 €" or "GRATUITE" (success green)
  - Promo code input + "Appliquer" button (outline)
  - Total: Oswald, 24px, #1a1008

CTA: "Commander · 31,50 €" — full-width primary button, bold
Delivery time: "🕐 Livraison estimée: 30–45 min"

Card: white surface, shadow-xl (drawer-like)
```

### 4. Category Filter Bar (Menu)

```
Horizontal scroll of category chips:
- "🍕 Pizzas" | "🥗 Salades" | "🍰 Desserts" | "🥤 Boissons" | "🧁 Extras"
- Each: 44px height, icon + label, pill shape
- Active: bg #E8401C, white text, shadow-sm
- Inactive: bg white, border #ead9c4, text #1a1008
- Scroll on mobile, full visible on desktop
```

### 5. Delivery Status Card

Real-time order tracking:

```
Background: gradient #E8401C → #b52e10
Text: white

Timeline (horizontal steps):
1. ✓ Commande reçue
2. ✓ En préparation
3. 🔄 En route (current — animated pulse)
4. ○ Livré

Driver info:
- "Votre livreur: Mohamed · 🛵 → À 5 min"
- Progress bar: 75% (animated)
- ETA: "Arrivée estimée: 14h32" — gold, bold

Map placeholder: static map image with pin
```

### 6. Promo Banner

```
Background: #E8401C with diagonal pattern
Gold stripe (3px) on left
"🍕 OFFRE DU JOUR" badge — gold
Title: "2 pizzas achetées = 1 boisson offerte" — white, Oswald 24px
Validity: "Aujourd'hui seulement · Code: PIZZA2"
CTA: "En profiter" — white outline button
```

### 7. Review Card (Restaurant)

```
Stars: #F5A623 filled
Name + date
"Pizza Margherita · Livraison" — muted badge
Quote: 2 lines
"Commande vérifiée" — small green checkmark text
```

### 8. Address / Delivery Zone Selector

```
Input with location pin icon: "Entrez votre adresse"
Dropdown results: 4 address suggestions
Selected address: bg #fdf1ee, border #E8401C, checkmark
Zone indicator: "✓ Zone de livraison couverte" (success)
Or: "⚠ Hors zone — retrait en boutique uniquement" (warning)
```
