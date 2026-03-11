# MARRYPIZZA — UX Pilot Session 2: Web Flow (Desktop)

## Expert Persona

You are a UX designer who has optimized food ordering funnels for 50+ restaurant clients. You know that on desktop, the split-screen menu+cart layout converts 40% better than single-column. You specialize in appetite-triggering design: large food photography, motion on hover, sensory copy. Reunion Island market insight: families ordering together, mix of single-serve and shared plates.

---

## Design System Reference

**Colors**: primary `#E8401C` · secondary `#F5A623` · background `#FDF6ED` · surface `#ffffff` · text `#1a1008` · muted `#6b7280` · border `#ead9c4`

**Typography**: Oswald (headings) · Inter (body)

**Components**: Button · Card · Badge · Input · Select · Dialog · Tabs

---

## Pages to Generate (Desktop — 1440px)

### PAGE 1: Homepage (`/`)

```
HEADER (sticky, 72px, white):
  - Logo "MARRYPIZZA 🍕" (Oswald, bold, #E8401C)
  - Nav: Menu | À propos | Nous contacter
  - Address indicator: "📍 Livraison à Saint-Denis" (editable on click)
  - CTA: "Commander" (primary)

HERO (80vh):
  - Split layout: left 55% / right 45%
  - Left:
    - Badge: "🚀 Livraison en 30 min"
    - H1: "La vraie pizza, livrée chez vous." (Oswald 72px, #1a1008)
    - Subtitle: "Pizzas artisanales depuis 2018 · La Réunion"
    - Address input: large (56px height) "Entrez votre adresse pour commander →"
      - Button inside: "Commander" (primary)
    - Trust row: "⭐ 4.8/5 · 312 commandes · 🕐 30–45 min · 🛵 Livraison 3€"
  - Right:
    - Large appetite photo (pizza wood-fired)
    - Floating "CHAUD !" badge (red, animated pulse)

BESTSELLERS SECTION:
  - Title: "Nos pizzas les plus commandées" + flame emoji
  - Horizontal scroll: 4 product cards visible
  - "Voir tout le menu →" link

CATEGORIES SECTION:
  - Icon grid 3×2: Pizzas | Salades | Desserts | Boissons | Extras | Combos
  - Each: large icon + label + item count

HOW IT WORKS:
  - 3 steps: "1. Choisissez" → "2. On prépare" → "3. On livre"
  - Icons + short descriptions
  - Timeline visual, red connector line

SOCIAL PROOF:
  - Google rating large display + review cards carousel

LOCATION + HOURS:
  - Map (static) + address + opening hours table
  - "Commandez en ligne ou appelez le XX XX XX XX"

FOOTER
```

---

### PAGE 2: Menu (`/menu`) — Split-screen layout

```
LAYOUT: 2 columns — left 65% scrollable menu / right 35% sticky cart

LEFT PANEL:

STICKY CATEGORY NAV (top of left panel):
  - Tabs/pills: Pizzas | Salades | Desserts | Boissons | Extras
  - Underline animation on scroll (IntersectionObserver)

PIZZAS SECTION:
  - Section title: "🍕 Pizzas" (Oswald 28px) + item count
  - Grid 2 columns of Pizza Product Cards (from Session 1)
  - Sub-sections: "Classiques" / "Spéciales" / "Végétariennes"

SALADES, DESSERTS... (same pattern)

RIGHT PANEL (sticky, full viewport height):
  - Cart header: "Mon panier (3 articles)"
  - Items list
  - Promo code
  - Total + delivery
  - "Passer la commande" CTA
  - If cart empty: illustration + "Votre panier est vide" + "Commencer à commander →"

FLOATING CART BUTTON (mobile fallback):
  - Fixed bottom-right when cart has items
  - Count badge on icon
```

---

### PAGE 3: Checkout (`/commande/recap`)

```
2 columns: 60% form / 40% summary

LEFT:
  Section 1: Livraison ou retrait
  - Toggle: "🛵 Livraison" | "🏪 Retrait en boutique"
  - If livraison: address input + delivery time estimate

  Section 2: Vos coordonnées
  - Prénom, Nom, Téléphone (+262), Email

  Section 3: Paiement
  - Options: 💳 Carte (Stripe) | 💵 Espèces à la livraison
  - If card: Stripe card element (iframe)
  - "Paiement 100% sécurisé · SSL" badge

  Section 4: Commentaires
  - Textarea: "Instructions pour le livreur ou la cuisine"
  - Checkbox: "Je veux des couverts et serviettes"

RIGHT (sticky):
  Order summary card
  - Each item + qty + price
  - Sous-total, livraison, promo, total
  - "Commander · 31,50 €" full-width primary CTA

Note sous le bouton:
  "En commandant, vous acceptez nos CGV"
```

---

### PAGE 4: Order Tracking (`/commande/[id]/suivi`)

```
CENTERED LAYOUT (800px max-width):

Status header with background #E8401C:
  "Commande #1234 — En cours de livraison"
  ETA: "Arrivée estimée: 14h32" (gold, large)

Delivery Status Card (from Session 1) — full width

Items ordered:
  - Compact list: qty × name × price
  - Total recap

Actions:
  - "Besoin d'aide ? Nous appeler" button (outline)
  - Feedback prompt after delivery: "Comment était votre commande ?"
    - Star rating + quick comment
    - "Envoyer l'avis" (primary)
```

---

### PAGE 5: Admin Orders (`/admin/commandes`)

```
SIDEBAR:
  - Logo MARRYPIZZA
  - Nav: Commandes en cours | Historique | Menu | Statistiques | Paramètres

MAIN — ORDERS LIVE BOARD:

Alert banner when new order: "🔔 Nouvelle commande — #1235 · Livraison · 32€" (auto-dismiss 8s)

Kanban 3 columns:
  - "Nouvelles" (red header)
  - "En préparation" (orange/secondary header)
  - "En route" (blue header)

Each card:
  - Order #, time, type badge (Livraison/Retrait)
  - Items summary (2 lines)
  - Total — Customer name
  - Timer: "🕐 Reçu il y a 3 min"
  - Action: "Accepter" (green) | "Rejeter" (red ghost)
  - When accepted: "Marquer prêt" → moves to En route column

Stats row (top):
  - Commandes aujourd'hui | CA du jour | Temps moyen livraison | En attente
```

---

## CRO Notes (Desktop)

1. **Address input in hero**: captures intent + validates delivery zone = #1 CRO lever
2. **Split-screen menu+cart**: removing navigation to cart page = fewer abandonments
3. **Category sticky nav**: scroll + auto-highlight = more menu exploration = higher average basket
4. **Social proof near address input**: hesitation removed before commitment
5. **Delivery time estimate** in hero builds expectation and reduces cart abandonment
6. **Promo code field** in cart (not checkout) — catch it before they leave
