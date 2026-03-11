# MARRYHAIR — UX Pilot Session 2: Web Flow (Desktop)

## Expert Persona

You are a senior product designer specializing in service booking platforms. You've redesigned Treatwell, Fresha, and Booksy for European markets. Your specialty is CRO for local service businesses — you know exactly what layout elements double appointment conversion rates. You understand the Reunion Island market: French-speaking, mobile-first, community-driven, warm aesthetics.

---

## Design System Reference

**Colors**: primary `#8B2D5C` · primary-dark `#5c1d3e` · secondary `#C9A84C` · background `#FDFAF7` · surface `#ffffff` · text `#2d2020` · muted `#6b7280` · border `#e8ddd8`

**Typography**: Playfair Display (headings) · Inter (body)

**Radius**: md=12px · lg=20px · full=9999px

**Components**: Button (primary/secondary/outline/ghost) · Card · Badge · Input · Select · Dialog · Tabs · Avatar

---

## Pages to Generate (Desktop — 1440px viewport)

### PAGE 1: Homepage (`/`)

**Goal**: Convert first-time visitors into bookings within 3 seconds.

**Layout**:

```
HEADER (sticky, 72px)
  - Logo "MARRYHAIR" (Playfair Display, plum)
  - Nav: Prestations | Équipe | Galerie | Avis | Contact
  - CTA button: "Réserver" (primary, pill shape)

HERO SECTION (full-height, 100vh)
  - Left (55%):
    - Badge: "★ 4.9/5 · 127 avis Google"
    - H1: "Révélez votre beauté." (Playfair Display, 64px, #2d2020)
    - Subtitle: "Salon de coiffure premium à Sainte-Clotilde, La Réunion."
    - CTA primary: "Réserver maintenant" → /booking
    - CTA ghost: "Découvrir nos prestations" → /prestations
    - Trust bar: 3 icons + text: "✓ Sans acompte · ✓ Annulation 24h · ✓ 3 stylistes certifiés"
  - Right (45%):
    - Hero image: stylist working, warm lighting, salon interior
    - Floating card: next available slot "Prochain créneau libre: Aujourd'hui 15h30" (white card, shadow-lg)

SOCIAL PROOF BAR (80px, bg #f7eef3)
  - Row of 5 Google review snippets with star ratings and first names
  - "Voir tous les avis →" link

SERVICES SECTION (`/prestations`)
  - Title: "Nos prestations" (Playfair, centered)
  - Tabs: Coupe | Coloration | Coiffage | Soins | Mariée
  - Grid 3 columns of Service Cards (from Session 1)
  - Each card: name, duration, price, badge, "Réserver" button

TEAM SECTION
  - Title: "Votre équipe de stylistes"
  - Grid 3 columns of Stylist Avatar Cards (from Session 1)
  - Each links to individual stylist page with their calendar

GALLERY SECTION
  - Masonry grid 4 columns (12 photos)
  - Lightbox on click
  - Instagram CTA: "Suivez-nous @marryhair.re"

TESTIMONIALS SECTION
  - Dark background: #2d2020
  - 3 large quote cards (white text on dark, gold stars)
  - Auto-carousel with dots navigation

BOOKING CTA SECTION
  - Full-width, background gradient #8B2D5C → #5c1d3e
  - Gold decorative line
  - "Prêt(e) pour votre transformation ?"
  - CTA button white + CTA ghost white outline
  - Phone number displayed

FOOTER
  - Logo + tagline
  - Links: Mentions légales | CGV | Politique de confidentialité
  - "Propulsé par MARRYNOV" badge (subtle, bottom right)
  - Copyright + hours
```

---

### PAGE 2: Booking Flow (`/reservation`) — 3-step wizard

**Step 1: Choose service + stylist**

```
Layout: 2 columns (60/40)
Left column:
  - Step indicator: [1] Prestation → [2] Créneau → [3] Confirmation
  - Section: "Choisissez votre prestation"
  - Service selector: cards with radio behavior
    - Each card: name, duration badge, price, select radio
    - Selected state: border #8B2D5C, bg #f7eef3
  - Section: "Choisissez votre styliste" (optional)
  - Stylist selector: horizontal scroll of avatar cards
    - "Pas de préférence" option (first card)
  - CTA: "Continuer" → Step 2

Right column (sticky):
  - Booking summary card (updates live)
  - Shows: selected service, stylist, duration, price
```

**Step 2: Choose date & time**

```
Layout: 2 columns
Left column:
  - Calendar component (month view, inline)
    - Available days: normal
    - Selected day: bg #8B2D5C, text white
    - Past days: greyed, not clickable
    - Full days: strike pattern
  - Below calendar: time slots grid (from Session 1)
  - "Créneau sélectionné: Mardi 12 mars · 10h00" confirmation chip

Right column (sticky):
  - Booking summary card (now shows date/time)
  - CTA: "Continuer" (disabled until slot selected)
```

**Step 3: Contact details + confirmation**

```
Form fields:
  - Prénom / Nom (2 columns)
  - Téléphone (with +262 Réunion flag)
  - Email
  - Message (optional textarea)
  - Checkbox: "Me prévenir par SMS 24h avant"
  - Checkbox: "J'accepte les CGV" (required)

Booking summary card (full details, from Session 1)

CTA: "Confirmer la réservation" — primary full-width
Below: "Aucun acompte requis pour cette prestation"
```

---

### PAGE 3: Services Page (`/prestations`)

```
Hero: H1 "Toutes nos prestations" + subtitle + breadcrumb

Filter tabs: Coupe | Coloration | Coiffage | Soins | Mariée | Tous

Service grid: 3 columns
- Each card (from Session 1)
- Filter animation: smooth

Sidebar/banner: "Forfait Découverte — 1ère visite -15%" promo banner

Bottom CTA section: Booking prompt
```

---

### PAGE 4: Admin Dashboard (`/admin`)

**Accessible to: salon owner only**

```
Sidebar (240px):
  - Logo MARRYHAIR
  - Nav: Planning | Rendez-vous | Clients | Prestations | Statistiques | Paramètres
  - User avatar + name at bottom

Main content area:

PLANNING VIEW (default):
  - Week calendar grid (7 columns, 8h–20h rows)
  - Each RDV: colored block (color by stylist)
    - Name, service, duration shown in block
  - "Aujourd'hui" button to reset to current week
  - "+ Ajouter RDV" button (primary)
  - Stylist filter chips: Sophie | Amélie | Marie | Tous

RDV LIST VIEW (table):
  - Columns: Date | Heure | Client | Prestation | Styliste | Statut | Actions
  - Status badges: "Confirmé" (success) | "En attente" (warning) | "Annulé" (error)
  - Row actions: Voir | Modifier | Annuler
  - Search bar + date filter

STATS WIDGET ROW (top of dashboard):
  - Card: RDV aujourd'hui — count
  - Card: CA ce mois — "1 240 €"
  - Card: Taux de remplissage — "78%"
  - Card: Nouveaux clients — count
```

---

## CRO Notes (Desktop)

1. **Above-the-fold booking**: CTA visible within first 3 seconds — no scrolling required
2. **Social proof proximity**: Star rating displayed next to first CTA
3. **Next available slot**: Show in hero — creates urgency without false scarcity
4. **Trust signals**: Cancellation policy, certification badges near booking button
5. **Pricing transparency**: Show price on every service card — hidden pricing kills conversion
6. **Progress indicator**: 3-step wizard reduces perceived complexity
7. **Live booking summary**: Right-column sticky summary reduces abandonment
