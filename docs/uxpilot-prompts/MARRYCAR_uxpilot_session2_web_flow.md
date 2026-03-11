# MARRYCAR — UX Pilot Session 2: Web Flow (Desktop + Mobile)

## Expert Persona

You designed the booking funnels for major European car rental agencies and know the exact 3-step flow that converts: Search → Select → Pay. Every field that's not essential to conversion is removed. Price transparency is non-negotiable — hidden fees are the #1 cause of cart abandonment in car rental.

---

## Design System Reference

**Colors**: primary `#1B4FD8` · secondary `#F97316` · background `#F8FAFF` · surface `#ffffff` · text `#0a1628` · muted `#6b7280` · border `#d1daf0`

**Typography**: Inter (all) — sharp, professional

---

## Pages to Generate

### PAGE 1: Homepage (`/`)

```
HEADER (sticky, 64px, white, shadow-sm):
  - Logo "MARRYCAR 🚗" (Inter bold, #1B4FD8)
  - Nav: Véhicules | Tarifs | Pratique | Avis | Contact
  - Phone: "+262 XX XX XX XX"
  - CTA: "Réserver" (primary)

HERO (70vh):
  - Background: aerial photo of Reunion Island road + mountains
  - Dark overlay gradient
  - Text center:
    - H1: "L'île à votre rythme." (Inter 64px bold, white)
    - Subtitle: "Location de voitures sans souci à La Réunion"
  - SEARCH FORM overlaid (white card, shadow-xl, centered):
    - Vehicle Search Form (from Session 1)
    - Prominent, large, above the fold

TRUST BAR (3 columns, bg white):
  - "✈️ Livraison aéroport" | "🔒 Sans frais cachés" | "⭐ +300 avis clients"

VEHICLE CATEGORIES:
  - Title: "Nos véhicules"
  - Icon grid: Économique | Berline | SUV | Monospace | Utilitaire | Luxe
  - Each category: illustration + name + "À partir de X€/j" + "Voir" button

POPULAR VEHICLES:
  - Grid 3 columns of Vehicle Cards
  - "Voir tout notre parc →"

HOW IT WORKS (3 steps):
  - 1️⃣ Recherchez → 2️⃣ Réservez → 3️⃣ Prenez la route
  - Timeline blue with icons

TESTIMONIALS:
  - 3 review cards with photo of Reunion Island locations

FOOTER:
  - Contact · Adresse agence · Hours
  - CGV · Politique annulation
```

---

### PAGE 2: Search Results (`/recherche`)

```
STICKY SEARCH BAR (top, compact):
  - Collapsed version of search form
  - Current search: "Aéroport → Saint-Denis · 5 jours · 15–20 mars"
  - "Modifier" link

FILTER SIDEBAR (240px, left):
  - Price range slider: 0–200€/jour
  - Category: checkboxes
  - Transmission: Auto | Manuel
  - Seats: 2–7+
  - Features: Clim | GPS | Bluetooth | Siège bébé
  - Apply / Reset buttons

RESULTS (right, flexible):
  - Results count: "12 véhicules disponibles"
  - Sort: Price | Rating | Category | Popularity
  - Vehicle Card grid (2 columns on 1440px)
  - Each card with "Sélectionner" CTA
  - Pagination or infinite scroll

MAP TOGGLE:
  - "Voir sur la carte" button (top-right)
  - Split view: list left / map right with agency pins
```

---

### PAGE 3: Booking Flow (`/reservation`)

```
STEP 1: Vehicle confirmation + options
  - Selected vehicle summary (full-width, bg #eff3fd)
  - Photo + model + dates + total baseline

  - Insurance selection: 3 radio cards (from Session 1)
  - Options (checkboxes with price):
    - GPS +3€/j
    - Siège bébé +2€/j
    - Conducteur additionnel +5€/j
  - "Inclus dans le prix" section: unlimited km, 24h assistance

STEP 2: Driver information
  - Prénom, Nom, Téléphone (+262), Email
  - Date de naissance
  - Permis de conduire: number + issue country + expiry
  - Upload photo permis (front + back) — optional at this stage
  - Age confirmation: <25 = young driver fee displayed

STEP 3: Payment
  - Stripe payment form
  - Options: Full payment | Acompte 20% (pay rest at pickup)
  - Final price breakdown (very detailed, no surprises)
  - Promo code field
  - Terms checkbox
  - "Confirmer et payer [AMOUNT]€" — large primary button

STICKY SIDEBAR throughout:
  - Booking summary card (from Session 1) — always visible
  - Dynamic total updates as options are added
```

---

### PAGE 4: My Rental (`/ma-location/[id]`)

```
STATUS CARD (prominent):
  - "Votre location est confirmée" (success)
  - Countdown: "Dans 3 jours · 6 heures"
  - QR code for agency

Documents section:
  - "Télécharger le bon de réservation" (PDF)
  - "Télécharger la facture"

Vehicle info:
  - Model, plate number (if assigned), color
  - "Votre véhicule: Renault Clio · Blanc · AA-123-BB"

Pickup info card (from Session 1 components):
  - Airport instructions
  - Agency address on map
  - Contact + opening hours

Actions:
  - "Modifier ma réservation" (outline)
  - "Annuler" (ghost destructive)
  - "Besoin d'aide" (ghost)
```

---

## CRO Notes

1. **Search form in hero**: single most important CRO element — car rental is intent-driven
2. **Price transparency**: show total price (not daily) in results → reduces abandonment at checkout
3. **Insurance as step 1** (not step 3): anchors higher value earlier in funnel
4. **Young driver fee** shown before commitment: transparency builds trust
5. **Acompte option**: Reunion Island — full prepayment hesitation, acompte converts better
6. **QR code on confirmation**: reduces "where do I go?" friction at pickup
7. **No-surprise policy**: "frais cachés" is #1 concern in car rental — address it proactively
