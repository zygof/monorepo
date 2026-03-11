# MARRYFOOD — UX Pilot Session 1: Design System & Components

## Expert Persona

You are a UX designer with deep roots in Reunion Island's restaurant culture. You've designed digital menus and reservation systems for the best rougail saucisses spots in Saint-Denis. You understand the authentic Creole dining experience: convivial, generous portions, extended family meals, "ti-punch before the menu." Your UI should feel like walking into a warm family restaurant, not a cold startup.

---

## Design System

### Brand

- **Name**: MARRYFOOD
- **Product**: Authentic Creole restaurant — online reservation & digital menu
- **Tagline**: "Les saveurs de l'île, à votre table."
- **Market**: Reunion Island, authentic Creole cuisine, families & tourists

### Color Palette

```
primary:          #D4821A  (deep saffron — warmth, spices, sun)
primary-light:    #fef3e2  (warm cream — hover backgrounds)
primary-dark:     #a8640d  (dark amber — CTA hover)
secondary:        #2D6A4F  (forest green — freshness, herbs, nature)
secondary-light:  #edf6f1  (mint background)
secondary-dark:   #1a4532  (deep forest — text on light)
background:       #FEFAE0  (warm off-white, like sunlit tablecloth)
surface:          #ffffff
text:             #1a1200  (warm near-black)
text-muted:       #6b7280
border:           #e6d9b8  (warm wheat)
success:          #16a34a
```

### Typography

```
font-heading:  Lora, Georgia, serif     (warm, literary, traditional)
font-body:     Inter, system-ui, sans-serif
```

### Border Radius

```
sm: 6px   | md: 10px   | lg: 16px   | xl: 24px   | full: 9999px
```

---

## Components to Generate (Session 1)

### 1. MARRYFOOD Button System

```
Primary: bg #D4821A, white text — "Réserver une table" — warm, inviting
Secondary: bg #2D6A4F, white text — "Voir le menu"
Outline: border #D4821A, text #D4821A
Ghost: text #D4821A
```

### 2. Dish Card (Menu Item)

```
Structure:
- Photo (full-width, 200px, rounded top-16px)
- Creole badge overlay: "🌶 Épicé" | "⭐ Spécialité" | "🌱 Végétarien"
  (saffron bg, dark text for spicy; green bg for vegetarian)
- Body (padding 16px):
  - Dish name: Lora, 20px, #1a1200 (e.g., "Rougail Saucisses")
  - Subtitle: category muted (e.g., "Plat traditionnel créole")
  - Description: Inter 13px, #6b7280, 2 lines, italic
  - Allergen badges (small): Gluten | Lactose | etc. — outlined pills
  - Price: "14,50 €" — #D4821A, Lora bold, 20px
  - CTA: "Ajouter à ma commande" — outline button (small)

Card: white, border #e6d9b8, radius 16px, shadow-sm
Warm photo overlay: subtle saffron gradient at bottom (name legibility)
```

### 3. Reservation Card (Booking Summary)

```
Header: 🍽️ "Votre réservation"
- Border-left: 4px #D4821A

Rows:
- 👥 "4 personnes"
- 📅 "Samedi 15 mars 2026"
- 🕐 "19h30"
- 📍 "Restaurant MARRYFOOD · Saint-Denis"
- 💬 "Table en terrasse demandée"

Status badge: "Confirmée" (success) | "En attente" (warning)

Actions:
- "Modifier" — outline saffron
- "Annuler" — ghost destructive

Card: white, border #e6d9b8, radius 16px, left accent line #D4821A
```

### 4. Menu Category Header

```
Each menu section starter:
- Background: bg #fef3e2
- Left icon: large emoji (e.g., 🍲 for Plats · 🥗 for Entrées · 🍮 for Desserts)
- Category name: Lora 24px #1a1200
- Item count: "(12 plats)" — muted
- Optional description: "Notre sélection de plats créoles traditionnels"
- Separator line: #e6d9b8

Height: 80px desktop / 64px mobile
```

### 5. Table Availability Selector

```
Visual top-down floor plan:
- Tables as rounded rectangles
- Colors:
  - Available: green bg #edf6f1, border #2D6A4F
  - Reserved: grey bg #f1f5f9, border #94a3b8, "Réservée" label
  - Selected: bg #D4821A, border #a8640d, white text "Votre table"
  - My selection: pulsing border animation

Below plan: "Table sélectionnée: Table 7 · Terrasse · 4 places"
Or list view fallback on mobile (table rows with zone/capacity/availability)
```

### 6. Daily Special Banner (Menu du jour)

```
Full-width card, height 120px:
- Background: #D4821A gradient → #a8640d
- Left: dish photo (circular, 80px diameter)
- Center text:
  - "Menu du jour" badge (white pill)
  - Dish name: "Carry poulet · Riz · Gratin" (white, Lora 20px)
  - Price: "12 €" (large, white, bold)
- Right: "Commander" button (white outline)

Border-radius: 16px
Available indicator: "Disponible jusqu'à 14h00" — small white text
```

### 7. Allergen / Dietary Icons Legend

```
Icon grid (6 items, 2 rows):
- 🌶 Épicé · 🌱 Végétarien · 🐟 Contient du poisson
- 🥛 Lactose · 🌾 Gluten · 🥜 Fruits à coque

Each: small icon + label + tooltip on hover
Displayed at top of menu page
```

### 8. Opening Hours Widget

```
Card: white, border #e6d9b8, radius 12px
Header: "🕐 Horaires d'ouverture"
Day rows: Lun–Sam formatted
- Today highlighted: bg #fef3e2, text #D4821A, bold
- Closed days: text #6b7280, italic "Fermé"
- Current status pill: "Ouvert · Ferme à 22h00" (success) or "Fermé · Ouvre demain 11h30" (muted)
```
