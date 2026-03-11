# MARRYHAIR — UX Pilot Session 1: Design System & Components

## Expert Persona

You are a senior UX designer specializing in luxury beauty and wellness brands. You have 10+ years of experience designing for high-end salons in Paris and creating premium digital experiences for women-focused businesses. You deeply understand CRO for appointment-based services: your designs consistently convert browsers to bookers. You follow Reunion Island cultural sensibilities — warm, community-driven, personal touch.

---

## Design System

### Brand

- **Name**: MARRYHAIR
- **Product**: Premium hair salon booking platform
- **Tagline**: "Révélez votre beauté."
- **Market**: Reunion Island (La Réunion), French-speaking, mobile-first

### Color Palette

```
primary:          #8B2D5C  (deep rose-plum — elegance, femininity)
primary-light:    #f7eef3  (soft blush — backgrounds, hover states)
primary-dark:     #5c1d3e  (dark plum — CTAs hover, text on light)
secondary:        #C9A84C  (warm gold — premium accent, prices, highlights)
secondary-light:  #f9f4e3  (cream gold — subtle backgrounds)
secondary-dark:   #a0862e  (antique gold — secondary hover)
background:       #FDFAF7  (warm linen — main background)
surface:          #ffffff  (cards, modals)
text:             #2d2020  (warm near-black)
text-muted:       #6b7280  (secondary text, labels)
border:           #e8ddd8  (warm beige borders)
success:          #16a34a
error:            #dc2626
```

### Typography

```
font-heading:  Playfair Display, Georgia, serif   (elegant, premium feel)
font-body:     Inter, system-ui, sans-serif       (clean, readable)
```

### Border Radius

```
sm: 6px   | md: 12px   | lg: 20px   | full: 9999px
```

### Shadows

```
sm: subtle card lift
md: standard card shadow
lg: modal / dropdown shadow
```

### Components Available (from @marrynov/ui)

- `Button` — variants: default (primary), secondary, outline, ghost, link
- `Badge` — variants: default, secondary, success, muted, outline
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Input` — form fields
- `Select` — dropdown selects
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Avatar`, `AvatarImage`, `AvatarFallback`

---

## Components to Generate (Session 1)

### 1. MARRYHAIR Button System

Generate all button variants in the MARRYHAIR color palette:

- **Primary CTA**: `bg-[#8B2D5C]` text-white, "Réserver maintenant" — pill shape (border-radius: 9999px), large size, with subtle gold shimmer on hover
- **Secondary CTA**: `bg-[#C9A84C]` text-white, "Voir les prestations"
- **Outline**: border `#8B2D5C`, text `#8B2D5C`, transparent bg
- **Ghost**: text-only, `#8B2D5C`, no border
- **Disabled state**: 40% opacity

Show all buttons at 3 sizes: sm / md / lg.

### 2. Service Card (Prestation)

A card representing a salon service:

```
Structure:
- Category badge (e.g., "Coupe", "Coloration", "Soin") — using Badge component, primary variant
- Service name (Playfair Display, 20px, #2d2020)
- Brief description (Inter, 14px, #6b7280, 2 lines max)
- Duration badge: "⏱ 45 min" — muted variant
- Price: "À partir de 45 €" — #C9A84C (gold), bold, 18px
- "Réserver" button — primary outline variant
- Hover state: card lifts (shadow-lg), border becomes #8B2D5C

Background: #ffffff
Border: 1px solid #e8ddd8
Border-radius: 20px
Padding: 24px
```

### 3. Stylist Avatar Card

A card presenting a salon team member:

```
Structure:
- Round avatar photo (80px diameter) — Avatar component
- Name: Playfair Display, 18px, #2d2020
- Specialty badge: "Coloriste Expert" — secondary (gold) variant Badge
- Short bio: 2 lines, Inter 14px, #6b7280
- Star rating: 5 stars filled #C9A84C + count "(47 avis)"
- "Réserver avec [name]" — primary ghost button

Card: white surface, border #e8ddd8, radius 20px
```

### 4. Availability Time Slots

A time-picker component for the booking flow:

```
Structure:
- Section header: "Créneaux disponibles — Mardi 12 mars"
- Grid of time buttons (3 columns): "09:00", "09:30", "10:00"...
- States:
  - Available: white bg, border #e8ddd8, text #2d2020, hover border #8B2D5C
  - Selected: bg #8B2D5C, text white, shadow-md
  - Unavailable: bg #f9f4e3, text #94a3b8, strikethrough, not clickable
- Below grid: "Pas de disponibilité? → Rejoindre la liste d'attente" link
```

### 5. Booking Confirmation Card

A summary card shown at step 3 of the booking flow:

```
Structure:
- Header with gold accent line: "Récapitulatif de votre réservation"
- Row: Prestation — "Coupe + Brushing" — "65 €"
- Row: Styliste — Avatar(sm) + "Sophie M."
- Row: Date/Heure — Calendar icon + "Mardi 12 mars à 10h00"
- Row: Salon — Location pin + "Salon MARRYHAIR — Sainte-Clotilde"
- Divider
- Total line: "Total" — "65 €" (gold, bold)
- Deposit note: "Acompte de 15 € requis pour confirmer"
- CTA: "Confirmer et payer l'acompte" — primary full-width button
- Below: small text "Annulation gratuite jusqu'à 24h avant"

Card: white, border #e8ddd8, radius 20px, shadow-lg
```

### 6. Star Rating Component

Reusable rating display:

```
- 5 star icons (filled = #C9A84C, empty = #e8ddd8)
- Average score: "4.8" — bold, #2d2020
- Review count: "(127 avis)" — #6b7280
- Optional: "Excellent" label badge
```

### 7. Promotional Banner

Full-width banner for promotions:

```
- Background gradient: linear from #8B2D5C to #5c1d3e
- Gold top border line: 3px solid #C9A84C
- Badge: "OFFRE LIMITÉE" — gold on dark
- Title: "15% sur votre 1ère visite" — white, Playfair Display, 28px
- Subtitle: "Code BIENVENUE · Valable jusqu'au 31 mars"
- CTA: "En profiter" — white outline button

Height: 120px desktop / 160px mobile
```

### 8. Toast / Notification

Success notification after booking:

```
- Left border: 4px solid #16a34a
- Background: #f0fdf4
- Icon: check circle (#16a34a)
- Title: "Réservation confirmée !" — bold #2d2020
- Body: "Sophie vous attend mardi 12 mars à 10h00"
- Close X button top-right
- Auto-dismiss: 5 seconds
```

---

## Context Notes for UX Pilot

- **Platform**: Mobile-first (70% of Reunion Island bookings are done on mobile)
- **Audience**: Women 25–55, French-speaking, value quality and personal relationship with stylist
- **CRO Focus**: Reduce friction to first booking — minimize form fields, show social proof early (ratings, photos), clear pricing upfront
- **Cultural note**: Reunion Island clients value warmth and personal connection — avoid cold/corporate aesthetics
