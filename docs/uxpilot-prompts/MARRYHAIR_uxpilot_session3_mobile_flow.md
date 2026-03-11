# MARRYHAIR — UX Pilot Session 3: Mobile Flow (iOS/Android)

## Expert Persona

You are a mobile UX specialist who has shipped 20+ React Native and mobile web apps for local service businesses. You know the specific UX patterns that work on Reunion Island: thumb-friendly navigation, WhatsApp-style familiarity, bottom sheets over modals. 70% of bookings happen on mobile — this is the primary surface. You optimize for one-thumb reachability and fast load on 4G.

---

## Design System Reference

**Colors**: primary `#8B2D5C` · secondary `#C9A84C` · background `#FDFAF7` · surface `#ffffff` · text `#2d2020` · muted `#6b7280` · border `#e8ddd8`

**Viewport**: 390px width (iPhone 14) — design for 390px, scale to 360px

**Safe areas**: 44px top (status bar) · 34px bottom (home indicator)

**Touch targets**: Minimum 48×48px for all interactive elements

---

## Screens to Generate (Mobile)

### SCREEN 1: Home / Splash (`/`)

```
STATUS BAR: white background, dark icons

HEADER (56px):
  - Logo "MARRYHAIR" centered (Playfair, plum)
  - Menu hamburger right (32px touch target)

HERO (320px height):
  - Background image: salon interior, warm lighting
  - Overlay gradient: #8B2D5C 40% opacity bottom
  - Badge floating: "★ 4.9 · 127 avis" — white pill, top-left
  - H1: "Révélez votre beauté." — white, Playfair 36px
  - Subtitle: "Salon premium · Sainte-Clotilde" — white 14px

PRIMARY CTA BUTTON (full-width, 52px height):
  - "Réserver un créneau" — bg #8B2D5C, text white, radius 9999px
  - Below: "Prochain dispo: Aujourd'hui 15h30" — small text #C9A84C

SECTION: "Nos prestations" (horizontal scroll)
  - Title row: "Nos prestations" + "Tout voir →"
  - Horizontal card scroll (snapping):
    - Card 156px wide × 180px tall
    - Category badge, name, price (#C9A84C), "→ Réserver"
  - No scrollbar visible

SECTION: "Notre équipe"
  - Title row: "Notre équipe" + "Tout voir →"
  - Horizontal scroll of stylist avatars + name below
    - Circle 72px, name 12px centered

SECTION: "Avis clients"
  - Rating summary: big "4.9" + 5 stars + "(127 avis)"
  - Horizontal card scroll: 3 review cards
  - Each: stars, first name, date, 2-line quote

BOTTOM NAVIGATION BAR (56px + safe area):
  - Accueil | Prestations | Réserver | Équipe | Mon compte
  - "Réserver" tab: highlighted bg #8B2D5C with white icon (centered, prominent)
  - Active state: icon + label colored #8B2D5C
```

---

### SCREEN 2: Booking Flow Step 1 — Service Selection

```
HEADER:
  - Back arrow left
  - "Réserver" centered (16px, #2d2020)
  - Step indicator: "1/3" right

PROGRESS BAR:
  - Full width, 4px height
  - 33% filled: #8B2D5C
  - Remaining: #e8ddd8

CONTENT (scrollable):
  - Section title: "Quelle prestation ?"
  - Category filter chips (horizontal scroll):
    - Tous | Coupe | Coloration | Coiffage | Soins | Mariée
    - Active chip: bg #8B2D5C, text white, radius 9999px
    - Inactive: border #e8ddd8, text #6b7280
  - Service list (vertical, full-width cards):
    - Each card 80px height:
      - Left: icon/emoji + service name (bold) + duration badge
      - Right: price (#C9A84C, bold) + chevron
      - Selected: border 2px #8B2D5C, bg #f7eef3, check icon

  - Section title: "Avec quel styliste ?"
  - Horizontal stylist scroll (same as homepage)
  - "Pas de préférence" option (first, with random-assign icon)

STICKY BOTTOM:
  - Summary: "Coupe + Coloration · Sophie · 90 min"
  - CTA: "Continuer" — full-width primary button (disabled until service selected)
  - Safe area padding
```

---

