# MARRYPIZZA — UX Pilot Session 3: Mobile Flow (iOS/Android)

## Expert Persona

You design food delivery mobile apps. You've studied every pixel of Uber Eats and Deliveroo mobile and know which patterns translate to Reunion Island: large food photos, easy reorder, family-size selection, cash payment option. You optimize for "hungry user, 2 minutes to order."

---

## Design System Reference

**Colors**: primary `#E8401C` · secondary `#F5A623` · background `#FDF6ED` · surface `#ffffff`

**Viewport**: 390px · Touch targets: minimum 48×48px

---

## Screens to Generate (Mobile)

### SCREEN 1: Home

```
HEADER (56px):
  - Logo "MARRYPIZZA 🍕" left
  - Cart icon right (count badge #E8401C)

ADDRESS BAR (48px, full-width):
  - "📍 Livraison à Saint-Denis" — tappable
  - Chevron right
  - Background #fdf1ee, border #E8401C

HERO BANNER (220px):
  - Full-width image: pizza close-up
  - Badge overlay: "🕐 30–45 min · 🛵 Dès 3€"

PROMO STRIP (horizontal scroll):
  - Promo cards: "2+1 offerte" | "Livraison offerte dès 25€"
  - Red/orange gradient backgrounds

CATEGORIES (2×3 grid):
  - Each cell: emoji + label + item count badge
  - Tappable, navigates to menu filtered

BESTSELLERS:
  - "🔥 Les + commandées" + "Voir tout →"
  - Horizontal scroll of product cards (compact)

BOTTOM NAV (56px + safe area):
  - 🏠 Accueil | 🍕 Menu | 🛒 Panier | 📋 Commandes | 👤 Compte
  - Panier tab has count badge when items in cart
```

---

### SCREEN 2: Menu (Category View)

```
STICKY HEADER:
  - Back + "Menu" + cart icon
  - Category scroll: Pizzas | Salades | Desserts | Boissons

SECTION: "🍕 Pizzas Classiques"
- Vertical list of product items:
  Each row (80px height):
  - Left: food photo (72×72 rounded)
  - Center: name (Oswald, bold) + description (2 lines, muted) + size hint
  - Right: price (red, bold) + "+ Ajouter" button (small primary circle or pill)
  - Popular badge left on photo

QUICK ADD:
  - Tap "+" → immediate add to cart (haptic feedback)
  - Long press / second tap → opens size selector bottom sheet:
    - Size: S (22cm) · M (30cm) · L (40cm)
    - Price updates
    - Extras: Fromage supplémentaire | Double sauce | etc.
    - "Ajouter au panier" button

FLOATING CART BOTTOM BAR (when cart has items):
  - Sticky bar above bottom nav
  - "Voir mon panier — 3 articles · 28,50€" — red background, white text, full-width
```

---

### SCREEN 3: Cart

```
HEADER: "Mon panier" + "Vider" (ghost destructive)

ITEMS LIST:
  Each row:
  - Name + size
  - Qty: [–] [1] [+]
  - Price
  - Extras listed below (smaller text, muted)
  - Trash icon (remove)

DELIVERY SELECTION:
  - Toggle chips: "🛵 Livraison" | "🏪 Retrait"
  - If livraison: address display + "Modifier" link
  - Delivery time: "⏱ 30–45 min"

PROMO CODE:
  - Input + "Appliquer" button
  - Applied: green success row "Code PIZZA2 · −5,00€"

SUMMARY:
  - Sous-total: 28,50€
  - Livraison: 3,00€
  - Promo: −5,00€
  - Total: 26,50€ (Oswald, 24px, bold)

STICKY BOTTOM:
  - "Commander · 26,50€" — full-width red button (52px)
  - Safe area
```

---

### SCREEN 4: Order Tracking

```
HEADER: "Suivi commande #1234"

STATUS: large animated icon (pizza → oven → scooter → house)
Current step pulsing animation

ETA chip: "🕐 Arrivée estimée: 14h32" — red bg, white, pill, center

Map (180px height, full-width):
  - Static map with scooter pin animated

Order recap (collapsed card):
  "2× Pizza Margherita M + 1× Coca" — expandable

Driver info:
  - Avatar + "Mohamed · 🛵 À 2 min"
  - Call button (outline, phone icon)

AFTER DELIVERY:
  Full-screen prompt:
  - "Comment était votre pizza ?" + 5 stars
  - Quick emoji reactions: 😍 👍 😐 👎
  - "Recommander la même chose" — primary CTA
```

---

## Mobile CRO Notes

1. **Address bar prominent**: validates delivery before user browses menu
2. **Horizontal photo + add**: mimics Deliveroo proven pattern
3. **Quick add vs size sheet**: 90% orders use default size — don't block with modal
4. **Reorder CTA on post-delivery**: repeat orders are highest-margin
5. **Cash option**: critical for Reunion Island — many clients don't have CB
6. **Floating cart bar**: persistent visibility reduces "I forgot what I added" abandonment
