# Prompts UX Pilot — Gamme MARRYNOV

Ce dossier contient les prompts structurés pour générer les designs de la gamme MARRYNOV via [UX Pilot](https://uxpilot.ai).

---

## Workflow

```
1. Design tokens confirmés
   → packages/design-tokens/dist/tokens.[template].json

2. Session UX Pilot 1 — Composants
   → Générer les atomes et molécules réutilisables
   → Exporter en SVG/PNG → importer dans Figma

3. Session UX Pilot 2 — Web Flow
   → Générer les pages desktop (1440px)
   → Itérer avec Nicolas sur la disposition

4. Session UX Pilot 3 — Mobile Flow (coiffure et pizza uniquement)
   → Générer les écrans mobile (390px)
   → Exporter + intégrer avec Code Connect
```

---

## Templates disponibles

| Template   | Secteur             | Couleur primaire | Sessions  |
| ---------- | ------------------- | ---------------- | --------- |
| MARRYHAIR  | Salon de coiffure   | `#8B2D5C`        | 1 · 2 · 3 |
| MARRYPIZZA | Pizzeria            | `#E8401C`        | 1 · 2 · 3 |
| MARRYFOOD  | Restaurant créole   | `#D4821A`        | 1 · 2     |
| MARRYCAR   | Location de voiture | `#1B4FD8`        | 1 · 2     |
| MARRYSHOP  | Boutique artisan    | `#1B4FD8`        | 1 · 2     |

---

## Fichiers par template

### MARRYHAIR

- [Session 1 — Composants](./MARRYHAIR_uxpilot_session1_components.md)
- [Session 2 — Web Flow Desktop](./MARRYHAIR_uxpilot_session2_web_flow.md)
- [Session 3 — Mobile Flow](./MARRYHAIR_uxpilot_session3_mobile_flow.md)

### MARRYPIZZA

- [Session 1 — Composants](./MARRYPIZZA_uxpilot_session1_components.md)
- [Session 2 — Web Flow Desktop](./MARRYPIZZA_uxpilot_session2_web_flow.md)
- [Session 3 — Mobile Flow](./MARRYPIZZA_uxpilot_session3_mobile_flow.md)

### MARRYFOOD

- [Session 1 — Composants](./MARRYFOOD_uxpilot_session1_components.md)
- [Session 2 — Web Flow](./MARRYFOOD_uxpilot_session2_web_flow.md)

### MARRYCAR

- [Session 1 — Composants](./MARRYCAR_uxpilot_session1_components.md)
- [Session 2 — Web Flow](./MARRYCAR_uxpilot_session2_web_flow.md)

### MARRYSHOP

- [Session 1 — Composants](./MARRYSHOP_uxpilot_session1_components.md)
- [Session 2 — Web Flow](./MARRYSHOP_uxpilot_session2_web_flow.md)

---

## Comment utiliser ces prompts

### Dans UX Pilot

1. Ouvrir UX Pilot → "New project" → choisir le template
2. Copier la section **Design System** du prompt de Session 1
3. Coller dans le champ "Brand guidelines" de UX Pilot
4. Pour chaque composant, copier la description et générer

### Tips UX Pilot

- Générer en **1440px** pour le web flow, **390px** pour mobile
- Demander **"dark variant"** pour les sections footer/CTA
- Utiliser **"components first"** (session 1) avant les pages complètes
- Exporter en **Figma** → activer variables → mapper sur les tokens JSON

---

## Tokens de référence

Les JSON dans `packages/design-tokens/dist/` sont les sources de vérité pour les couleurs.
Toujours utiliser les valeurs hex exactes de ces fichiers dans les prompts.

```bash
# Régénérer les JSON depuis les tokens TypeScript
pnpm --filter @marrynov/design-tokens build
```

---

## Figma → Code (workflow complet)

Une fois les designs UX Pilot validés et importés dans Figma :

1. `get_variable_defs` → extraire les variables Figma → mettre à jour `packages/design-tokens/`
2. `get_design_context` → implémenter section par section dans le template
3. Code Connect → mapper composants Figma sur `packages/ui/`

Voir la skill `figma-to-code` pour le workflow complet.