### SCREEN 3: Booking Flow Step 2 — Date & Time (Bottom Sheet pattern)

```
HEADER: same as step 1, "2/3"

CONTENT:
  - Section title: "Choisissez une date"
  - Inline calendar (month view, full width):
    - Navigation: "< Février 2026 >"
    - Grid: Mo Tu We Th Fr Sa Su
    - Available: #2d2020 number, tap to select
    - Selected: circle bg #8B2D5C, white number
    - Today: underline
    - Past/unavailable: #94a3b8, disabled

  - Smooth separator

  - Section title: "Créneaux disponibles"
    - Sub: "Mardi 12 mars"
  - Time slot grid (3 columns, each 100px × 44px):
    - Available: border #e8ddd8, radius 9999px, #2d2020
    - Selected: bg #8B2D5C, white, shadow
    - Taken: bg #f9f4e3, #94a3b8, strike
  - "Aucun créneau disponible ? Rejoindre la liste d'attente →"

STICKY BOTTOM:
  - Summary: "Coupe · Sophie · Mardi 12 mars · 10h00"
  - CTA: "Continuer"
```

---

### SCREEN 4: Booking Flow Step 3 — Confirmation

```
HEADER: "3/3 · Vos coordonnées"

FORM (vertical, full-width):
  - Prénom (full width Input)
  - Nom (full width Input)
  - Téléphone — with flag 🇷🇪 prefix "+262"
  - Email (keyboard type email)
  - Message (optional, textarea 3 rows)
  - Toggle: "Rappel SMS 24h avant" — right-aligned toggle switch

BOOKING SUMMARY CARD:
  - White surface, border #e8ddd8, radius 20px, shadow-md
  - Rows: Prestation | Styliste | Date/Heure | Lieu
  - Total row: gold text
  - "Annulation gratuite jusqu'à 24h avant" chip (success badge)

CTA SECTION (sticky bottom):
  - "Confirmer ma réservation" — full-width primary
  - Small: "En confirmant, j'accepte les CGV" (link)
  - Safe area
```

---

### SCREEN 5: Booking Success

```
FULL-SCREEN celebration:
  - Background: gradient #8B2D5C → #5c1d3e
  - Gold confetti animation (subtle, CSS-only)
  - Check icon: large white circle with gold checkmark
  - H1: "C'est confirmé !" — white, Playfair 32px
  - Details card (white, radius 20px):
    - Prestation, styliste, date, heure, adresse
  - Actions:
    - "Ajouter au calendrier" — outline white button
    - "Partager" — ghost white button (share API)
  - Bottom: "Retour à l'accueil" text link (white)
```

---

### SCREEN 6: My Appointments (`/mon-compte/rendez-vous`)

```
HEADER: "← Mon compte" + "Mes RDV"

TABS: "À venir" | "Passés"

À VENIR list:
  - Each appointment card (white, border #e8ddd8, radius 16px):
    - Header row: date badge (#8B2D5C, white) + status "Confirmé" (success badge)
    - Row: styliste avatar(sm) + name
    - Row: prestation name + duration
    - Row: "📍 Salon MARRYHAIR · Sainte-Clotilde"
    - Actions row: "Modifier" (outline) | "Annuler" (ghost destructive)
    - Separator
  - Countdown chip if < 48h: "Dans 23h · Pensez à votre parking 😊"

EMPTY STATE (no upcoming):
  - Illustration (calendar with scissors)
  - "Pas de RDV à venir"
  - CTA: "Prendre rendez-vous" — primary
```

---

## Mobile-Specific CRO Notes

1. **Bottom sheet pattern** for time selection — feels native, doesn't break flow
2. **One CTA per screen** — remove all competing actions on booking steps
3. **Progress bar** reduces abandonment by showing how close to completion
4. **Phone number with country flag** — Reunion Island (+262) by default
5. **SMS reminder toggle** — high-value signal (reduces no-shows by ~30%)
6. **Thumb zone**: all primary CTAs in bottom 40% of screen
7. **Bottom navigation**: "Réserver" tab center-prominent — single most important action
8. **Success screen fullscreen**: creates memorable positive experience, encourages sharing
9. **Booking in <3 taps**: Home → Service tap → Date tap → Confirm (pre-filled if returning user)
