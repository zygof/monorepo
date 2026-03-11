# MARRYCAR — UX Pilot Session 1: Design System & Components

## Expert Persona

You are a UX designer specializing in travel and car rental platforms. You've redesigned Sixt, Europcar, and local rental agencies in French overseas territories. You know that car rental conversion is about speed + trust: show the car, show the price, minimize the steps. Reunion Island context: tourists need airport pickup info; locals rent for convenience.

---

## Design System

### Brand

- **Name**: MARRYCAR
- **Product**: Car rental platform — La Réunion
- **Tagline**: "L'île à votre rythme."
- **Market**: Reunion Island — tourists + locals, professional feel

### Color Palette

```
primary:          #1B4FD8  (electric blue — trust, professionalism, sky)
primary-light:    #eff3fd  (light blue — hover backgrounds)
primary-dark:     #1239a8  (navy — CTA hover)
secondary:        #F97316  (vibrant orange — energy, CTA accent)
secondary-light:  #fff4ed  (peach — subtle backgrounds)
secondary-dark:   #c85a0a  (burnt orange — secondary hover)
background:       #F8FAFF  (very light blue-white)
surface:          #ffffff
text:             #0a1628  (near-black with blue tint)
text-muted:       #6b7280
border:           #d1daf0  (blue-tinted border)
success:          #16a34a
```

### Typography

```
font-heading:  Inter, system-ui, sans-serif   (clean, professional)
font-body:     Inter, system-ui, sans-serif
```

### Border Radius

```
sm: 4px   | md: 8px   | lg: 16px   | full: 9999px
(sharper radius = professional/automotive feel)
```

---

## Components to Generate (Session 1)

### 1. MARRYCAR Button System

```
Primary: bg #1B4FD8, white — "Réserver ce véhicule" — rectangular with slight radius
Secondary: bg #F97316, white — "Voir la disponibilité"
Outline: border #1B4FD8, text #1B4FD8
Ghost: text #1B4FD8
Show confident, corporate-looking buttons
```

### 2. Vehicle Search Form

The core conversion widget:

```
Structure (horizontal row on desktop, vertical on mobile):
- Field 1: "📍 Lieu de prise en charge"
  - Options: Aéroport Roland Garros | Saint-Denis centre | Saint-Pierre | Vous livrer
  - Select with location icon

- Field 2: "📅 Date de départ"
  - Date picker, default today+1

- Field 3: "🕐 Heure de départ"
  - Time select, default 10h00

- Field 4: "📅 Date de retour"
  - Date picker

- Field 5: "🕐 Heure de retour"
  - Time select

- Field 6 (optional toggle): "✓ Retour à un endroit différent"

CTA: "🔍 Rechercher" — primary button (large, 52px height)

Overall: white card, shadow-xl, border-radius 8px
On homepage: overlaying hero with slight lift effect
```

### 3. Vehicle Card (Catalogue)

```
Structure:
- Category badge top-right: "Économique" | "Familiale" | "SUV" | "Luxe" | "Utilitaire"
  (blue outline badge)
- Vehicle photo (full-width, 180px, object-contain on white bg)
- Model name: Inter bold 18px (e.g., "Renault Clio · 2024")
- Features row (icons + text):
  - 🪑 5 places · 🧳 2 bagages · ⚙️ Automatique · ❄️ Climatisation
- Rating: ⭐ 4.7 (34 avis)
- Pricing block:
  - "À partir de" label (muted, small)
  - "35 €/jour" — primary blue, Inter bold 24px
  - "Total estimé: 175 € (5 jours)" — muted small
- CTA: "Sélectionner" — full-width primary button

Card: white, border #d1daf0, radius 8px, shadow-sm
Hover: shadow-md, border #1B4FD8
Featured badge: orange ribbon top-left
```

### 4. Booking Summary Sidebar

```
Header: "Récapitulatif"

Vehicle row:
- Small photo + model name + category badge

Details rows:
- 📍 Prise en charge: Aéroport · 15 mars 10h00
- 📍 Retour: Saint-Denis · 20 mars 18h00
- ⏱ Durée: 5 jours

Price breakdown:
- Location: 5 × 35€ = 175€
- Assurance tous risques: 25€
- Jeune conducteur: −
- Remise code: −10€ (if applied)
- Total TTC: 190€ (blue, bold, 22px)

CTA: "Payer maintenant" — primary full-width
Security badge: "🔒 Paiement sécurisé"
Cancellation: "Annulation gratuite jusqu'à 48h avant"
```

### 5. Insurance Option Cards

```
3 options (radio card behavior):
Card 1: "Tiers simple" — 0€/jour
- Coverage description, limits listed
Card 2: "Tous risques" (recommended badge) — 5€/jour
- Better coverage, highlighted with blue border
Card 3: "Premium" — 10€/jour
- Full coverage, zero deductible

Each card:
- Radio button left
- Name + price
- 3 bullet points of coverage
- Selected state: border #1B4FD8, bg #eff3fd
- Recommended: orange "RECOMMANDÉ" badge
```

### 6. Airport Pickup Info Card

```
Prominent info card for airport pickup:
- Header: "✈️ Prise en charge à l'aéroport"
- Background: #eff3fd
- Steps:
  1. À l'arrivée, récupérez vos bagages
  2. Suivez les panneaux "Location de voitures"
  3. Notre agent vous attend avec votre prénom
  4. Inspection du véhicule + signature
- Contact: "En cas de problème: +262 XX XX XX XX"
- Flight delay policy: "Nous suivons votre vol en temps réel"
```

### 7. Availability Calendar Heatmap

```
Month calendar view:
- Each day: availability indicator
  - Available: white, normal
  - Limited: #fff4ed background, orange dot
  - Unavailable: #f1f5f9, strikethrough
  - Selected range: blue gradient fill
  - Start/end: strong blue circles

Legend: Available | Peu disponible | Complet

Hover tooltip: "3 véhicules disponibles ce jour"
```

### 8. Driver License Verification Badge

```
Trust badge component:
- Shield icon (#1B4FD8)
- "Permis vérifié" — displayed after user uploads license
- Green success state after verification
- "Vérification en cours..." loading state
Used in checkout flow, step "Vos informations"
```
