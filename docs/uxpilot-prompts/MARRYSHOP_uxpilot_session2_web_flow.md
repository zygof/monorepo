# MARRYSHOP — UX Pilot Session 2: Web Flow (Desktop + Mobile)

## Expert Persona

You've redesigned the e-commerce experience for 30+ artisan brands in France and DOM-TOM. You know Shopify's and WooCommerce's conversion playbook inside-out, and you adapt it for authentic local brands. Key insight: artisan e-commerce buyers need to trust the maker before they buy. Story > features. Photos > specs.

---

## Design System Reference

**Colors**: primary `#A0522D` · secondary `#5F7A61` · background `#FAF7F2` · surface `#ffffff` · text `#2a1a0e` · muted `#6b7280` · border `#e0d5c8`

**Typography**: Lora (headings) · Inter (body)

---

## Pages to Generate

### PAGE 1: Homepage (`/`)

```
HEADER (sticky, 72px, white):
  - Logo "MARRYSHOP 🌺" (Lora, terracotta)
  - Nav: Boutique | Artisans | Coffrets | À propos | Contact
  - Search icon (magnifier)
  - Wishlist icon + count
  - Cart icon + count
  - CTA: "Mes commandes" (ghost if logged in)

HERO (80vh):
  - Split: left 50% text / right 50% lifestyle photo (artisan hands crafting)
  - Left:
    - Badge: "🌺 100% Réunion Island"
    - H1: "Fait à La Réunion, avec amour." (Lora 64px)
    - Subtitle: "Découvrez les créations uniques de nos artisans locaux."
    - CTA row: "Explorer la boutique" (primary) + "Offrir un coffret" (secondary)
    - Trust: "🚚 Livraison La Réunion & Métropole · 🔄 Retours 14j · ⭐ 4.9/5"

FREE SHIPPING BANNER (48px, bg #f8f0e8):
  - "Livraison offerte dès 50€ · Code: BIENVENUE pour -10% sur votre 1ère commande"
  - Countdown timer if promo ending

FEATURED CATEGORIES (4 columns):
  - 🍶 Épicerie fine · 🍹 Rhums arrangés · 🌸 Cosmétiques · 🧵 Artisanat
  - Square format, lifestyle photo + label + "Voir la collection →"

ARTISAN SPOTLIGHT:
  - "Nos artisans en vedette" section
  - 3 Artisan Profile Cards
  - "Découvrir tous nos artisans →"

NEW PRODUCTS:
  - "Nouveautés" + "Voir tout →"
  - Grid 4 columns of Product Cards

BESTSELLERS:
  - "Les plus appréciés" + stars
  - Grid 4 columns

GIFT PACK CTA:
  - Full-width section, warm linen background
  - "Un cadeau qui vient de l'île" — Lora 40px
  - Photo: wrapped gift with Reunion Island motifs
  - "Créer mon coffret" — primary CTA large

ARTISAN STORY SECTION:
  - Alternating: text + photo
  - "Pourquoi choisir nos artisans ?"
  - 3 values: Local · Authentique · Responsable

INSTAGRAM FEED:
  - Grid 6 photos from @marryshop.re
  - "Suivez-nous sur Instagram"

FOOTER:
  - Newsletter signup: "Recevez les nouveautés en avant-première"
  - Links: Boutique · Artisans · Coffrets · CGV · Mentions légales
  - Payment icons: Visa · Mastercard · CB
  - "Powered by MARRYNOV"
```

---

### PAGE 2: Catalog (`/boutique`)

```
HEADER: breadcrumb + "Toute la boutique" + product count

FILTERS (left sidebar 240px):
  - Category tree: Épicerie | Rhums | Cosmétiques | Artisanat | Coffrets
  - Artisan filter (checkboxes with artisan name + count)
  - Price range slider
  - Tags: Bio | Fait main | Zéro déchet | En stock
  - Sort: Pertinence | Prix ↑↓ | Nouveautés | Meilleures ventes

RESULTS AREA:
  - View toggle: Grid (4 cols) | List
  - Sort dropdown
  - Active filters chips (with X to remove)
  - Product grid
  - Pagination

PROMO BANNER (inline, every 12 products):
  - Artisan highlight card
  - "Découvrir Marie-Josée" style

QUICK VIEW:
  - Hover on product card → "Aperçu rapide" button
  - Opens Dialog with: photos + name + price + size options + add to cart
  - "Voir le produit complet →" link
```

---

### PAGE 3: Product Page (`/boutique/[slug]`)

```
BREADCRUMB: Boutique > Épicerie fine > Confiture Mangue-Vanille

PRODUCT AREA (2 columns):
  LEFT (photos 50%):
    - Product Image Gallery (from Session 1)
    - Artisan name badge linking to artisan page

  RIGHT (info 50%, sticky):
    - Category badge + product name (Lora 32px)
    - Rating summary (clickable → reviews section)
    - Price (terracotta, large)
    - Short description (2–3 lines, italic)
    - Variant selector (if applicable): Size | Flavor | Qty
    - Stock indicator: "✓ En stock · 8 restants" (success + urgency)
    - Qty stepper: [–][1][+]
    - "Ajouter au panier" — primary full-width (large)
    - "Ajouter à ma liste" — ghost with heart
    - Shipping info widget (from Session 1)
    - Gift note toggle: "Ajouter un message cadeau"

PRODUCT DETAILS (below fold):
  - Tabs: Description | Ingrédients/Composition | Livraison | Avis
  - Description: rich text, artisan story
  - Artisan Profile Card (full)

REVIEWS SECTION:
  - Rating header + individual review cards

RELATED PRODUCTS:
  - "Vous aimerez aussi" — 4 product cards
  - "Autres créations de Marie-Josée" — 4 product cards
```

---

### PAGE 4: Checkout (`/commande`)

```
3-step progress indicator

STEP 1: Cart review
  - Items list with quantities
  - Promo code
  - Total with free shipping progress

STEP 2: Delivery
  - Address form (La Réunion or Métropole → different shipping shown)
  - Delivery method: Standard | Express
  - Gift options: "Livraison directe au destinataire" + gift message

STEP 3: Payment
  - Stripe card form
  - Order summary (final, no surprises)
  - "Passer la commande · 46,50€" — large primary CTA
  - Security badges
```

---

## CRO Notes

1. **Free shipping threshold bar**: in cart + header — most effective single CRO lever for artisan e-commerce
2. **Artisan story on product page**: increases conversion 25% — people buy from people
3. **Quick view**: reduces navigating away from catalog = higher page RPV
4. **Gift messaging**: Reunion → Métropole gifting is 30% of orders — optimize this flow
5. **Stock scarcity display**: "8 restants" — genuine (artisan limited production) and effective
6. **Welcome promo code**: captures email + first purchase in one step
7. **Related by artisan**: increases average basket through artisan loyalty
