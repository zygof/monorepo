# MARRYFOOD — UX Pilot Session 2: Web Flow (Desktop + Mobile)

## Expert Persona

You design hospitality digital experiences. Your specialty: blending warmth and tradition with modern UX. You've redesigned LaFourchette (TheFork) flows for French overseas markets. You know that Reunion Island restaurant customers want to feel welcomed before they even arrive — the website should smell of vanilla and rougail.

---

## Design System Reference

**Colors**: primary `#D4821A` · secondary `#2D6A4F` · background `#FEFAE0` · surface `#ffffff` · text `#1a1200` · muted `#6b7280` · border `#e6d9b8`

**Typography**: Lora (headings) · Inter (body)

---

## Pages to Generate

### PAGE 1: Homepage (`/`)

```
HEADER (sticky, 72px, white with bottom border):
  - Logo "MARRYFOOD" (Lora, #D4821A) + fork+leaf icon
  - Nav: Notre carte | Réserver | Notre histoire | Contact
  - CTA: "Réserver une table" (primary)

HERO (90vh):
  - Full-width background: beautiful plate of rougail saucisses, warm photography
  - Overlay: dark gradient left 50% (for text legibility)
  - Text block left:
    - "Restaurant Créole" small label, #D4821A
    - H1: "Les saveurs de l'île, à votre table." (Lora 64px, white)
    - Description: "Cuisine créole authentique · Produits locaux · Saint-Denis, La Réunion"
    - CTA row: "Réserver une table" (primary) + "Découvrir la carte" (white outline)
  - Floating availability card (right side, white, shadow-xl):
    - "Réserver ce soir" — quick booking widget
    - Date: today default, dropdown
    - Time: "19h30" select
    - Guests: [–] 2 [+]
    - "Vérifier les disponibilités" button

ATMOSPHERE STRIP (4 square photos, horizontal):
  - Ambiance terrasse, plats, équipe, intérieur

SIGNATURE DISHES SECTION:
  - Title: "Nos spécialités créoles" (Lora)
  - Grid 3 columns of Dish Cards
  - Below: "Voir toute la carte →"

STORY SECTION (alternating layout):
  - Chef portrait + story text
  - "Notre histoire" — "Depuis 2009, nous perpétuons la tradition créole..."
  - Local sourcing highlight: "🌿 Produits locaux · 🤝 Producteurs réunionnais"

TESTIMONIALS:
  - Background: dark warm (#2d1a00)
  - Large quote cards, white text, saffron stars

RESERVATION SECTION:
  - Full-width, saffron gradient background
  - Inline booking form (wider, 700px max)
  - "Nous vous attendons" headline (Lora, white)

FOOTER:
  - Logo + tagline + address + hours
  - "Powered by MARRYNOV" subtle link
```

---

### PAGE 2: Menu (`/carte`)

```
PAGE HEADER:
  - Hero image: full-width 200px height, food photography
  - Breadcrumb + title "Notre Carte"
  - Daily special banner (from Session 1 components)

STICKY CATEGORY NAV:
  - Tabs: 🥗 Entrées | 🍲 Plats | 🍮 Desserts | 🥤 Boissons | 🍽️ Menu du jour

ALLERGEN LEGEND (collapsible panel, top of menu):
  - "Afficher la légende des allergènes" toggle

MENU CONTENT:
  Each section:
  - Category Header (from Session 1)
  - Grid 2 columns of Dish Cards

  Sections: Entrées (4) | Plats (12) | Desserts (6) | Boissons (8)

ORDER OPTION CALLOUT:
  - "Vous souhaitez commander à emporter ?" → call/WhatsApp
  - WhatsApp button: "Commander sur WhatsApp" (green, WhatsApp icon)
```

---

### PAGE 3: Reservation (`/reserver`)

```
2-column layout:

LEFT (form, 60%):
  Step 1: "Vos préférences"
  - Date picker (calendar inline)
  - Time select: "12h00" | "12h30" | ... | "21h30"
  - Guests: stepper 1–12
  - Zone: "Intérieur" | "Terrasse" | "Pas de préférence" (radio cards)
  - Occasion: "Anniversaire" | "Romantique" | "Professionnel" | "Famille" (chips)

  Step 2: "Vos coordonnées"
  - Prénom, Nom, Téléphone, Email
  - Commentaire textarea
  - Toggle: "Rappel SMS 24h avant"
  - Checkbox CGV

  CTA: "Confirmer la réservation" (primary, full-width)

RIGHT (sticky, 40%):
  - Preview card: live-updating reservation summary
  - Restaurant info: address, phone, parking
  - Policy: "Annulation jusqu'à 2h avant · Table maintenue 15 min"
  - Photo of dining room

CONFIRMATION PAGE:
  - Success animation
  - Reservation details card
  - "Ajouter au calendrier" + "Modifier" buttons
  - "Découvrir notre carte" CTA
```

---

## CRO Notes

1. **In-hero booking widget**: captures intent at peak engagement moment
2. **WhatsApp order option**: critical for Reunion Island — many prefer messaging
3. **Dietary tags on menu**: reduces pre-visit phone calls (negative friction)
4. **Photo-first**: Lora + saffron creates appetite — 3 more menu views before bounce
5. **Occasion selector**: personalization increases perceived quality of experience
6. **Table hold policy visible**: reduces no-shows by setting expectations upfront
